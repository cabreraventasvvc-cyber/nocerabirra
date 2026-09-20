import { CatalogClient } from "@/components/CatalogClient";
import { getCatalogData } from "@/lib/catalog-data";

export const metadata = {
  title: "Nocera Birra"
};

export const dynamic = "force-dynamic";

export default async function NoceraBirraPage() {
  const catalog = await getCatalogData();

  return (
    <main>
      <section className="section dark">
        <div className="section-inner split">
          <div>
            <p className="eyebrow">Productos propios</p>
            <h1>Nocera Birra</h1>
            <p className="muted">
              Cervezas artesanales, recargas y destilados de autor producidos desde Quilmes Oeste
              con foco en calidad, identidad y crecimiento comercial.
            </p>
          </div>
          <div className="media-panel">
            <img src="/images/nocera-productos.jpg" alt="Cervezas y destilados Nocera" />
          </div>
        </div>
      </section>
      <section className="section cream">
        <div className="section-inner split">
          <div>
            <p className="eyebrow">Impronta</p>
            <h2>Destilados de autor</h2>
            <p>
              Ademas de cerveza, la marca desarrolla gin y otros destilados propios como parte de
              su propuesta para consumo y franquicias.
            </p>
          </div>
          <div className="image-stack">
            <img src="/images/impronta-botella.jpg" alt="Botella Impronta" />
            <img src="/images/nocera-honey.jpg" alt="Cerveza Honey Nocera" />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Coleccion especial</p>
              <h2>Productos Nocera</h2>
            </div>
          </div>
          <CatalogClient categories={catalog.categories} products={catalog.products} onlyNocera />
        </div>
      </section>
    </main>
  );
}
