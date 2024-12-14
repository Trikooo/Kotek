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

  // UPDATED: Modify static parseSearchParams to handle array-based parameters
  static parseSearchParams(request: NextRequest): ProductSearchParams {
    const searchParams: ProductSearchParams = {
      currentPage: 1,
      pageSize: 10,
    };

    // Properly handle multi-value parameters
    const processMultiValueParam = (key: string): string[] | undefined => {
      const values = request.nextUrl.searchParams.getAll(key);
      return values.length > 0 ? values : undefined;
    };

    // Process specific multi-value parameters
    const categoryIds = processMultiValueParam("categoryIds[]");
    if (categoryIds) {
      searchParams.categoryIds = categoryIds;
    }

    const brands = processMultiValueParam("brands[]");
    if (brands) {
      searchParams.brands = brands;
    }

    const statuses = processMultiValueParam("statuses[]");
    if (statuses) {
      searchParams.statuses = statuses as ProductStatus[];
    }

    const tags = processMultiValueParam("tags[]");
    if (tags) {
      searchParams.tags = tags;
    }

    // Process single-value parameters
    const minPrice = request.nextUrl.searchParams.get("minPrice");
    if (minPrice) searchParams.minPrice = Number(minPrice);

    const maxPrice = request.nextUrl.searchParams.get("maxPrice");
    if (maxPrice) searchParams.maxPrice = Number(maxPrice);

    const currentPage = request.nextUrl.searchParams.get("currentPage");
    if (currentPage && !isNaN(Number(currentPage)) && Number(currentPage) > 0) {
      searchParams.currentPage = Number(currentPage);
    }

    const pageSize = request.nextUrl.searchParams.get("pageSize");
    if (pageSize) searchParams.pageSize = Number(pageSize);
    const query = request.nextUrl.searchParams.get("query");
    if (query) searchParams.query = query;
    return searchParams;
  }

  // UPDATED: Modify hasFilters to check new array-based parameters
  static hasFilters(request: NextRequest): boolean {
    const searchParams = this.parseSearchParams(request);
    return Object.keys(searchParams).some(
      (key) =>
        key !== "currentPage" &&
        key !== "pageSize" &&
        searchParams[key as keyof ProductSearchParams] !== undefined
    );
  }

  async searchProducts(params: unknown): Promise<ProductSearchResponse> {
    // Validate input using Zod
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
    } = validatedParams;

    // Calculate offset
    const offset = (currentPage - 1) * pageSize;
    // Sanitize query
    const sanitizedQuery = this.sanitizeQuery(query);
    console.log(validatedParams);
    const [countResult, productResults] = await this.prisma.$transaction([
      this.prisma.$queryRaw<Array<{ total_count: bigint }>>`
        WITH product_search AS (
          SELECT
            p.id,
            p.name,
            p.description,
            p.brand,
            p.price,
            p.status,
            p."categoryId",
            p.tags,
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
            AND (${
              statuses
                ? Prisma.sql`p.status::text IN (${Prisma.join(
                    statuses.map((status) => Prisma.sql`${status}::text`)
                  )})`
                : Prisma.sql`TRUE`
            })
            AND (${
              tags
                ? Prisma.sql`p.tags && ARRAY[${Prisma.join(tags)}]`
                : Prisma.sql`TRUE`
            })
          GROUP BY
            p.id, p.name, p.description, p.brand, p.price, p.status, p."categoryId", p.tags, c.tags
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
            AND (${
              statuses
                ? Prisma.sql`p.status::text IN (${Prisma.join(
                    statuses.map((status) => Prisma.sql`${status}::text`)
                  )})`
                : Prisma.sql`TRUE`
            })
            AND (${
              tags
                ? Prisma.sql`p.tags && ARRAY[${Prisma.join(tags)}]`
                : Prisma.sql`TRUE`
            })
          GROUP BY
            p.id, p.name, p.description, p.brand, p.price, p.status, p."categoryId", p.tags, c.tags
        )
        SELECT
          ps.*
        FROM
          product_search ps
        ORDER BY
          similarity_score DESC,
          price ASC
        LIMIT ${pageSize}
        OFFSET ${offset}
      `,
    ]);

    const totalCount = Number(countResult[0]?.total_count || 0); // Safely convert BigInt to number
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
