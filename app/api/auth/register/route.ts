import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { StaffRegisterSchema } from "@/lib/schemas";
import { readRange, appendRow } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = StaffRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, email, username, password, role, contactNumber } = parsed.data;

    // 1. Check for duplicates in Platform_Users
    // Columns: A:staff_id | B:staff_name | C:staff_email | D:staff_username
    const rows = await readRange("Platform_Users!C:D");
    const existing = rows.some((row) => {
      const existingEmail = (row[0] || "").toLowerCase();
      const existingUsername = (row[1] || "").toLowerCase();
      return existingEmail === email.toLowerCase() || existingUsername === username.toLowerCase();
    });

    if (existing) {
      return NextResponse.json(
        { error: "Account with this email or username already exists" },
        { status: 409 }
      );
    }

    // 2. Hash Password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Generate ID (STF-timestamp-random)
    const staffId = `STF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 4. Append to Sheet
    // Order: staff_id, staff_name, staff_email, staff_username, staff_password_hash, staff_role, staff_contact
    await appendRow("Platform_Users!A:G", [
      staffId,
      name,
      email,
      username,
      passwordHash,
      role,
      contactNumber,
    ]);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
