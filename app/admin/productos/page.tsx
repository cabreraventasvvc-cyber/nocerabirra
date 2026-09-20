import { AdminProductsClient } from "@/components/AdminProductsClient";

export const metadata = {
  title: "Productos admin"
};

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <main>
      <section className="section">
        <div className="section-inner">
          <div className="page-title">
            <p className="eyebrow">Administracion</p>
            <h1>Productos</h1>
            <p>Agregar, modificar, desactivar, eliminar y completar fotos, descripciones, precios y stock.</p>
          </div>
          <AdminProductsClient />
        </div>
      </section>
    </main>
  );
}
