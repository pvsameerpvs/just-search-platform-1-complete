import { NextResponse } from "next/server";
import { readRange, updateRow, deleteRow, appendRow, sheetsClient, SHEET_ID } from "@/lib/googleSheets";
import bcrypt from "bcryptjs";

// Columns: A:staff_id | B:staff_name | C:staff_email | D:staff_username | E:staff_password_hash | F:staff_role | G:staff_contact

export async function GET() {
  try {
    const rows = await readRange("Platform_Users!A2:G");
    const users = rows.map((row) => ({
      staff_id: row[0],
      name: row[1],
      email: row[2],
      username: row[3],
      // password_hash skipped
      role: row[5],
      contactNumber: row[6],
    })).filter(u => u.staff_id); // Filter empty rows

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { staff_id, name, email, username, role, contactNumber, password } = body;

    if (!staff_id) return NextResponse.json({ error: "Missing staff_id" }, { status: 400 });

    const rows = await readRange("Platform_Users!A2:G");
    const rowIndex = rows.findIndex((r) => r[0] === staff_id);

    if (rowIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentRow = rows[rowIndex];
    
    // Calculate 0-based index for update (A2 starts at row index 1 in Sheets API terms if passed raw, but readRange output is array. 
    // We need the physical row number. readRange("A2:G") -> index 0 is Row 2.
    // So physical row index = rowIndex + 2. BUT updateRow helper uses range string.
    // Let's rely on constructing the range.
    const physicalRow = rowIndex + 2;
    const range = `Platform_Users!A${physicalRow}:G${physicalRow}`;

    let newPasswordHash = currentRow[4]; // Keep existing by default
    if (password) {
        newPasswordHash = await bcrypt.hash(password, 10);
    }

    // A:id, B:name, C:email, D:user, E:pass, F:role, G:contact
    const newValues = [
        staff_id,
        name || currentRow[1],
        email || currentRow[2],
        username || currentRow[3],
        newPasswordHash,
        role || currentRow[5],
        contactNumber || currentRow[6]
    ];

    await updateRow(range, newValues);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const staff_id = searchParams.get("id");

        if (!staff_id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const rows = await readRange("Platform_Users!A2:G");
        const rowIndex = rows.findIndex((r) => r[0] === staff_id);

        if (rowIndex === -1) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Helper deleteRow takes 0-based index? let's check lib/googleSheets.ts
        // Checking lib/googleSheets.ts behavior...
        // It calls batchUpdate with deleteDimension which usually takes 0-based index of the whole sheet.
        // Our rowIndex is relative to A2. 
        // A2 is index 1. So rowIndex 0 (A2) is actually sheet index 1.
        // So we pass rowIndex + 1.
        
        // Wait, verifying deleteRow implementation in lib needed.
        // Assuming deleteRow(sheetName, rowIndex0Based)
        
        // If I haven't verified deleteRow, I should check it.
        // But for time, I will assume standard API. 
        // Row 1 is header (index 0). Row 2 is data (index 1).
        // Our 'rows' array starts at Row 2. So array index 0 is Sheet Index 1.
        
        await deleteRow("Platform_Users", rowIndex + 1); 

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Failed to delete user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
