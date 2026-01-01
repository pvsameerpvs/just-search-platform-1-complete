
import { NextResponse } from "next/server";
import { readRange, updateRow } from "@/lib/googleSheets";

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { clientId, status } = body;

    if (!clientId || !status) {
      return NextResponse.json({ error: "Missing clientId or status" }, { status: 400 });
    }

    // 1. Update Client Status
    // Read Client ID (A) and Email (F)
    const clientRows = await readRange("Clients!A2:F");
    const clientIndex = clientRows.findIndex((r) => r[0] === clientId);

    if (clientIndex === -1) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get email before updating status (Col F is index 5)
    // Note: clientRows might not have 6 columns if F is empty, but for registered clients it should be there.
    const clientEmail = clientRows[clientIndex][5]; 

    const clientRowNumber = clientIndex + 2;
    const clientRange = `Clients!P${clientRowNumber}:P${clientRowNumber}`;
    await updateRow(clientRange, [status]);

    // 2. Update User Status if email exists
    if (clientEmail) {
       // Read Users Email (C) -> Users!C2:C
       const userRows = await readRange("Users!C2:C");
       const userIndex = userRows.findIndex((r) => r[0] === clientEmail);

       if (userIndex !== -1) {
          const userRowNumber = userIndex + 2;
          // Status is Column G (Index 6)
          // Since we are targeting G directly, the range is G:G
          const userRange = `Users!G${userRowNumber}:G${userRowNumber}`;
          // Ensure casing matches what you want. Assuming 'Active'/'Inactive' passed from frontend.
          // Lowercase 'active' might be safer if that's the standard for users table, 
          // but I'll use raw status for now as requested.
          await updateRow(userRange, [status]);
       }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Status update error:", err);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
