import type { InventoryItem, InventoryMovement, Product, User } from "../../types/entities";
import type { InventorySheetRow, MovementSheetRow, ProductSheetRow, UserSheetRow } from "../../types/sheets";

function toStringSafe(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function toNumberSafe(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBooleanSafe(value: unknown, fallback = true): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() !== "false";
  if (typeof value === "number") return value !== 0;
  return fallback;
}

export function productSheetRowToDomain(row: ProductSheetRow): Product {
  return {
    idOrden: toStringSafe(row[0]),
    tipo: toStringSafe(row[1]),
    producto: toStringSafe(row[2]),
    marca: toStringSafe(row[3]),
    subModelo: toStringSafe(row[4]),
    autos: toStringSafe(row[5]),
    stockInicial: toNumberSafe(row[6]),
    minStock: toNumberSafe(row[9]),
    periodo: toStringSafe(row[12])
  };
}

export function inventorySheetRowToDomain(row: InventorySheetRow, rowNumber: number): InventoryItem {
  const movementsText = toStringSafe(row[11]);
  const movementCount = toNumberSafe(movementsText.split(" ")[0], 0);

  return {
    idFila: rowNumber,
    productId: toStringSafe(row[0]),
    total: toNumberSafe(row[6]),
    salidas: toNumberSafe(row[7]),
    disponible: toNumberSafe(row[8]),
    movimientos: movementCount,
    reStockStatus: toStringSafe(row[10])
  };
}

export function movementSheetRowToDomain(row: MovementSheetRow): InventoryMovement {
  const rawDate = row[0];
  const isoDate = rawDate instanceof Date ? rawDate.toISOString() : toStringSafe(rawDate);
  const rawType = toStringSafe(row[1]).toUpperCase();

  const normalizedType: InventoryMovement["tipo"] =
    rawType === "RE-INGRESO"
      ? "REINGRESO"
      : rawType === "SALIDA" || rawType === "REINGRESO" || rawType === "CARGA" || rawType === "ALTA"
        ? (rawType as InventoryMovement["tipo"])
        : "OTRO";

  return {
    fecha: isoDate,
    tipo: normalizedType,
    producto: toStringSafe(row[2]),
    submodelo: toStringSafe(row[4]),
    unidad: toStringSafe(row[5]),
    cantidad: toNumberSafe(row[6]),
    autor: toStringSafe(row[7]),
    notas: toStringSafe(row[8])
  };
}

export function productDomainToSheetRow(product: Product): ProductSheetRow {
  return [
    product.idOrden,
    product.tipo,
    product.producto,
    product.marca,
    product.subModelo,
    product.autos,
    product.stockInicial,
    0,
    product.stockInicial,
    product.minStock,
    "",
    "0 MOVIMIENTOS",
    product.periodo,
    "",
    ""
  ];
}

export function rawAppsScriptDataToProduct(raw: unknown): Product {
  const source = (raw ?? {}) as Record<string, unknown>;

  return {
    idOrden: toStringSafe(source.idOrden),
    tipo: toStringSafe(source.tipo),
    producto: toStringSafe(source.producto),
    marca: toStringSafe(source.marca),
    subModelo: toStringSafe(source.subModelo),
    autos: toStringSafe(source.autos),
    stockInicial: toNumberSafe(source.stockInicial),
    minStock: toNumberSafe(source.minStock),
    periodo: toStringSafe(source.periodo)
  };
}

export function userSheetRowToDomain(row: UserSheetRow): User {
  return {
    id: toStringSafe(row[0]),
    nombre: toStringSafe(row[1]),
    role: (toStringSafe(row[2]).toUpperCase() as User["role"]) || "LECTOR",
    activo: toBooleanSafe(row[3], true)
  };
}
