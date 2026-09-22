"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { formatPrice } from "./CartProvider";

type CategoryOption = {
  id: string;
  slug: string;
  name: string;
};

type AdminProduct = {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  brand: string | null;
  category_id: string | null;
  presentation: string | null;
  unit: string | null;
  pack_quantity: number | null;
  price: number;
  stock_status: string;
  stock_quantity: number | null;
  active: boolean;
  featured: boolean;
  nocera_product: boolean;
  image_path: string | null;
};

type ProductForm = {
  id?: string;
  code: string;
  name: string;
  description: string;
  brand: string;
  categoryId: string;
  presentation: string;
  unit: string;
  packQuantity: string;
  price: string;
  stockStatus: "available" | "out_of_stock";
  stockQuantity: string;
  active: boolean;
  featured: boolean;
  noceraProduct: boolean;
  imagePath: string;
};

type StockFilter = "all" | "controlled" | "uncontrolled" | "out_of_stock" | "inactive";

const emptyForm: ProductForm = {
  code: "",
  name: "",
  description: "",
  brand: "",
  categoryId: "",
  presentation: "",
  unit: "unidad",
  packQuantity: "",
  price: "",
  stockStatus: "available",
  stockQuantity: "",
  active: true,
  featured: false,
  noceraProduct: false,
  imagePath: ""
};

export function AdminProductsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const stockSummary = useMemo(
    () => ({
      total: products.length,
      controlled: products.filter((product) => product.stock_quantity !== null).length,
      uncontrolled: products.filter((product) => product.stock_quantity === null).length,
      outOfStock: products.filter((product) => product.stock_status === "out_of_stock").length,
      inactive: products.filter((product) => !product.active).length
    }),
    [products]
  );

  const visibleProducts = useMemo(() => {
    const normalized = query.toLowerCase();
    return products.filter((product) =>
      `${product.code ?? ""} ${product.name} ${product.brand ?? ""}`.toLowerCase().includes(normalized) &&
      matchesStockFilter(product, stockFilter)
    );
  }, [products, query, stockFilter]);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoading(true);
    setStatus("");
    const supabase = createBrowserSupabaseClient();
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      router.push("/admin/login");
      return;
    }

    setEmail(sessionData.session.user.email ?? "");

    const [productResult, categoryResult] = await Promise.all([
      supabase
        .from("products")
        .select(
          "id,code,name,description,brand,category_id,presentation,unit,pack_quantity,price,stock_status,stock_quantity,active,featured,nocera_product,image_path"
        )
        .order("name", { ascending: true }),
      supabase.from("categories").select("id,slug,name").order("sort_order", { ascending: true })
    ]);

    if (productResult.error || categoryResult.error) {
      setStatus("No se pudieron cargar productos. Revisar permisos de administrador en Supabase.");
      setLoading(false);
      return;
    }

    const loadedCategories = (categoryResult.data ?? []) as CategoryOption[];
    setCategories(loadedCategories);
    setProducts((productResult.data ?? []) as AdminProduct[]);
    setForm((current) => ({
      ...current,
      categoryId: current.categoryId || loadedCategories[0]?.id || ""
    }));
    setLoading(false);
  }

  async function logout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function editProduct(product: AdminProduct) {
    setForm({
      id: product.id,
      code: product.code ?? "",
      name: product.name,
      description: product.description ?? "",
      brand: product.brand ?? "",
      categoryId: product.category_id ?? categories[0]?.id ?? "",
      presentation: product.presentation ?? "",
      unit: product.unit ?? "unidad",
      packQuantity: product.pack_quantity?.toString() ?? "",
      price: product.price.toString(),
      stockStatus: product.stock_status === "out_of_stock" ? "out_of_stock" : "available",
      stockQuantity: product.stock_quantity?.toString() ?? "",
      active: product.active,
      featured: product.featured,
      noceraProduct: product.nocera_product,
      imagePath: product.image_path ?? ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const supabase = createBrowserSupabaseClient();
    const payload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      description: form.description.trim() || null,
      brand: form.brand.trim() || null,
      category_id: form.categoryId || null,
      presentation: form.presentation.trim() || null,
      unit: form.unit.trim() || null,
      pack_quantity: form.packQuantity ? Number(form.packQuantity) : null,
      price: Number(form.price),
      stock_status: form.stockStatus,
      stock_quantity: form.stockQuantity ? Number(form.stockQuantity) : null,
      active: form.active,
      featured: form.featured,
      nocera_product: form.noceraProduct,
      image_path: form.imagePath.trim() || null
    };

    const result = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (result.error) {
      setStatus(`No se pudo guardar: ${result.error.message}`);
      return;
    }

    setStatus(form.id ? "Producto actualizado." : "Producto agregado.");
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    await loadAdminData();
  }

  async function uploadProductImage(file: File) {
    setUploadingImage(true);
    setStatus("");

    if (!file.type.startsWith("image/")) {
      setStatus("El archivo elegido no parece ser una imagen.");
      setUploadingImage(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const productCode = form.code.trim().toLowerCase() || form.id || "producto";
    const safeCode = productCode.replace(/[^a-z0-9-]/g, "-");
    const filePath = `${safeCode}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true
    });

    setUploadingImage(false);

    if (error) {
      setStatus(`No se pudo subir la foto: ${error.message}. Revisar el SQL de Storage.`);
      return;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    setForm((current) => ({ ...current, imagePath: data.publicUrl }));
    setStatus("Foto subida. Ahora guarda el producto para aplicar el cambio.");
  }

  async function toggleActive(product: AdminProduct) {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("products").update({ active: !product.active }).eq("id", product.id);
    if (error) {
      setStatus(`No se pudo cambiar el estado: ${error.message}`);
      return;
    }
    await loadAdminData();
  }

  async function deleteProduct(product: AdminProduct) {
    const confirmed = window.confirm(`Eliminar definitivamente ${product.name}?`);
    if (!confirmed) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      setStatus(`No se pudo eliminar: ${error.message}`);
      return;
    }
    await loadAdminData();
  }

  if (loading) {
    return <div className="panel">Cargando administrador...</div>;
  }

  return (
    <div className="admin-products">
      <section className="panel form-stack">
        <div className="admin-toolbar">
          <div>
            <strong>{form.id ? "Editar producto" : "Agregar producto"}</strong>
            <p className="muted">Sesion: {email}</p>
          </div>
          <button className="button ghost" type="button" onClick={logout}>
            Salir
          </button>
        </div>

        <form className="form-stack" onSubmit={saveProduct}>
          <div className="form-grid">
            <input
              className="input"
              placeholder="Codigo"
              value={form.code}
              onChange={(event) => setForm({ ...form, code: event.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Nombre"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
            <select
              className="select"
              value={form.categoryId}
              onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Marca"
              value={form.brand}
              onChange={(event) => setForm({ ...form, brand: event.target.value })}
            />
            <input
              className="input"
              placeholder="Presentacion"
              value={form.presentation}
              onChange={(event) => setForm({ ...form, presentation: event.target.value })}
            />
            <input
              className="input"
              placeholder="Unidad"
              value={form.unit}
              onChange={(event) => setForm({ ...form, unit: event.target.value })}
            />
            <input
              className="input"
              min="0"
              step="0.01"
              type="number"
              placeholder="Precio"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
              required
            />
            <input
              className="input"
              min="0"
              step="1"
              type="number"
              placeholder="Unidades por pack opcional"
              value={form.packQuantity}
              onChange={(event) => setForm({ ...form, packQuantity: event.target.value })}
            />
            <select
              className="select"
              value={form.stockStatus}
              onChange={(event) =>
                setForm({ ...form, stockStatus: event.target.value as ProductForm["stockStatus"] })
              }
            >
              <option value="available">Disponible</option>
              <option value="out_of_stock">Sin stock</option>
            </select>
            <input
              className="input"
              min="0"
              step="1"
              type="number"
              placeholder="Stock opcional"
              value={form.stockQuantity}
              onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })}
            />
            <input
              className="input"
              placeholder="URL o ruta de foto"
              value={form.imagePath}
              onChange={(event) => setForm({ ...form, imagePath: event.target.value })}
            />
            <label className="file-upload">
              <span>{uploadingImage ? "Subiendo foto..." : "Subir foto"}</span>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadProductImage(file);
                    event.target.value = "";
                  }
                }}
              />
            </label>
            {form.imagePath && (
              <div className="admin-image-preview">
                <img src={form.imagePath} alt="Vista previa del producto" />
              </div>
            )}
            <textarea
              className="textarea full"
              placeholder="Descripcion"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </div>

          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
              />
              Activo
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm({ ...form, featured: event.target.checked })}
              />
              Destacado
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.noceraProduct}
                onChange={(event) => setForm({ ...form, noceraProduct: event.target.checked })}
              />
              Producto Nocera
            </label>
          </div>

          <div className="form-actions">
            <button className="button" type="submit" disabled={saving}>
              {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Agregar producto"}
            </button>
            <button
              className="button ghost"
              type="button"
              onClick={() => setForm({ ...emptyForm, categoryId: categories[0]?.id || "" })}
            >
              Nuevo
            </button>
          </div>
          {status && <p className="form-status">{status}</p>}
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h2>Productos</h2>
            <p>{visibleProducts.length} productos encontrados.</p>
          </div>
          <div className="admin-list-tools">
            <input
              className="input admin-search"
              placeholder="Buscar por codigo, nombre o marca"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              className="select admin-filter"
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value as StockFilter)}
            >
              <option value="all">Todos</option>
              <option value="controlled">Con stock cargado</option>
              <option value="uncontrolled">Sin control de stock</option>
              <option value="out_of_stock">Sin stock</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="admin-metrics">
          <button className="metric-card" type="button" onClick={() => setStockFilter("all")}>
            <span>Total</span>
            <strong>{stockSummary.total}</strong>
          </button>
          <button className="metric-card" type="button" onClick={() => setStockFilter("controlled")}>
            <span>Con stock</span>
            <strong>{stockSummary.controlled}</strong>
          </button>
          <button className="metric-card" type="button" onClick={() => setStockFilter("uncontrolled")}>
            <span>Sin control</span>
            <strong>{stockSummary.uncontrolled}</strong>
          </button>
          <button className="metric-card" type="button" onClick={() => setStockFilter("out_of_stock")}>
            <span>Sin stock</span>
            <strong>{stockSummary.outOfStock}</strong>
          </button>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>${formatPrice(Number(product.price))}</td>
                  <td>
                    {product.stock_status === "available" ? "Disponible" : "Sin stock"}
                    {product.stock_quantity !== null ? ` (${product.stock_quantity})` : ""}
                  </td>
                  <td>{product.active ? "Activo" : "Inactivo"}</td>
                  <td>
                    <div className="table-actions">
                      <button className="button ghost" type="button" onClick={() => editProduct(product)}>
                        Editar
                      </button>
                      <button className="button ghost" type="button" onClick={() => toggleActive(product)}>
                        {product.active ? "Desactivar" : "Activar"}
                      </button>
                      <button className="button ghost" type="button" onClick={() => deleteProduct(product)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function matchesStockFilter(product: AdminProduct, filter: StockFilter) {
  if (filter === "controlled") {
    return product.stock_quantity !== null;
  }

  if (filter === "uncontrolled") {
    return product.stock_quantity === null;
  }

  if (filter === "out_of_stock") {
    return product.stock_status === "out_of_stock";
  }

  if (filter === "inactive") {
    return !product.active;
  }

  return true;
}
