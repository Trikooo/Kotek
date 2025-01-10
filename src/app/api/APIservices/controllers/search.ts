import { Prisma, PrismaClient, ProductStatus } from "@prisma/client";
import { ProductSearchParamsSchema } from "../lib/validation";
import {
  ProductSearchParams,
  ProductSearchResponse,
  ProductSearchResult,
} from "@/types/types";
import { NextRequest } from "next/server";

export class ProductSearchService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private sanitizeQuery(query: string): string {
    if (!query) return "";

    return query
      .normalize("NFKD")
      .replace(/[^\p{L}\p{N}\s\-+.,:()]/gu, "")
      .trim()
      .slice(0, 100);
  }

  static parseSearchParams(request: NextRequest): ProductSearchParams {
    const params: Record<string, any> = {
      currentPage: 1,
      pageSize: 10,
    };

    const searchParams = request.nextUrl.searchParams;

    for (const [key, value] of searchParams.entries()) {
      const baseKey = key.endsWith("[]") ? key.slice(0, -2) : key;

      if (key.endsWith("[]")) {
        params[baseKey] = searchParams.getAll(key);
      } else if (
        ["minPrice", "maxPrice", "currentPage", "pageSize"].includes(key)
      ) {
        params[key] = Number(value);
      } else if (key === "store") {
        params[key] = value === "true";
      } else {
        params[key] = value;
      }
    }

    return params as ProductSearchParams;
  }
  static hasFilters(searchParams: ProductSearchParams): boolean {
    return Object.keys(searchParams).some(
      (key) =>
        key !== "currentPage" &&
        key !== "pageSize" &&
        key !== "store" &&
        searchParams[key as keyof ProductSearchParams] !== undefined
    );
  }

  async searchProducts(params: unknown): Promise<ProductSearchResponse> {
    const validatedParams = ProductSearchParamsSchema.parse(params);

    const {
      query = "",
      categoryIds,
      minPrice,
      maxPrice,
      brands,
      statuses,
      tags,
      currentPage = 1,
      pageSize = 10,
      sort = "featured",
      store = true,
    } = validatedParams;

    const offset = (currentPage - 1) * pageSize;
    const sanitizedQuery = this.sanitizeQuery(query);

    // Status filtering logic
    const statusFilter = (() => {
      if (store) {
        return statuses
          ? Prisma.sql`p.status::text IN (${Prisma.join(
              statuses.map((status) => Prisma.sql`${status}::text`)
            )}) AND p.status::text IN ('ACTIVE', 'INACTIVE')`
          : Prisma.sql`p.status::text IN ('ACTIVE', 'INACTIVE')`;
      }
      return statuses
        ? Prisma.sql`p.status::text IN (${Prisma.join(
            statuses.map((status) => Prisma.sql`${status}::text`)
          )})`
        : Prisma.sql`TRUE`;
    })();

    const orderByClause = (() => {
      switch (sort) {
        case "price-asc":
          return Prisma.sql`
            CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END DESC,
            similarity_score DESC,
            price ASC,
            featured DESC
          `;
        case "price-desc":
          return Prisma.sql`
            CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END DESC,
            similarity_score DESC,
            price DESC,
            featured DESC
          `;
        case "newest":
          return Prisma.sql`
            CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END DESC,
            similarity_score DESC,
            "createdAt" DESC,
            featured DESC
          `;
        default: // 'featured'
          return Prisma.sql`
            CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END DESC,
            similarity_score DESC,
            featured DESC,
            price ASC
          `;
      }
    })();

    const [countResult, productResults] = await this.prisma.$transaction([
      this.prisma.$queryRaw<Array<{ total_count: bigint }>>`
        WITH product_search AS (
          SELECT
            p.*,
            c.tags AS category_tags,
            (
              GREATEST(
                similarity(p.name, ${sanitizedQuery}) * 0.6,
                similarity(p.description, ${sanitizedQuery}) * 0.3,
                similarity(p.brand, ${sanitizedQuery}) * 0.3,
                COALESCE(MAX(similarity(tag, ${sanitizedQuery})) * 0.21, 0),
                COALESCE(MAX(similarity(c_tag, ${sanitizedQuery})) * 0.2, 0)
              )
            ) AS similarity_score
          FROM
            "Product" p
          LEFT JOIN "Category" c ON p."categoryId" = c.id
          LEFT JOIN LATERAL unnest(p.tags) AS tag ON true
          LEFT JOIN LATERAL unnest(c.tags) AS c_tag ON true
          WHERE
            (${sanitizedQuery} = '' OR
            similarity(p.name, ${sanitizedQuery}) > 0.3 OR
            similarity(p.description, ${sanitizedQuery}) > 0.3 OR
            similarity(p.brand, ${sanitizedQuery}) > 0.3 OR
            similarity(tag, ${sanitizedQuery}) > 0.3 OR
            similarity(c_tag, ${sanitizedQuery}) > 0.3)
            AND (${
              categoryIds
                ? Prisma.sql`p."categoryId" IN (${Prisma.join(
                    categoryIds.map((id) => Prisma.sql`${id}::uuid`)
                  )})`
                : Prisma.sql`TRUE`
            })
            AND (${
              minPrice ? Prisma.sql`p.price >= ${minPrice}` : Prisma.sql`TRUE`
            })
            AND (${
              maxPrice ? Prisma.sql`p.price <= ${maxPrice}` : Prisma.sql`TRUE`
            })
            AND (${
              brands
                ? Prisma.sql`p.brand IN (${Prisma.join(brands)})`
                : Prisma.sql`TRUE`
            })
            AND ${statusFilter}
            AND (${
              tags
                ? Prisma.sql`p.tags && ARRAY[${Prisma.join(tags)}]`
                : Prisma.sql`TRUE`
            })
          GROUP BY
            p.id, p.name, p.description, p.brand, p.price, p.status, p."categoryId", p.tags, p.featured, c.tags, p."createdAt"
        )
        SELECT COUNT(*) AS total_count FROM product_search
      `,
      this.prisma.$queryRaw<ProductSearchResult[]>`
        WITH product_search AS (
          SELECT
            p.*,
            c.tags AS category_tags,
            (
              GREATEST(
                similarity(p.name, ${sanitizedQuery}) * 0.6,
                similarity(p.description, ${sanitizedQuery}) * 0.3,
                similarity(p.brand, ${sanitizedQuery}) * 0.2,
                COALESCE(MAX(similarity(tag, ${sanitizedQuery})) * 0.21, 0),
                COALESCE(MAX(similarity(c_tag, ${sanitizedQuery})) * 0.2, 0)
              )
            ) AS similarity_score
          FROM
            "Product" p
          LEFT JOIN "Category" c ON p."categoryId" = c.id
          LEFT JOIN LATERAL unnest(p.tags) AS tag ON true
          LEFT JOIN LATERAL unnest(c.tags) AS c_tag ON true
          WHERE
            (${sanitizedQuery} = '' OR
            similarity(p.name, ${sanitizedQuery}) > 0.3 OR
            similarity(p.description, ${sanitizedQuery}) > 0.3 OR
            similarity(p.brand, ${sanitizedQuery}) > 0.3 OR
            similarity(tag, ${sanitizedQuery}) > 0.3 OR
            similarity(c_tag, ${sanitizedQuery}) > 0.3)
            AND (${
              categoryIds
                ? Prisma.sql`p."categoryId" IN (${Prisma.join(
                    categoryIds.map((id) => Prisma.sql`${id}::uuid`)
                  )})`
                : Prisma.sql`TRUE`
            })
            AND (${
              minPrice ? Prisma.sql`p.price >= ${minPrice}` : Prisma.sql`TRUE`
            })
            AND (${
              maxPrice ? Prisma.sql`p.price <= ${maxPrice}` : Prisma.sql`TRUE`
            })
            AND (${
              brands
                ? Prisma.sql`p.brand IN (${Prisma.join(brands)})`
                : Prisma.sql`TRUE`
            })
            AND ${statusFilter}
            AND (${
              tags
                ? Prisma.sql`p.tags && ARRAY[${Prisma.join(tags)}]`
                : Prisma.sql`TRUE`
            })
          GROUP BY
            p.id, p.name, p.description, p.brand, p.price, p.status, p."categoryId", p.tags, p.featured, p."createdAt", c.tags
        )
        SELECT
          ps.*,
          ps.similarity_score
        FROM
          product_search ps
        ORDER BY
          ${orderByClause}
        LIMIT ${pageSize}
        OFFSET ${offset}
      `,
    ]);

    const totalCount = Number(countResult[0]?.total_count || 0);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      products: productResults,
      pagination: {
        currentPage: currentPage,
        pageSize,
        total: totalCount,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  }
}
