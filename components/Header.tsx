"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

const navItems = [
  { href: "/catalogo", label: "Catalogo" },
  { href: "/pedido-rapido", label: "Pedido rapido" },
  { href: "/nocera-birra", label: "Nocera Birra" },
  { href: "/franquicias", label: "Franquicias" },
  { href: "/historia", label: "Historia" },
  { href: "/contacto", label: "Contacto" }
];

export function Header() {
  const cart = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-mark" aria-label="Inicio Nocera">
          <Image src="/images/nocera-logo.png" alt="Nocera Birra" width={84} height={84} priority />
          <div>
            Nocera Birra
            <span>Distribuidora oficial</span>
          </div>
        </Link>

        <nav className="nav" aria-label="Navegacion principal">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="button secondary" href="/pedido-rapido">
            Comprar
          </Link>
          <button className="button" type="button" onClick={cart.openCart}>
            Carrito {cart.count > 0 ? `(${cart.count})` : ""}
          </button>
        </div>
      </div>
    </header>
  );
}
