import { CatalogClient } from "@/components/CatalogClient";
import { getCatalogData } from "@/lib/catalog-data";

export const metadata = {
  title: "Catalogo"
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const catalog = await getCatalogData();

  return (
    <main>
      <section className="section">
        <div className="section-inner">
          <div className="page-title">
            <p className="eyebrow">Distribuidora</p>
            <h1>Catalogo</h1>
            <p>
              Productos cargados desde Supabase. Si la base todavia no tiene productos, se muestra
              la semilla local para que la web siga funcionando.
            </p>
          </div>
          <CatalogClient categories={catalog.categories} products={catalog.products} />
        </div>
      </section>
    </main>
  );
}
