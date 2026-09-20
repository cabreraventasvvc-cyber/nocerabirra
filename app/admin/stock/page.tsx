import { StockImportClient } from "@/components/StockImportClient";
import { getCatalogData } from "@/lib/catalog-data";

export const metadata = {
  title: "Actualizar stock"
};

export const dynamic = "force-dynamic";

export default async function StockAdminPage() {
  const catalog = await getCatalogData();

  return (
    <main>
      <section className="section">
        <div className="section-inner">
          <div className="page-title">
            <p className="eyebrow">Administracion</p>
            <h1>Actualizar stock</h1>
            <p>
              Carga masiva para marcar productos disponibles o sin stock usando codigo comercial.
              La aplicacion genera SQL seguro para ejecutar en Supabase.
            </p>
          </div>
          <StockImportClient products={catalog.products} />
        </div>
      </section>
    </main>
  );
}
