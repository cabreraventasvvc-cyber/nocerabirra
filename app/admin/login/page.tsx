import { AdminLoginClient } from "@/components/AdminLoginClient";

export const metadata = {
  title: "Login administrador"
};

export default function AdminLoginPage() {
  return (
    <main>
      <section className="section">
        <div className="section-inner">
          <div className="page-title">
            <p className="eyebrow">Admin</p>
            <h1>Acceso administrador</h1>
            <p>Ingreso privado para gestionar productos, precios, stock, fotos y descripcion.</p>
          </div>
          <AdminLoginClient />
        </div>
      </section>
    </main>
  );
}
