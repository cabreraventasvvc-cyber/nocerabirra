import type { Product } from "./types";

export type ImportedProductRow = {
  rowNumber: number;
  code: string;
  name: string;
  presentation: string;
  price: number;
  raw: Record<string, string | number | null>;
};

export type ImportPreviewRow = ImportedProductRow & {
  action: "create" | "update" | "unchanged" | "error";
  warnings: string[];
  errors: string[];
  existingProductId?: string;
  previousPrice?: number;
};

export type ImportPreview = {
  rows: ImportPreviewRow[];
  totals: {
    found: number;
    newProducts: number;
    priceChanges: number;
    unchanged: number;
    errors: number;
    warnings: number;
  };
};

const headerMap = {
  code: ["codigo", "cod", "code", "sku"],
  name: ["descripcion", "description", "producto", "nombre", "name"],
  presentation: ["presentacion", "presentation", "detalle"],
  price: ["precio", "precio neto", "neto", "price", "importe"]
};

export function parseCsv(text: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (!quoted && (char === "," || char === ";")) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(current.trim());
      if (row.some(Boolean)) {
        rows.push(row);
      }
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current.trim());
  if (row.some(Boolean)) {
    rows.push(row);
  }

  return tableToObjects(rows);
}

export function tableToObjects(rows: unknown[][]) {
  const [headers = [], ...body] = rows;
  const normalizedHeaders = headers.map((header) => normalizeHeader(String(header ?? "")));

  return body
    .filter((row) => row.some((cell) => String(cell ?? "").trim()))
    .map((row) => {
      const record: Record<string, string | number | null> = {};
      normalizedHeaders.forEach((header, index) => {
        if (header) {
          const cell = row[index];
          record[header] =
            typeof cell === "number" ? cell : cell === null || cell === undefined ? null : String(cell).trim();
        }
      });
      return record;
    });
}

export function buildImportPreview(records: Record<string, string | number | null>[], existingProducts: Product[]) {
  const productsByCode = new Map(existingProducts.map((product) => [product.code.toUpperCase(), product]));
  const rows: ImportPreviewRow[] = records.map((record, index) => {
    const code = readField(record, headerMap.code);
    const name = readField(record, headerMap.name);
    const presentation = readField(record, headerMap.presentation);
    const priceValue = readField(record, headerMap.price);
    const price = parsePrice(priceValue);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!code) {
      errors.push("Falta codigo.");
    }
    if (!name) {
      errors.push("Falta descripcion o nombre.");
    }
    if (price === null) {
      errors.push("Precio invalido o ausente.");
    }
    if (price === 0) {
      warnings.push("Precio 0. Quedara para consultar u ocultar segun configuracion futura.");
    }

    const existing = code ? productsByCode.get(code.toUpperCase()) : undefined;
    const previousPrice = existing?.price;
    const action =
      errors.length > 0
        ? "error"
        : existing && previousPrice !== price
          ? "update"
          : existing
            ? "unchanged"
            : "create";

    return {
      rowNumber: index + 2,
      code,
      name,
      presentation: presentation || inferPresentation(name),
      price: price ?? 0,
      raw: record,
      action,
      warnings,
      errors,
      existingProductId: existing?.id,
      previousPrice
    };
  });

  return {
    rows,
    totals: {
      found: rows.length,
      newProducts: rows.filter((row) => row.action === "create").length,
      priceChanges: rows.filter((row) => row.action === "update").length,
      unchanged: rows.filter((row) => row.action === "unchanged").length,
      errors: rows.filter((row) => row.action === "error").length,
      warnings: rows.reduce((sum, row) => sum + row.warnings.length, 0)
    }
  } satisfies ImportPreview;
}

function normalizeHeader(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
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

function parsePrice(value: string) {
  if (!value) {
    return null;
  }

  const normalized = value
    .replace(/\$/g, "")
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function inferPresentation(name: string) {
  const match = name.match(/((?:\d+[.,]?\d*)\s?(?:cc|ml|l|lt|lts|kg|gr|grs)|x\s?\d+|\d+\s?x\s?\d+)/i);
  return match?.[0] ?? "Presentacion pendiente";
}
