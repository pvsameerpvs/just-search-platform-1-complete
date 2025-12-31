import { NextResponse } from "next/server";
import { appendRow } from "@/lib/googleSheets";

// Invoices columns recommended:
// A invoice_id | B client_id | C amount | D status | E createdAt
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const invoiceId = `INV-${Date.now()}`;
  const createdAt = new Date().toISOString();
  await appendRow("Invoices!A:E", [
    invoiceId,
    body.client_id ?? "",
    body.amount ?? 0,
    "unpaid",
    createdAt,
  ]);
  return NextResponse.json({ ok: true, invoiceId });
}
