
import { NextResponse } from "next/server";
import { readRange, updateRow } from "@/lib/googleSheets";

// Helper to find row index by Client ID (Col A)
async function findRowIndex(clientId: string): Promise<number | null> {
  const rows = await readRange("Clients!A2:A");
  const index = rows.findIndex((r) => r[0] === clientId);
  return index === -1 ? null : index + 2; // +2 because 1-based index and header row
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { 
      clientId, 
      companyName, 
      industry, 
      contactNumber, 
      whatsapp, 
      email, 
      location,
      leadQty,
      perLeadPrice,
      totalPrice,
      industries, // New
      areas       // New
    } = body;

    if (!clientId) {
      return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
    }

    const rowIndex = await findRowIndex(clientId);
    if (!rowIndex) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Read the EXISTING row to preserve other fields
    const range = `Clients!A${rowIndex}:P${rowIndex}`; // Read full row
    const existingRows = await readRange(range);
    const existing = existingRows[0] || [];

    // Map existing data to variables for clarity
    // A=0, B=1, ...
    const _clientId = existing[0]; // Keep original ID
    const _createdAt = existing[7];
    // _industries and _areas are now updated via body
    const _channels = existing[11];
    const _discount = existing[12];
    const _status = existing[15];

    // Construct NEW row
    const newRow = [
      _clientId,                  // A: client_id
      companyName,                // B: companyName
      industry,                   // C: industry
      contactNumber,              // D: contactNumber
      whatsapp,                   // E: whatsapp
      email,                      // F: email
      location,                   // G: location
      _createdAt,                 // H: createdAt
      industries,                 // I: industries (Updated)
      areas,                      // J: areas (Updated)
      leadQty,                    // K: leadQty
      _channels,                  // L: channels
      _discount,                  // M: discountPercent
      perLeadPrice,               // N: perLeadPrice
      totalPrice,                 // O: totalPrice
      _status                     // P: status
    ];

    await updateRow(range, newRow);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Update client error:", err);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}
