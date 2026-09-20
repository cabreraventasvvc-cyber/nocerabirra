import { QuickOrderClient } from "@/components/QuickOrderClient";
import { getCatalogData } from "@/lib/catalog-data";

export const metadata = {
  title: "Pedido rapido"
};

export const dynamic = "force-dynamic";

export default async function QuickOrderPage() {
  const catalog = await getCatalogData();

  return (
    <main>
      <section className="section">
        <div className="section-inner">
          <div className="page-title">
            <p className="eyebrow">Para comercios y clientes frecuentes</p>
            <h1>Pedido rapido</h1>
            <p>
              Buscador instantaneo, cantidad y agregar al carrito sin entrar producto por producto.
            </p>
          </div>
          <QuickOrderClient products={catalog.products} />
        </div>
      </section>
    </main>
  );
}
