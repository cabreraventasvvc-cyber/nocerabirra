import { createSupabaseClient, hasSupabaseConfig } from "./supabase";
import { categories as localCategories, products as localProducts } from "./products";
import type { Category, Product } from "./types";

type SupabaseProductRow = {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  brand: string | null;
  presentation: string | null;
  unit: string | null;
  pack_quantity: number | null;
  price: number | null;
  promotional_price: number | null;
  promotion_starts_at: string | null;
  promotion_ends_at: string | null;
  stock_status: string;
  active: boolean;
  featured: boolean;
  nocera_product: boolean;
  image_path: string | null;
  updated_at: string;
  categories:
    | {
        slug: string;
      }
    | {
        slug: string;
      }[]
    | null;
};

type SupabaseCategoryRow = {
  slug: string;
  name: string;
  description: string | null;
  active: boolean;
  sort_order: number;
};

export type CatalogData = {
  categories: Category[];
  products: Product[];
  source: "supabase" | "local";
};

export async function getCatalogData(): Promise<CatalogData> {
  if (!hasSupabaseConfig()) {
    return getLocalCatalogData();
  }

  try {
    const supabase = createSupabaseClient();
    const [categoryResult, productResult] = await Promise.all([
      supabase
        .from("categories")
        .select("slug,name,description,active,sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select(
          "id,code,name,description,brand,presentation,unit,pack_quantity,price,promotional_price,promotion_starts_at,promotion_ends_at,stock_status,active,featured,nocera_product,image_path,updated_at,categories(slug)"
        )
        .eq("active", true)
        .order("name", { ascending: true })
    ]);

    if (categoryResult.error || productResult.error || !productResult.data?.length) {
      return getLocalCatalogData();
    }

    return {
      categories: (categoryResult.data as SupabaseCategoryRow[]).map(mapCategory),
      products: (productResult.data as unknown as SupabaseProductRow[]).map(mapProduct),
      source: "supabase"
    };
  } catch {
    return getLocalCatalogData();
  }
}

export async function getFeaturedProducts() {
  const catalog = await getCatalogData();
  return catalog.products.filter((product) => product.featured);
}

function getLocalCatalogData(): CatalogData {
  return {
    categories: localCategories,
    products: localProducts,
    source: "local"
  };
}

function mapCategory(row: SupabaseCategoryRow): Category {
  return {
    id: row.slug,
    name: row.name,
    description: row.description ?? "",
    active: row.active,
    sortOrder: row.sort_order
  };
}

function mapProduct(row: SupabaseProductRow): Product {
  return {
    id: row.id,
    code: row.code ?? "",
    name: row.name,
    description: row.description ?? "",
    brand: row.brand ?? "Nocera",
    categoryId: getProductCategorySlug(row.categories),
    presentation: row.presentation ?? "",
    unit: row.unit ?? "unidad",
    packQuantity: row.pack_quantity,
    price: Number(row.price ?? 0),
    promotionalPrice: row.promotional_price === null ? null : Number(row.promotional_price),
    promotionStartsAt: row.promotion_starts_at,
    promotionEndsAt: row.promotion_ends_at,
    available: row.stock_status === "available",
    active: row.active,
    featured: row.featured,
    noceraProduct: row.nocera_product,
    image: row.image_path,
    updatedAt: row.updated_at
  };
}

function getProductCategorySlug(category: SupabaseProductRow["categories"]) {
  if (Array.isArray(category)) {
    return category[0]?.slug ?? "productos-nocera";
  }

  return category?.slug ?? "productos-nocera";
}
