import type { InventoryItem, ReingressRequest, StockAdjustmentRequest, WithdrawalRequest } from "../../shared/types";
import type { InventorySheetRow } from "../../shared/types/sheets";
import { inventorySheetRowToDomain } from "../../shared/lib/mappers/sheetMappers";
import type { InventoryRepository } from "../repositories";

const INVENTORY_SHEET = "INVENTARIO";

function getInventorySheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(INVENTORY_SHEET);
  if (!sheet) throw new Error(`La hoja '${INVENTORY_SHEET}' no existe.`);
  return sheet;
}

export class SheetsInventoryRepository implements InventoryRepository {
  async list(): Promise<InventoryItem[]> {
    const sheet = getInventorySheet();
    const rows = sheet.getDataRange().getValues().slice(1) as InventorySheetRow[];
    return rows
      .map((row, index) => inventorySheetRowToDomain(row, index + 2))
      .filter((item) => item.productId !== "");
  }

  async addStock(payload: StockAdjustmentRequest): Promise<void> {
    const sheet = getInventorySheet();
    const row = payload.idFila;
    const current = sheet.getRange(row, 7, 1, 3).getValues()[0];
    const total = Number(current[0] || 0);
    const used = Number(current[1] || 0);
    const toAdd = Number(payload.cantidad || 0);

    const newTotal = total + toAdd;
    const newAvailable = newTotal - used;

    sheet.getRange(row, 7).setValue(newTotal);
    sheet.getRange(row, 9).setValue(newAvailable);
  }

  async withdraw(payload: WithdrawalRequest): Promise<void> {
    const sheet = getInventorySheet();
    const row = payload.idFila;
    const current = sheet.getRange(row, 8, 1, 2).getValues()[0];
    const used = Number(current[0] || 0);
    const available = Number(current[1] || 0);
    const qty = Number(payload.cantidad || 0);

    sheet.getRange(row, 8, 1, 2).setValues([[used + qty, available - qty]]);
  }

  async reingress(payload: ReingressRequest): Promise<void> {
    const sheet = getInventorySheet();
    const row = payload.idFila;
    const current = sheet.getRange(row, 8, 1, 2).getValues()[0];
    const used = Number(current[0] || 0);
    const available = Number(current[1] || 0);
    const qty = Number(payload.cantidad || 0);

    sheet.getRange(row, 8, 1, 2).setValues([[Math.max(0, used - qty), available + qty]]);
  }
}
