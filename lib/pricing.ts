import type { Product } from "./types";

export function getEffectivePrice(product: Product, now = new Date()) {
  if (!product.promotionalPrice || product.promotionalPrice <= 0) {
    return product.price;
  }

  const startsAt = product.promotionStartsAt ? new Date(product.promotionStartsAt) : null;
  const endsAt = product.promotionEndsAt ? new Date(product.promotionEndsAt) : null;

  if (startsAt && now < startsAt) {
    return product.price;
  }

  if (endsAt && now > endsAt) {
    return product.price;
  }

  return product.promotionalPrice;
}

export function hasActivePromotion(product: Product, now = new Date()) {
  return getEffectivePrice(product, now) < product.price;
}
