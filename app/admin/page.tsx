import Link from "next/link";

export const metadata = {
  title: "Admin"
};

const adminSections = [
  "Dashboard",
  "Productos",
  "Categorias",
  "Precios",
  "Promociones",
  "Stock",
  "Pedidos",
  "Clientes",
  "Consultas",
  "Interesados en franquicias",
  "Contenido institucional",
  "Redes sociales",
  "WhatsApp",
  "Configuracion general"
];

export default function AdminPreviewPage() {
  return (
    <main>
      <section className="section">
        <div className="section-inner">
          <div className="page-title">
            <p className="eyebrow">Vista previa</p>
            <h1>Panel administrador</h1>
            <p>
              Ruta reservada para la etapa de autenticacion y Supabase. Nocera Bar no forma parte
              del panel inicial.
            </p>
          </div>
          <div className="panel">
            <strong>Importacion de listas</strong>
            <p>Vista previa para CSV/Excel con deteccion de productos nuevos, precios y stock.</p>
            <div className="split-actions">
              <Link className="button" href="/admin/productos">
                Gestionar productos
              </Link>
              <Link className="button" href="/admin/importar-lista">
                Importar lista
              </Link>
              <Link className="button ghost" href="/admin/stock">
                Actualizar stock
              </Link>
              <Link className="button ghost" href="/admin/imagenes">
                Imagenes
              </Link>
              <Link className="button ghost" href="/admin/supabase">
                Probar Supabase
              </Link>
            </div>
          </div>
          <div className="product-grid">
            {adminSections.map((section) => (
              <article className="panel" key={section}>
                <strong>{section}</strong>
                <p>Modulo preparado para implementar por etapas.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
