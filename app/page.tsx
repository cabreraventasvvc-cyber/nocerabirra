import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { contactLinks, contactPlaceholders, siteConfig } from "@/lib/config";
import { getFeaturedProducts } from "@/lib/catalog-data";

const quickLinks = [
  {
    href: "/pedido-rapido",
    title: "Comprar",
    text: "Pedido rapido para comercios y clientes frecuentes."
  },
  {
    href: "/catalogo",
    title: "Distribuidora",
    text: "Catalogo con rubros reales de la lista de precios."
  },
  {
    href: "/nocera-birra",
    title: "Nocera Birra",
    text: "Productos propios, recargas, latas y ediciones."
  },
  {
    href: "/franquicias",
    title: "Franquicias",
    text: "Formulario para interesados en el proyecto Nocera."
  },
  {
    href: "/historia",
    title: "Historia",
    text: "Contenido editable preparado para completar datos reales."
  }
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Distribuidora mayorista y productos propios</p>
          <h1>Nocera</h1>
          <p>
            Una plataforma para comprar bebidas, descubrir Nocera Birra y preparar el crecimiento
            comercial de la marca desde un unico panel.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/pedido-rapido">
              Hacer pedido
            </Link>
            <a className="button secondary" href={contactLinks.whatsapp}>
              WhatsApp
            </a>
            <Link className="button secondary" href="/nocera-birra">
              Ver Nocera Birra
            </Link>
          </div>
        </div>
        <div className="quick-links">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Lista {siteConfig.priceListDate}</p>
              <h2>Destacados</h2>
              <p>Productos cargados desde Supabase para pedidos mayoristas y venta frecuente.</p>
            </div>
            <Link className="button ghost" href="/catalogo">
              Ver catalogo
            </Link>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="section-inner split">
          <div>
            <p className="eyebrow">Arquitectura por etapas</p>
            <h2>Preparada para ecommerce, pedidos y administracion</h2>
            <p className="muted">
              Esta primera version deja la estructura lista para conectar Supabase, importar listas
              de precios, administrar categorias y guardar pedidos sin rearmar el frontend.
            </p>
            <div className="split-actions">
              <Link className="button" href="/admin">
                Ver panel previsto
              </Link>
              <Link className="button secondary" href="/franquicias">
                Quiero mi Nocera
              </Link>
            </div>
          </div>
          <div className="media-panel">
            <img src="/images/nocera-growler.jpg" alt="Growler Nocera Birra" />
          </div>
          <div className="panel">
            <strong>Datos de contacto</strong>
            <p className="muted">{siteConfig.location}</p>
            <p className="muted">{contactPlaceholders.phone}</p>
            <p className="muted">{contactPlaceholders.email}</p>
            <p className="muted">{contactPlaceholders.openingHours}</p>
            <div className="split-actions">
              <a className="button" href={contactLinks.whatsapp}>
                Escribir por WhatsApp
              </a>
              <a className="button secondary" href={contactLinks.email}>
                Enviar mail
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
