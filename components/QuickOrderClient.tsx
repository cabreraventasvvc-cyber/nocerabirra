"use client";

import { useMemo, useState } from "react";
import { getEffectivePrice, hasActivePromotion } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { formatPrice, useCart } from "./CartProvider";

export function QuickOrderClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const cart = useCart();

  const visibleProducts = useMemo(() => {
    const normalized = query.toLowerCase();
    return products.filter((product) =>
      `${product.code} ${product.name} ${product.brand} ${product.presentation}`.toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <div className="quick-order">
      <input
        className="input"
        placeholder="Buscar producto para pedido rapido"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p className="result-count">{visibleProducts.length} productos disponibles</p>
      <div className="quick-order-row header">
        <span>Producto</span>
        <span>Presentacion</span>
        <span>Precio</span>
        <span>Cantidad</span>
        <span>Agregar</span>
      </div>
      {visibleProducts.map((product) => {
        const quantity = quantities[product.id] ?? 1;
        const canBuy = product.available && product.price > 0;
        const effectivePrice = getEffectivePrice(product);
        const isPromotional = hasActivePromotion(product);
        return (
          <div className="quick-order-row" key={product.id}>
            <span>
              <strong>{product.name}</strong>
              <br />
              <small>{product.code}</small>
            </span>
            <span>{product.presentation}</span>
            <span>
              {canBuy ? (
                <>
                  {isPromotional && <span className="old-price">${formatPrice(product.price)}</span>}
                  ${formatPrice(effectivePrice)}
                </>
              ) : (
                "Consultar"
              )}
            </span>
            <input
              className="input"
              min={1}
              type="number"
              value={quantity}
              onChange={(event) =>
                setQuantities({ ...quantities, [product.id]: Number(event.target.value) || 1 })
              }
            />
            <button className="button ghost" type="button" disabled={!canBuy} onClick={() => cart.addItem(product, quantity)}>
              Agregar
            </button>
          </div>
        );
      })}
    </div>
  );
}
