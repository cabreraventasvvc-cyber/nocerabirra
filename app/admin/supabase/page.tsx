import Link from "next/link";
import { createSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";

export const metadata = {
  title: "Estado Supabase"
};

export const dynamic = "force-dynamic";

type CategoryRow = {
  slug: string;
  name: string;
  active: boolean;
};

async function loadCategories() {
  if (!hasSupabaseConfig()) {
    return {
      categories: [],
      error: "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local."
    };
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("slug,name,active")
    .order("sort_order", { ascending: true })
    .limit(12);

  return {
    categories: (data ?? []) as CategoryRow[],
    error: error?.message ?? null
  };
}

export default async function SupabaseStatusPage() {
  const { categories, error } = await loadCategories();
  const connected = !error;

  return (
    <main>
      <section className="section">
        <div className="section-inner">
          <div className="page-title">
            <p className="eyebrow">Admin</p>
            <h1>Estado Supabase</h1>
            <p>Prueba de conexion contra la tabla de categorias creada en la base.</p>
          </div>

          <div className="panel import-layout">
            <strong>{connected ? "Conexion activa" : "Revisar conexion"}</strong>
            <p>
              {connected
                ? `Supabase respondio correctamente. Categorias leidas: ${categories.length}.`
                : error}
            </p>
            <div className="split-actions">
              <Link className="button" href="/admin">
                Volver al admin
              </Link>
              <Link className="button ghost" href="/admin/importar-lista">
                Importar lista
              </Link>
            </div>
          </div>

          {connected ? (
            <div className="panel table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Slug</th>
                    <th>Categoria</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.slug}>
                      <td>{category.slug}</td>
                      <td>{category.name}</td>
                      <td>{category.active ? "Activa" : "Inactiva"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
