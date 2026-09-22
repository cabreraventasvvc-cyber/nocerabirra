import { contactLinks, siteConfig } from "@/lib/config";
import { ContactFormClient } from "@/components/ContactFormClient";

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
              Envianos tu consulta y el equipo de Nocera Distribuidora se comunicara a la brevedad.
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
              <a className="button ghost" href={contactLinks.email} target="_blank" rel="noreferrer">
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
          <ContactFormClient />
          <div className="media-panel">
            <img src="/images/nocera-cartel.jpg" alt="Nocera Birra" />
          </div>
        </div>
      </section>
    </main>
  );
}
