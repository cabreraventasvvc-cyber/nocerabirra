import { contactLinks, siteConfig } from "@/lib/config";

export const metadata = {
  title: "Contacto"
};

export default function ContactPage() {
  return (
    <main>
      <section className="section">
        <div className="section-inner split">
          <div className="page-title">
            <p className="eyebrow">Contacto</p>
            <h1>Hablemos</h1>
            <p>
              Formulario general preparado para guardar consultas cuando conectemos Supabase.
            </p>
            <div className="panel">
              <strong>Nocera Distribuidora</strong>
              <p>{siteConfig.location}</p>
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.openingHours} {siteConfig.whatsappLabel}.</p>
              <p>{siteConfig.email}</p>
            </div>
            <div className="split-actions">
              <a className="button" href={contactLinks.whatsapp}>
                WhatsApp
              </a>
              <a className="button ghost" href={contactLinks.email}>
                Mail
              </a>
              <a className="button ghost" href={contactLinks.maps}>
                Como llegar
              </a>
              <a className="button ghost" href={siteConfig.instagram.distribuidora}>
                Instagram Distribuidora
              </a>
            </div>
          </div>
          <form className="panel">
            <div className="form-grid">
              <input className="input full" placeholder="Nombre" />
              <input className="input" placeholder="Telefono" />
              <input className="input" type="email" placeholder="Email" />
              <input className="input full" placeholder="Motivo" />
              <textarea className="textarea full" placeholder="Mensaje" />
            </div>
            <div className="form-actions">
              <button className="button" type="button">
                Enviar consulta
              </button>
            </div>
          </form>
          <div className="media-panel">
            <img src="/images/nocera-cartel.jpg" alt="Nocera Birra" />
          </div>
        </div>
      </section>
    </main>
  );
}
