import type { Metadata } from "next";
import "./globals.css";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://nocera.com.ar"),
  title: {
    default: "Nocera - Distribuidora y Birra",
    template: "%s | Nocera"
  },
  description:
    "Plataforma web de Nocera Distribuidora y Nocera Birra para catalogo, pedidos y franquicias.",
  openGraph: {
    title: "Nocera - Distribuidora y Birra",
    description: "Catalogo, pedidos y productos Nocera en una plataforma mobile-first.",
    images: ["/images/nocera-logo.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>
        <CartProvider>
          <div className="site-shell">
            <Header />
            {children}
            <footer className="footer">
              <div className="section-inner footer-inner">
                <span>Nocera Distribuidora y Birra</span>
                <span>Etapa 1 - sin Nocera Bar</span>
              </div>
            </footer>
          </div>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
