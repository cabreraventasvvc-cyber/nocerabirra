"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { parseCsv, tableToObjects } from "@/lib/importer";
import type { Product } from "@/lib/types";

type ImageRow = {
  rowNumber: number;
  code: string;
  imagePath: string;
  productName?: string;
  errors: string[];
};

type ImagePreview = {
  rows: ImageRow[];
  totals: {
    found: number;
    valid: number;
    errors: number;
  };
};

const codeHeaders = ["codigo", "cod", "code", "sku"];
const imageHeaders = ["imagen", "foto", "image", "image_url", "url", "ruta"];

export function ProductImageImportClient({ products }: { products: Product[] }) {
  const [filename, setFilename] = useState("");
  const [preview, setPreview] = useState<ImagePreview | null>(null);
  const previewRows = useMemo(() => preview?.rows.slice(0, 100) ?? [], [preview]);
  const sql = useMemo(() => (preview ? buildImageSql(preview.rows) : ""), [preview]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFilename(file.name);
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv" || extension === "tsv" || extension === "txt") {
      const text = await file.text();
      setPreview(buildImagePreview(parseCsv(text), products));
      return;
    }

    if (extension === "xlsx" || extension === "xls") {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, raw: false });
      setPreview(buildImagePreview(tableToObjects(rows), products));
      return;
    }

    setPreview({
      rows: [
        {
          rowNumber: 1,
          code: "",
          imagePath: "",
          errors: ["Formato no soportado."]
        }
      ],
      totals: {
        found: 1,
        valid: 0,
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
        <strong>Archivo de imagenes</strong>
        <p>
          Subi CSV, XLS o XLSX con columnas de codigo e imagen. La imagen puede ser una URL publica
          o una ruta del sitio como /images/productos/codigo.jpg.
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
              <strong>{preview.totals.valid}</strong>
              <span>imagenes validas</span>
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
                <p>Revisa codigos y URLs antes de copiar el SQL para Supabase.</p>
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
                    <th>Imagen</th>
                    <th>Alertas</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr key={`${row.rowNumber}-${row.code}`}>
                      <td>{row.rowNumber}</td>
                      <td>{row.code || "-"}</td>
                      <td>{row.productName || "-"}</td>
                      <td>{row.imagePath || "-"}</td>
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
              <p>Copialo y ejecutalo en SQL Editor para asociar fotos a productos.</p>
              <textarea className="textarea full sql-output" readOnly value={sql} />
            </section>
          )}
        </>
      )}
    </div>
  );
}

function buildImagePreview(records: Record<string, string | number | null>[], products: Product[]): ImagePreview {
  const productsByCode = new Map(products.map((product) => [product.code.toUpperCase(), product]));
  const rows = records.map((record, index) => {
    const code = readField(record, codeHeaders).toUpperCase();
    const imagePath = readField(record, imageHeaders);
    const product = productsByCode.get(code);
    const errors: string[] = [];

    if (!code) {
      errors.push("Falta codigo.");
    }
    if (!imagePath) {
      errors.push("Falta imagen o URL.");
    }
    if (code && !product) {
      errors.push("Codigo no encontrado en catalogo.");
    }
    if (imagePath && !isValidImagePath(imagePath)) {
      errors.push("La imagen debe ser URL publica o ruta /images/...");
    }

    return {
      rowNumber: index + 2,
      code,
      imagePath,
      productName: product?.name,
      errors
    } satisfies ImageRow;
  });

  return {
    rows,
    totals: {
      found: rows.length,
      valid: rows.filter((row) => row.errors.length === 0).length,
      errors: rows.filter((row) => row.errors.length > 0).length
    }
  };
}

function buildImageSql(rows: ImageRow[]) {
  const validRows = rows.filter((row) => row.errors.length === 0);
  if (!validRows.length) {
    return "";
  }

  const values = validRows.map((row) => `  (${quote(row.code)}, ${quote(row.imagePath)})`).join(",\n");

  return `with source (code, image_path) as (
values
${values}
)
update public.products
set image_path = source.image_path
from source
where products.code = source.code;`;
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

function isValidImagePath(value: string) {
  return value.startsWith("/images/") || value.startsWith("https://") || value.startsWith("http://");
}

function quote(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}
