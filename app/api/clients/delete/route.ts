
import { NextResponse } from "next/server";
import { readRange, deleteRow } from "@/lib/googleSheets";

// Helper to find 0-based row indices for a sheet starting at Row 2 (index 1)
// Returns sorted indices descending to avoid shift issues during deletion
function findIndices(rows: any[][], matchValue: string, colIndex: number = 0) {
  return rows
    .map((r, i) => (r[colIndex] === matchValue ? i + 1 : -1))
    .filter((i) => i !== -1)
    .sort((a, b) => b - a);
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ error: "Client ID required" }, { status: 400 });
    }

    // 1. Find Client logic
    const clientRows = await readRange("Clients!A2:F"); // A=ID... F=Email
    const clientIndex = clientRows.findIndex((r) => r[0] === clientId);

    if (clientIndex === -1) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const email = clientRows[clientIndex][5]; // Col F is index 5
    const clientRowToDelete = clientIndex + 1;

    // 2. Identify Rows to Delete
    
    // Users: Match Email (Col C)
    const userRows = await readRange("Users!C2:C");
    const userIndices = email ? findIndices(userRows, email, 0) : [];

    // Invoices: Match Client ID (Col B)
    const invoiceRows = await readRange("Invoices!B2:B");
    const invoiceIndices = findIndices(invoiceRows, clientId, 0);

    // Audit_Log: Match Email (Col D)
    const auditRows = await readRange("Audit_Log!D2:D");
    const auditIndices = email ? findIndices(auditRows, email, 0) : [];

    // 3. Perform Deletions (Sequential & Descending)
    
    // Invoices
    for (const idx of invoiceIndices) {
      await deleteRow("Invoices", idx);
    }

    // Audit Log
    for (const idx of auditIndices) {
      await deleteRow("Audit_Log", idx);
    }

    // Users
    for (const idx of userIndices) {
      await deleteRow("Users", idx);
    }

    // Client
    await deleteRow("Clients", clientRowToDelete);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete" }, { status: 500 });
  }
}
