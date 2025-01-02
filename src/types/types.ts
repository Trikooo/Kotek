import {
  $Enums,
  Category,
  OrderStatus,
  Product,
  ProductStatus,
  User,
} from "@prisma/client";

export interface CreateProductT {
  name: string;
  featured: boolean;
  description: string;
  price: string;
  images: File[];
  stock: string;
  barcode: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  tags: string;
  keyFeatures: string;
  brand: string | null;
  status: $Enums.ProductStatus;
  length: string | null;
  width: string | null;
  height: string | null;
  weight: string | null;
}

export interface CreateCategoryT {
  id: string;
  name: string;
  description?: string;
  image: File;
  tags?: string;
  parentId?: string;
  subcategoryIds: string[];
}

export interface CategoryWithSubcategoriesT extends Category {
  subcategories: Category[];
}

export interface CategoryValidationT {
  name: string;
  description?: string;
  imageUrl: string;
  parentId?: string;
  tags: string[];
  subcategories: string[];
}
export interface ProductValidationT {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrls: string[];
  stock: number;
  barcode: string | null;
  categoryId: string | null;
  tags: string[];
  keyFeatures: string[];
  brand: string | null;
  status: $Enums.ProductStatus;
  length: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
}

// types.ts
export type CartProduct = {
  name: string;
  imageUrls: string[];
};

export type Cart = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: Omit<CartItem, "id">[];
};

export type FetchCart = {
  id: string | null;
  userId: string | null;
  items: CartItem[] | [];
};
export type CartItem = {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product: CartProduct;
};

export type CartUpdateResponse = {
  message: string;
  updatedCart?: Cart;
  error?: string;
};

export type Wilaya = {
  id: string;
  communes: string[];
  noest: {
    stations: {
      commune: string;
      stationCode: string;
    }[];
    prices: {
      home: number;
      stopDesk: number;
    };
  };
  legacyData?: {
    previousWilaya: string;
    previousId: string;
  };
};

export type Wilayas = Record<string, Wilaya>;

export type NoestOrderForm = {
  reference?: string | null;
  client: string;
  phone: string;
  phone_2?: string | null;
  adresse: string;
  wilaya_id: number;
  commune: string;
  montant: number;
  remarque?: string | null;
  produit: string; // Assuming it's a list of product references
  type_id: 1 | 2 | 3; // 1: Livraison, 2: Echange, 3: Pick up
  poids: number;
  stop_desk: 0 | 1; // 0: à domicile, 1: stop desk
  station_code?: string | null; // Required if stop_desk = 1
  stock: 0 | 1; // 0: Non, 1: Oui
  quantite?: string | null; // Required if stock = 1
  can_open: 0 | 1; // 0: Non, 1: Oui
};

export type KotekOrder = {
  id?: string;
  createdAt?: string;
  status: OrderStatus;
  totalAmount: number;
  subtotalAmount: number;
  userId: string;
  addressId?: string; // Optional addressId field (can be null or undefined if no address id is provided (user logged out))
  guestAddress?: Address; // Optional address object, reflects the Address model (should only be present if the user places an order as guest)
  items: {
    id?: string;
    quantity: number;
    price: number;
    noestReady: boolean;
    productId: string;
    trackingId?: string | null;
    tracking?: {
      trackingNumber: string;
      trackingStatus: OrderStatus;
    } | null;
    product?: {
      name: string;
      imageUrls: string[];
      weight: number;
    }; // the product is always fetched back from the database. (made optional for client side order creation)
  }[];
  user?: User;
  address?: Address;
  shippingPrice: number;
};
export interface Address {
  id?: string;
  fullName: string;
  phoneNumber: string;
  secondPhoneNumber?: string;
  wilayaValue: string;
  wilayaLabel: string;
  commune: string;
  address: string;
  stopDesk: boolean;
  stationCode?: string | null;
  stationName?: string | null;
  baseShippingPrice: number;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NOEST_TOKEN: string;
      NOEST_GUID: string;
      R2_TOKEN: string;
      R2_ACCESS_KEY_ID: string;
      R2_SECRET_ACCESS_KEY: string;
      R2_ENDPOINT: string;
      R2_BUCKET_NAME: string;
      R2_PUBLIC_ENDPOINT: string;
    }
  }
}
export interface ProductSearchResult extends Product {
  similarity_score: number;
}
export type ProductSearchResponse = {
  products: ProductSearchResult[];
  pagination: PaginationMetadata;
};

export type GetAllProductsResponse = {
  products: Product[];
  pagination: PaginationMetadata;
};

export interface ProductSearchParams {
  query?: string;
  categoryIds?: string[];
  brands?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  currentPage: number;
  pageSize: number;
  statuses?: ProductStatus[];
  sort?: string;
}

export interface BrandResponse {
  brands: string[];
}
export interface CategoryName {
  id: string;
  name: string;
}

export interface NoestCreateResponse {
  success: boolean;
  tracking: string;
}
export interface ExtendedNoestCreateResponse {
  noest: {
    response?: NoestCreateResponse;
    error?: any;
    items?: NoestOrderForm["produit"];
  }[];
  kotek: KotekOrder;
}

export interface OrderData {
  kotek: Partial<KotekOrder>;
  noest: NoestOrderForm[];
}
