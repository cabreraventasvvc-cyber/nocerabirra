import { PriceImportClient } from "@/components/PriceImportClient";

export const metadata = {
  title: "Importar lista"
};

export default function ImportPriceListPage() {
  return (
    <main>
      <section className="section">
        <div className="section-inner">
          <div className="page-title">
            <p className="eyebrow">Administracion</p>
            <h1>Importar lista de precios</h1>
            <p>
              Etapa local para validar archivos, detectar productos nuevos y revisar cambios antes
              de aplicar. La persistencia definitiva se conectara con Supabase.
            </p>
          </div>
          <PriceImportClient />
        </div>
      </section>
    </main>
  );
}
