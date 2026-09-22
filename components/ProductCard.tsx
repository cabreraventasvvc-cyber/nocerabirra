"use client";

import { useState } from "react";
import { formatPrice, useCart } from "./CartProvider";
import { getEffectivePrice, hasActivePromotion } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const canBuy = product.available && product.price > 0;
  const effectivePrice = getEffectivePrice(product);
  const isPromotional = hasActivePromotion(product);

  return (
    <article className="product-card">
      <div className={product.image ? "product-image" : "placeholder-image"}>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span>{product.brand}</span>
        )}
      </div>
      <div className="product-body">
        <span className="product-code">{product.code}</span>
        <h3>{product.name}</h3>
        <p>{product.presentation}</p>
        <p>{product.description}</p>
        {!product.available && <p className="product-code">Sin stock</p>}
        {product.stockQuantity !== null && product.stockQuantity !== undefined && product.available && (
          <p className="product-code">Stock: {product.stockQuantity}</p>
        )}
        <div className="price-row">
          <span className="price">
            {canBuy ? (
              <>
                {isPromotional && <span className="old-price">${formatPrice(product.price)}</span>}
                ${formatPrice(effectivePrice)}
              </>
            ) : (
              "Consultar precio"
            )}
          </span>
          <button
            className="button ghost"
            type="button"
            disabled={!canBuy}
            onClick={() => {
              cart.addItem(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1400);
            }}
          >
            {added ? "Agregado" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
