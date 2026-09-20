import { ProductImageImportClient } from "@/components/ProductImageImportClient";
import { getCatalogData } from "@/lib/catalog-data";

export const metadata = {
  title: "Imagenes de productos"
};

export const dynamic = "force-dynamic";

export default async function ProductImagesAdminPage() {
  const catalog = await getCatalogData();

  return (
    <main>
      <section className="section">
        <div className="section-inner">
          <div className="page-title">
            <p className="eyebrow">Administracion</p>
            <h1>Imagenes de productos</h1>
            <p>
              Carga masiva para asociar fotos al catalogo usando codigo comercial y una URL publica
              o ruta de imagen.
            </p>
          </div>
          <ProductImageImportClient products={catalog.products} />
        </div>
      </section>
    </main>
  );
}
