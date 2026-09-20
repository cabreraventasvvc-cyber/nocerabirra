"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type CatalogClientProps = {
  categories: Category[];
  products: Product[];
  onlyNocera?: boolean;
};

export function CatalogClient({ categories, products, onlyNocera = false }: CatalogClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(onlyNocera ? "productos-nocera" : "todos");

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesNocera = onlyNocera ? product.noceraProduct : true;
      const matchesCategory = category === "todos" ? true : product.categoryId === category;
      const text = `${product.name} ${product.brand} ${product.code} ${product.presentation}`.toLowerCase();
      return matchesNocera && matchesCategory && text.includes(query.toLowerCase());
    });
  }, [category, onlyNocera, query]);

  return (
    <>
      <div className="filters">
        <input
          className="input"
          placeholder="Buscar por producto, marca, codigo o presentacion"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
          {!onlyNocera && <option value="todos">Todas las categorias</option>}
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="category-strip" aria-label="Categorias">
        {!onlyNocera && (
          <button className="chip" type="button" onClick={() => setCategory("todos")}>
            Todas
          </button>
        )}
        {categories.map((item) => (
          <button className="chip" key={item.id} type="button" onClick={() => setCategory(item.id)}>
            {item.name}
          </button>
        ))}
      </div>

      <p className="result-count">{visibleProducts.length} productos encontrados</p>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
