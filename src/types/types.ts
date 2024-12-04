import { $Enums, Category, OrderStatus, Product } from "@prisma/client";

export interface CreateProductT {
  name: string;
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

export interface ProductData {
  products: Product[];
  total: number;
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
  items: Omit<CartItem, "id" | "product">[];
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
  api_token: string;
  user_guid: string;
  reference: string | null;
  client: string;
  phone: string;
  phone_2?: string;
  adresse: string;
  wilaya_id: number;
  commune: string;
  montant: number;
  remarque?: string;
  produit: string; // Assuming it's a list of product references
  type_id: 1 | 2 | 3; // 1: Livraison, 2: Echange, 3: Pick up
  poids: number;
  stop_desk: 0 | 1; // 0: à domicile, 1: stop desk
  station_code?: string; // Required if stop_desk = 1
  stock: 0 | 1; // 0: Non, 1: Oui
  quantite?: string; // Required if stock = 1
  can_open: 0 | 1; // 0: Non, 1: Oui
};

export type KotekOrder = {
  status: OrderStatus;
  totalAmount: number;
  subtotalAmount: number;
  userId: string;
  addressId?: string; // Optional addressId field (can be null or undefined if no address id is provided (user logged out))
  guestAddress?: Address; // Optional address object, reflects the Address model
  items: {
    quantity: number;
    price: number;
    productId: string;
  }[];
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
  shippingPrice: number;
  stopDesk: boolean;
  stationCode?: string;
  stationName?: string;
}
