import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readRange, updateRow } from "@/lib/googleSheets";

// Columns: A:staff_id | B:name | C:email | D:username | E:password_hash | F:role | G:contact

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await readRange("Platform_Users!A2:G");
    const userRow = rows.find((r) => r[0] === session.user_id);

    if (!userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = {
      staff_id: userRow[0],
      name: userRow[1],
      email: userRow[2],
      username: userRow[3],
      role: userRow[5],
      contactNumber: userRow[6],
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, contactNumber } = body;

    const rows = await readRange("Platform_Users!A2:G");
    const rowIndex = rows.findIndex((r) => r[0] === session.user_id);

    if (rowIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentRow = rows[rowIndex];
    const physicalRow = rowIndex + 2;
    const range = `Platform_Users!A${physicalRow}:G${physicalRow}`;

    // A:id, B:name, C:email, D:user, E:pass, F:role, G:contact
    const newValues = [
      currentRow[0], // id
      name || currentRow[1], // name
      currentRow[2], // email
      currentRow[3], // username
      currentRow[4], // password (hidden)
      currentRow[5], // role
      contactNumber || currentRow[6], // contact
    ];

    await updateRow(range, newValues);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
