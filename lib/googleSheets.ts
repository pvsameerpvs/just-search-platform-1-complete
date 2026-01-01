import { google } from "googleapis";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");
  let credentials: any;
  try {
    credentials = JSON.parse(raw);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON string");
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export function sheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

export const SHEET_ID = () => {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("Missing GOOGLE_SHEET_ID");
  return id;
};

export async function readRange(range: string) {
  const sheets = sheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID(),
    range,
  });
  return res.data.values ?? [];
}

export async function appendRow(range: string, values: any[]) {
  const sheets = sheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID(),
    range,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });
}

export async function updateRow(range: string, values: any[]) {
  const sheets = sheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID(),
    range,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });
}

export async function getSheetId(sheetName: string) {
  const sheets = sheetsClient();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID(),
  });
  const sheet = res.data.sheets?.find((s) => s.properties?.title === sheetName);
  return sheet?.properties?.sheetId;
}

export async function deleteRow(sheetName: string, rowIndex0Based: number) {
  const sheets = sheetsClient();
  const sheetId = await getSheetId(sheetName);
  
  if (sheetId === undefined) throw new Error(`Sheet ${sheetName} not found`);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID(),
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex0Based,
              endIndex: rowIndex0Based + 1,
            },
          },
        },
      ],
    },
  });
}
