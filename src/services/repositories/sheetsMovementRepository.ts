import type { InventoryMovement } from "../../shared/types";
import type { MovementSheetRow } from "../../shared/types/sheets";
import { movementSheetRowToDomain } from "../../shared/lib/mappers/sheetMappers";
import type { MovementRepository } from "../repositories";

const MOVEMENT_SHEET = "HISTORICO";

function getMovementSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(MOVEMENT_SHEET);
  if (!sheet) throw new Error(`La hoja '${MOVEMENT_SHEET}' no existe.`);
  return sheet;
}

export class SheetsMovementRepository implements MovementRepository {
  async list(): Promise<InventoryMovement[]> {
    const sheet = getMovementSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];

    const rows = sheet.getRange(2, 1, lastRow - 1, 9).getValues() as MovementSheetRow[];
    return rows.map(movementSheetRowToDomain);
  }
}
