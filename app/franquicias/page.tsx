export const metadata = {
  title: "Franquicias"
};

const franchiseStats = [
  {
    label: "Inversion inicial",
    value: "Desde USD 50.000"
  },
  {
    label: "Local sugerido",
    value: "Desde 80 m2"
  },
  {
    label: "Recupero estimado",
    value: "14 meses"
  },
  {
    label: "Equipo operativo",
    value: "4 a 5 personas"
  }
];

const profileItems = [
  "Perfil comercial y presencia activa en la operacion.",
  "Interes real por la propuesta de cerveza, destilados y experiencia de marca.",
  "Capacidad para manejar personal y sostener estandares de atencion.",
  "Ubicaciones con movimiento de publico y potencial gastronomico."
];

export default function FranchisePage() {
  return (
    <main>
      <section className="section dark">
        <div className="section-inner split">
          <div>
            <p className="eyebrow">Franquicias Nocera</p>
            <h1>Quiero mi Nocera</h1>
            <p className="muted">
              Nocera Birra abre su modelo de franquicias para llevar su produccion propia, su
              identidad cervecera y su propuesta gastronomica a nuevos puntos comerciales.
            </p>
            <div className="split-actions">
              <a
                className="button"
                href="https://www.iprofesional.com/negocios/462712-franquicias-de-nocera-birra-inversion-y-requisitos-para-abrir-un-bar"
                target="_blank"
                rel="noreferrer"
              >
                Ver nota
              </a>
              <a
                className="button secondary"
                href="https://www.instagram.com/p/Dcd0Nq8kf--/"
                target="_blank"
                rel="noreferrer"
              >
                Ver video
              </a>
            </div>
          </div>
          <div className="media-panel">
            <img src="/images/nocera-franquicia.webp" alt="Productos Nocera Birra e Impronta" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Modelo de negocio</p>
              <h2>Datos principales</h2>
              <p>
                La propuesta parte de locales desde 80 m2 y una inversion inicial informada desde
                USD 50.000. Las proyecciones dependen de ubicacion, gestion y contexto comercial.
              </p>
            </div>
          </div>
          <div className="stat-grid">
            {franchiseStats.map((item) => (
              <article className="panel" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cream">
        <div className="section-inner split">
          <div>
            <p className="eyebrow">Perfil buscado</p>
            <h2>Franquiciados involucrados con la marca</h2>
            <p>
              Nocera busca operadores que crean en el concepto y cuiden la experiencia. La prioridad
              no es sumar locales sin criterio, sino crecer con socios que entiendan el producto, el
              publico y la operacion diaria.
            </p>
            <div className="timeline">
              {profileItems.map((item) => (
                <div className="timeline-item" key={item}>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="image-stack">
            <img src="/images/nocera-cartel.jpg" alt="Cartel Nocera Birra" />
            <img src="/images/impronta-servicio.jpg" alt="Servicio de destilados Impronta" />
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="section-inner split">
          <div>
            <p className="eyebrow">Consulta comercial</p>
            <h2>Postulate para recibir informacion</h2>
            <p className="muted">
              Completando tus datos, el equipo puede evaluar zona, perfil y formato de local para
              una posible franquicia Nocera.
            </p>
          </div>
          <form className="panel">
            <div className="form-grid">
              <input className="input" placeholder="Nombre" />
              <input className="input" placeholder="Apellido" />
              <input className="input" placeholder="Telefono" />
              <input className="input" type="email" placeholder="Email" />
              <input className="input" placeholder="Localidad" />
              <input className="input" placeholder="Provincia" />
              <textarea className="textarea full" placeholder="Mensaje" />
            </div>
            <div className="form-actions">
              <button className="button" type="button">
                Guardar consulta
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
