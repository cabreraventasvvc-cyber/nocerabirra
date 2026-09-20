"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { parseCsv, tableToObjects } from "@/lib/importer";
import type { Product } from "@/lib/types";

type StockRow = {
  rowNumber: number;
  code: string;
  stockText: string;
  status: "available" | "out_of_stock" | "error";
  productName?: string;
  errors: string[];
};

type StockPreview = {
  rows: StockRow[];
  totals: {
    found: number;
    available: number;
    outOfStock: number;
    errors: number;
  };
};

const codeHeaders = ["codigo", "cod", "code", "sku"];
const stockHeaders = ["stock", "cantidad", "existencia", "unidades", "estado"];

export function StockImportClient({ products }: { products: Product[] }) {
  const [filename, setFilename] = useState("");
  const [preview, setPreview] = useState<StockPreview | null>(null);
  const previewRows = useMemo(() => preview?.rows.slice(0, 100) ?? [], [preview]);
  const sql = useMemo(() => (preview ? buildStockSql(preview.rows) : ""), [preview]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFilename(file.name);
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv" || extension === "tsv" || extension === "txt") {
      const text = await file.text();
      setPreview(buildStockPreview(parseCsv(text), products));
      return;
    }

    if (extension === "xlsx" || extension === "xls") {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, raw: false });
      setPreview(buildStockPreview(tableToObjects(rows), products));
      return;
    }

    setPreview({
      rows: [
        {
          rowNumber: 1,
          code: "",
          stockText: "",
          status: "error",
          errors: ["Formato no soportado."]
        }
      ],
      totals: {
        found: 1,
        available: 0,
        outOfStock: 0,
        errors: 1
      }
    });
  }

  async function copySql() {
    if (!sql) {
      return;
    }
    await navigator.clipboard.writeText(sql);
  }

  return (
    <div className="import-layout">
      <section className="panel">
        <strong>Archivo de stock</strong>
        <p>
          Subi CSV, XLS o XLSX con una columna de codigo y otra de stock, cantidad o estado. Si el
          valor es 0, marca el producto como sin stock; si es mayor a 0, queda disponible.
        </p>
        <input className="input" type="file" accept=".csv,.tsv,.txt,.xlsx,.xls" onChange={handleFile} />
      </section>

      {preview && (
        <>
          <section className="import-summary">
            <article className="panel">
              <strong>{preview.totals.found}</strong>
              <span>filas leidas</span>
            </article>
            <article className="panel">
              <strong>{preview.totals.available}</strong>
              <span>disponibles</span>
            </article>
            <article className="panel">
              <strong>{preview.totals.outOfStock}</strong>
              <span>sin stock</span>
            </article>
            <article className="panel">
              <strong>{preview.totals.errors}</strong>
              <span>errores</span>
            </article>
          </section>

          <section className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Vista previa</p>
                <h2>{filename}</h2>
                <p>Revisa los codigos antes de copiar el SQL y ejecutarlo en Supabase.</p>
              </div>
              <button className="button" type="button" disabled={!sql} onClick={copySql}>
                Copiar SQL
              </button>
            </div>

            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fila</th>
                    <th>Codigo</th>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Alertas</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr key={`${row.rowNumber}-${row.code}`}>
                      <td>{row.rowNumber}</td>
                      <td>{row.code || "-"}</td>
                      <td>{row.productName || "-"}</td>
                      <td>{row.stockText || "-"}</td>
                      <td>{row.status === "available" ? "Disponible" : row.status === "out_of_stock" ? "Sin stock" : "Error"}</td>
                      <td>{row.errors.join(" ") || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {sql && (
            <section className="panel">
              <strong>SQL para Supabase</strong>
              <p>Copialo y ejecutalo en SQL Editor para aplicar los estados de stock.</p>
              <textarea className="textarea full sql-output" readOnly value={sql} />
            </section>
          )}
        </>
      )}
    </div>
  );
}

function buildStockPreview(records: Record<string, string | number | null>[], products: Product[]): StockPreview {
  const productsByCode = new Map(products.map((product) => [product.code.toUpperCase(), product]));
  const rows = records.map((record, index) => {
    const code = readField(record, codeHeaders).toUpperCase();
    const stockText = readField(record, stockHeaders);
    const product = productsByCode.get(code);
    const errors: string[] = [];
    const status = parseStockStatus(stockText);

    if (!code) {
      errors.push("Falta codigo.");
    }
    if (!stockText) {
      errors.push("Falta stock o estado.");
    }
    if (code && !product) {
      errors.push("Codigo no encontrado en catalogo.");
    }
    if (status === "error") {
      errors.push("Stock/estado invalido.");
    }

    return {
      rowNumber: index + 2,
      code,
      stockText,
      status: errors.length > 0 ? "error" : status,
      productName: product?.name,
      errors
    } satisfies StockRow;
  });

  return {
    rows,
    totals: {
      found: rows.length,
      available: rows.filter((row) => row.status === "available").length,
      outOfStock: rows.filter((row) => row.status === "out_of_stock").length,
      errors: rows.filter((row) => row.status === "error").length
    }
  };
}

function buildStockSql(rows: StockRow[]) {
  const validRows = rows.filter((row) => row.status !== "error");
  if (!validRows.length) {
    return "";
  }

  const values = validRows
    .map((row) => `  (${quote(row.code)}, ${quote(row.status)})`)
    .join(",\n");

  return `with source (code, stock_status) as (
values
${values}
)
update public.products
set stock_status = source.stock_status
from source
where products.code = source.code;`;
}

function parseStockStatus(value: string): StockRow["status"] {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (["disponible", "available", "si", "sí", "ok", "en stock"].includes(normalized)) {
    return "available";
  }
  if (["sin stock", "agotado", "no", "out_of_stock", "out of stock"].includes(normalized)) {
    return "out_of_stock";
  }

  const quantity = Number(normalized.replace(",", "."));
  if (Number.isFinite(quantity)) {
    return quantity > 0 ? "available" : "out_of_stock";
  }

  return "error";
}

function readField(record: Record<string, string | number | null>, aliases: string[]) {
  for (const alias of aliases) {
    const value = record[normalizeHeader(alias)];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
}

function normalizeHeader(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function quote(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}
