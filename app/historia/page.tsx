export const metadata = {
  title: "Nuestra historia"
};

const timeline = [
  {
    title: "2006 - Distribuidora De Simone",
    text: "Cristian De Simone junto a sus hermanos Javier, Romina y Maria iniciaron el recorrido familiar con Distribuidora De Simone. Ese origen les dio experiencia real en logistica, abastecimiento, clientes gastronomicos y venta mayorista."
  },
  {
    title: "2014 a 2016 - La decision de fabricar",
    text: "Despues de anos en el rubro, la familia empezo a evaluar que producto propio podia desarrollar. Tras analizar distintas alternativas, la cerveza artesanal se convirtio en el camino elegido."
  },
  {
    title: "2018 - Nace Nocera Birra",
    text: "El proyecto tomo forma con la puesta en marcha de la fabrica en Quilmes Oeste. Nocera arranco con cuatro estilos y una capacidad inicial de 4.000 litros mensuales."
  },
  {
    title: "Produccion profesional",
    text: "La marca decidio profesionalizar la elaboracion desde el inicio, trabajando con direccion tecnica y altos estandares de calidad. Hoy la planta cuenta con capacidad para producir hasta 40.000 litros mensuales."
  },
  {
    title: "Laboratorio y destilados",
    text: "La estructura productiva incluye laboratorio propio para desarrollo de blends y destilados. Ademas de mas de diez variedades de cerveza, la marca trabaja productos como gin, fernet, bitters, vodka y whisky."
  },
  {
    title: "2025 en adelante - Experiencia y expansion",
    text: "Con distribucion, fabrica, productos propios y una propuesta de consumo consolidada, Nocera inicia una etapa de franquicias para llevar su experiencia a CABA y al sur del Gran Buenos Aires."
  }
];

const highlights = [
  {
    title: "Produccion propia",
    text: "Cerveza artesanal y destilados desarrollados por la marca."
  },
  {
    title: "Estructura industrial",
    text: "Capacidad instalada de hasta 40.000 litros mensuales."
  },
  {
    title: "Distribucion mayorista",
    text: "Una base comercial construida desde 2006."
  },
  {
    title: "Laboratorio",
    text: "Desarrollo de blends, control de calidad e inocuidad."
  }
];

const socialLinks = [
  {
    label: "Instagram",
    value: "@nocerabirra",
    href: "https://www.instagram.com/nocerabirra"
  },
  {
    label: "Facebook",
    value: "nocerabirra",
    href: "https://www.facebook.com/nocerabirra"
  },
  {
    label: "Threads",
    value: "@nocerabirra",
    href: "https://www.threads.net/@nocerabirra"
  }
];

export default function HistoryPage() {
  return (
    <main>
      <section className="section dark">
        <div className="section-inner split">
          <div>
            <p className="eyebrow">Raiz familiar, identidad cervecera</p>
            <h1>Nuestra historia</h1>
            <p className="muted">
              Nocera Birra nace en Quilmes de una familia que primero aprendio el negocio desde la
              distribucion y despues decidio transformar esa experiencia en produccion propia.
            </p>
          </div>
          <div className="media-panel contain">
            <img src="/images/nocera-fabrica.jpg" alt="Fabrica Nocera Birra en Quilmes Oeste" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner split">
          <div className="page-title">
            <p className="eyebrow">Institucional</p>
            <h1>Un proyecto hecho en Quilmes</h1>
            <p>
              El camino de Nocera une distribucion mayorista, desarrollo industrial y una identidad
              marcada por Quilmes, una ciudad profundamente asociada a la cultura cervecera
              argentina.
            </p>
            <p>
              La empresa mantiene su base distribuidora, abastece a otros locales gastronomicos y
              usa esa estructura para sostener productos propios, mejores margenes y continuidad de
              abastecimiento.
            </p>
          </div>
          <div className="timeline">
            {timeline.map((item) => (
              <div className="timeline-item" key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cream">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Diferenciales</p>
              <h2>Mucho mas que una cerveza artesanal</h2>
              <p>
                La historia de Nocera se apoya en una integracion poco habitual: fabrica,
                laboratorio, distribucion, productos propios y una experiencia comercial preparada
                para escalar.
              </p>
            </div>
          </div>
          <div className="stat-grid">
            {highlights.map((item) => (
              <article className="panel" key={item.title}>
                <span>{item.title}</span>
                <strong>{item.text}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner split">
          <div>
            <p className="eyebrow">Proyeccion</p>
            <h2>Una marca preparada para crecer</h2>
            <p>
              Hoy Nocera integra distribucion, produccion propia, laboratorio y una vision de
              expansion mediante franquicias. El objetivo es replicar una propuesta sostenida por
              calidad, abastecimiento y experiencia de marca.
            </p>
          </div>
          <div className="media-panel">
            <img src="/images/nocera-productos.jpg" alt="Productos Nocera Birra e Impronta" />
          </div>
          <div className="panel">
            <strong>Destino comercial</strong>
            <p>
              CABA, Palermo, Villa Crespo, San Telmo y el sur del Gran Buenos Aires aparecen como
              zonas de interes para la nueva etapa de crecimiento.
            </p>
          </div>
        </div>
      </section>

      <section className="section cream">
        <div className="section-inner split">
          <div>
            <p className="eyebrow">Nocera Birra</p>
            <h2>Redes y contacto de marca</h2>
            <p>
              Canales institucionales para consultas vinculadas a Nocera Birra, produccion,
              propuestas comerciales y comunicacion de marca.
            </p>
          </div>
          <div className="panel">
            <strong>Datos de contacto</strong>
            <p>
              <a href="mailto:crisdesimone59@gmail.com">crisdesimone59@gmail.com</a>
            </p>
            <p>
              <a href="https://wa.me/5491160210397" target="_blank" rel="noreferrer">
                11 6021-0397
              </a>
            </p>
            <div className="split-actions">
              {socialLinks.map((item) => (
                <a className="button ghost" href={item.href} key={item.label} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
