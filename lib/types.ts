export type Category = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;
  code: string;
  name: string;
  description: string;
  brand: string;
  categoryId: string;
  presentation: string;
  unit: string;
  packQuantity: number | null;
  price: number;
  promotionalPrice: number | null;
  promotionStartsAt: string | null;
  promotionEndsAt: string | null;
  available: boolean;
  active: boolean;
  featured: boolean;
  noceraProduct: boolean;
  image: string | null;
  updatedAt: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CheckoutData = {
  customerName?: string;
  phone?: string;
  deliveryMode: "envio" | "retiro";
  notes?: string;
};
