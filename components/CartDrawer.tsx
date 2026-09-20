"use client";

import { FormEvent, useState } from "react";
import { formatPrice, useCart } from "./CartProvider";
import { getEffectivePrice } from "@/lib/pricing";
import type { CheckoutData } from "@/lib/types";

const initialCheckout: CheckoutData = {
  customerName: "",
  phone: "",
  deliveryMode: "retiro",
  notes: ""
};

export function CartDrawer() {
  const cart = useCart();
  const [checkout, setCheckout] = useState<CheckoutData>(initialCheckout);

  if (!cart.isOpen) {
    return null;
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.items.length === 0) {
      return;
    }
    window.open(cart.buildWhatsappUrl(checkout), "_blank", "noopener,noreferrer");
  }

  return (
    <aside className="cart-drawer" aria-label="Carrito de compras">
      <div className="section-heading">
        <h2>Carrito</h2>
        <button className="icon-button" type="button" onClick={cart.closeCart} aria-label="Cerrar">
          x
        </button>
      </div>

      {cart.items.length === 0 ? (
        <p className="muted">Todavia no agregaste productos.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div className="cart-line" key={item.product.id}>
              <div>
                <strong>{item.product.name}</strong>
                <p className="muted">{item.product.presentation}</p>
                <span>${formatPrice(getEffectivePrice(item.product) * item.quantity)}</span>
              </div>
              <div className="cart-controls">
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => cart.updateQuantity(item.product.id, item.quantity - 1)}
                  aria-label="Restar unidad"
                >
                  -
                </button>
                <strong>{item.quantity}</strong>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => cart.updateQuantity(item.product.id, item.quantity + 1)}
                  aria-label="Sumar unidad"
                >
                  +
                </button>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => cart.removeItem(item.product.id)}
                  aria-label="Eliminar producto"
                >
                  x
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <span>Total</span>
            <span>${formatPrice(cart.total)}</span>
          </div>

          <form onSubmit={submitOrder}>
            <p className="cart-help">
              Envia el pedido por WhatsApp. Los datos del comercio son opcionales y se pueden
              completar en el chat.
            </p>
            <div className="form-grid">
              <input
                className="input full"
                placeholder="Comercio o nombre opcional"
                value={checkout.customerName}
                onChange={(event) => setCheckout({ ...checkout, customerName: event.target.value })}
              />
              <input
                className="input"
                placeholder="Telefono opcional"
                value={checkout.phone}
                onChange={(event) => setCheckout({ ...checkout, phone: event.target.value })}
              />
              <select
                className="select"
                value={checkout.deliveryMode}
                onChange={(event) =>
                  setCheckout({
                    ...checkout,
                    deliveryMode: event.target.value as CheckoutData["deliveryMode"]
                  })
                }
              >
                <option value="retiro">Retiro</option>
                <option value="envio">Envio</option>
              </select>
              <textarea
                className="textarea full"
                placeholder="Observaciones: direccion, horario, aclaraciones o medio de pago"
                value={checkout.notes}
                onChange={(event) => setCheckout({ ...checkout, notes: event.target.value })}
              />
            </div>
            <div className="form-actions">
              <button className="button" type="submit">
                Enviar por WhatsApp
              </button>
              <button className="button secondary" type="button" onClick={cart.clearCart}>
                Vaciar
              </button>
            </div>
          </form>
        </>
      )}
    </aside>
  );
}
