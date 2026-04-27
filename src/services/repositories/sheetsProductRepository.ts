import type { Product, ProductCreateRequest } from "../../shared/types";
import type { ProductSheetRow } from "../../shared/types/sheets";
import { productDomainToSheetRow, productSheetRowToDomain } from "../../shared/lib/mappers/sheetMappers";
import type { ProductRepository } from "../repositories";

const INVENTORY_SHEET = "INVENTARIO";

function getInventorySheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(INVENTORY_SHEET);
  if (!sheet) throw new Error(`La hoja '${INVENTORY_SHEET}' no existe.`);
  return sheet;
}

export class SheetsProductRepository implements ProductRepository {
  async list(): Promise<Product[]> {
    const sheet = getInventorySheet();
    const rows = sheet.getDataRange().getValues().slice(1) as ProductSheetRow[];
    return rows.filter((row) => String(row[2] ?? "").trim() !== "").map(productSheetRowToDomain);
  }

  async create(payload: ProductCreateRequest): Promise<void> {
    const sheet = getInventorySheet();
    const product: Product = {
      idOrden: "",
      tipo: payload.tipo,
      producto: payload.producto,
      marca: payload.marca,
      subModelo: payload.subModelo,
      autos: payload.autos,
      stockInicial: Number(payload.cantidad) || 0,
      minStock: Number(payload.minStock) || 0,
      periodo: payload.periodo
    };

    // Defensive parse: mantenemos compatibilidad incluso con payload legacy parcial.
    const row = productDomainToSheetRow(product);
    sheet.appendRow(row);
  }
}
