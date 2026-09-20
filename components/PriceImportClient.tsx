"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { products } from "@/lib/products";
import { buildImportPreview, parseCsv, tableToObjects, type ImportPreview } from "@/lib/importer";
import { formatPrice } from "./CartProvider";

type ImportHistory = {
  filename: string;
  appliedAt: string;
  totals: ImportPreview["totals"];
};

const storageKey = "nocera-price-imports-v1";

export function PriceImportClient() {
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [filename, setFilename] = useState("");
  const [history, setHistory] = useState<ImportHistory[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as ImportHistory[]) : [];
  });
  const canApply = Boolean(preview && preview.totals.errors === 0 && preview.totals.found > 0);

  const previewRows = useMemo(() => preview?.rows.slice(0, 80) ?? [], [preview]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFilename(file.name);
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv" || extension === "tsv" || extension === "txt") {
      const text = await file.text();
      setPreview(buildImportPreview(parseCsv(text), products));
      return;
    }

    if (extension === "xlsx" || extension === "xls") {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, raw: false });
      setPreview(buildImportPreview(tableToObjects(rows), products));
      return;
    }

    setPreview({
      rows: [],
      totals: {
        found: 0,
        newProducts: 0,
        priceChanges: 0,
        unchanged: 0,
        errors: 1,
        warnings: 0
      }
    });
  }

  function applyImport() {
    if (!preview || !canApply) {
      return;
    }

    const nextHistory = [
      {
        filename,
        appliedAt: new Date().toISOString(),
        totals: preview.totals
      },
      ...history
    ].slice(0, 8);

    window.localStorage.setItem(storageKey, JSON.stringify(nextHistory));
    setHistory(nextHistory);
  }

  return (
    <div className="import-layout">
      <section className="panel">
        <strong>Archivo de precios</strong>
        <p>
          Subi CSV, XLS o XLSX con columnas de codigo, descripcion y precio. La aplicacion compara
          contra los productos actuales usando el codigo comercial.
        </p>
        <input className="input" type="file" accept=".csv,.tsv,.txt,.xlsx,.xls" onChange={handleFile} />
      </section>

      {preview && (
        <>
          <section className="import-summary">
            <article className="panel">
              <strong>{preview.totals.found}</strong>
              <span>filas encontradas</span>
            </article>
            <article className="panel">
              <strong>{preview.totals.newProducts}</strong>
              <span>productos nuevos</span>
            </article>
            <article className="panel">
              <strong>{preview.totals.priceChanges}</strong>
              <span>cambios de precio</span>
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
                <p>No se modifica el catalogo hasta confirmar. En Supabase esta accion aplicara los cambios reales.</p>
              </div>
              <button className="button" type="button" disabled={!canApply} onClick={applyImport}>
                Confirmar importacion
              </button>
            </div>

            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fila</th>
                    <th>Accion</th>
                    <th>Codigo</th>
                    <th>Producto</th>
                    <th>Presentacion</th>
                    <th>Precio anterior</th>
                    <th>Precio nuevo</th>
                    <th>Alertas</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr key={`${row.rowNumber}-${row.code}`}>
                      <td>{row.rowNumber}</td>
                      <td>{actionLabel(row.action)}</td>
                      <td>{row.code || "-"}</td>
                      <td>{row.name || "-"}</td>
                      <td>{row.presentation}</td>
                      <td>{row.previousPrice ? `$${formatPrice(row.previousPrice)}` : "-"}</td>
                      <td>${formatPrice(row.price)}</td>
                      <td>{[...row.errors, ...row.warnings].join(" ") || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {history.length > 0 && (
        <section className="panel">
          <strong>Confirmaciones locales</strong>
          <p>Historial provisorio guardado en este navegador hasta conectar Supabase.</p>
          <div className="timeline">
            {history.map((item) => (
              <div className="timeline-item" key={`${item.filename}-${item.appliedAt}`}>
                <strong>{item.filename}</strong>
                <span>
                  {new Date(item.appliedAt).toLocaleString("es-AR")} - {item.totals.priceChanges} cambios de precio,{" "}
                  {item.totals.newProducts} nuevos.
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function actionLabel(action: string) {
  if (action === "create") {
    return "Crear";
  }
  if (action === "update") {
    return "Actualizar";
  }
  if (action === "unchanged") {
    return "Sin cambios";
  }
  return "Error";
}
