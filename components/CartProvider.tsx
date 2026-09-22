"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/lib/config";
import { getEffectivePrice } from "@/lib/pricing";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import type { CartItem, CheckoutData, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  total: number;
  count: number;
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  reserveStock: () => Promise<{ ok: boolean; message?: string }>;
  buildWhatsappUrl: (checkout: CheckoutData) => string;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "nocera-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setItems(JSON.parse(stored) as CartItem[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0),
    [items]
  );
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  function addItem(product: Product, quantity = 1) {
    if (product.price <= 0 || !product.available) {
      return;
    }

    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      const nextQuantity = clampQuantity(product, (existing?.quantity ?? 0) + quantity);
      if (!existing) {
        return [...current, { product, quantity: nextQuantity }];
      }
      return current.map((item) =>
        item.product.id === product.id ? { ...item, quantity: nextQuantity } : item
      );
    });
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity: clampQuantity(item.product, quantity) } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  function buildWhatsappUrl(checkout: CheckoutData) {
    const orderNumber = `NOC-${Date.now().toString().slice(-6)}`;
    const lines = [
      `Pedido ${orderNumber}`,
      "",
      ...items.map(
        (item) =>
          `${item.quantity} x ${item.product.code} - ${item.product.name} - ${item.product.presentation || "sin presentacion"} - $${formatPrice(
            getEffectivePrice(item.product) * item.quantity
          )}`
      ),
      "",
      `Total: $${formatPrice(total)}`,
      "",
      checkout.customerName ? `Cliente/comercio: ${checkout.customerName}` : "",
      checkout.phone ? `Telefono: ${checkout.phone}` : "",
      `Modalidad: ${checkout.deliveryMode === "envio" ? "Envio" : "Retiro"}`,
      checkout.notes ? `Observaciones: ${checkout.notes}` : ""
    ].filter(Boolean);

    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function reserveStock() {
    const controlledItems = items.filter((item) => item.product.stockQuantity !== null && item.product.stockQuantity !== undefined);
    if (controlledItems.length === 0 || !hasSupabaseConfig()) {
      return { ok: true };
    }

    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.rpc("decrement_product_stock", {
      items_payload: controlledItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    const result = data as { ok?: boolean; message?: string } | null;
    return {
      ok: Boolean(result?.ok),
      message: result?.message
    };
  }

  const value: CartContextValue = {
    items,
    total,
    count,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    reserveStock,
    buildWhatsappUrl
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(value);
}

function clampQuantity(product: Product, quantity: number) {
  const stockQuantity = product.stockQuantity;
  if (stockQuantity === null || stockQuantity === undefined) {
    return quantity;
  }

  return Math.min(quantity, Math.max(0, Math.floor(stockQuantity)));
}
