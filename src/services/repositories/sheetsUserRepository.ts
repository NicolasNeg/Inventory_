import type { User } from "../../shared/types";
import type { UserSheetRow } from "../../shared/types/sheets";
import { userSheetRowToDomain } from "../../shared/lib/mappers/sheetMappers";

const NOTES_SHEET = "HISTORIAL_NOTAS_PENDIENTES";

function getNotesSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(NOTES_SHEET);
  if (!sheet) throw new Error(`La hoja '${NOTES_SHEET}' no existe.`);
  return sheet;
}

export class SheetsUserRepository {
  async listFromNotesHistory(): Promise<User[]> {
    const sheet = getNotesSheet();
    const rows = sheet.getDataRange().getValues().slice(1);
    const unique = new Map<string, User>();

    rows.forEach((row) => {
      const author = String(row[2] ?? "").trim();
      const resolver = String(row[7] ?? "").trim();

      if (author) {
        const userRow: UserSheetRow = [author, author, "OPERADOR", true];
        unique.set(author, userSheetRowToDomain(userRow));
      }
      if (resolver) {
        const userRow: UserSheetRow = [resolver, resolver, "SUPERVISOR", true];
        unique.set(resolver, userSheetRowToDomain(userRow));
      }
    });

    return Array.from(unique.values());
  }
}
