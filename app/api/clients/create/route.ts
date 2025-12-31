import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ClientCreateSchema } from "@/lib/schemas";
import { appendRow } from "@/lib/googleSheets";

// Creates:
/// 1) Clients row
/// 2) Users row for client (for Platform 2 login) — optional extension later
/// 3) Audit log row
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = ClientCreateSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Client validation error:", parsed.error.format());
    const errorMessage = Object.entries(parsed.error.flatten().fieldErrors)
      .map(([key, errors]) => `${key}: ${errors?.join(", ")}`)
      .join(" | ");
    return NextResponse.json({ error: `Invalid input: ${errorMessage}` }, { status: 400 });
  }

  const d = parsed.data;
  const clientId = `C-${Date.now()}`;
  const createdAt = new Date().toISOString();

  await appendRow("Clients!A:H", [
    clientId,
    d.companyName,
    d.industry,
    d.contactNumber,
    d.whatsapp,
    d.email,
    d.location,
    createdAt,
  ]);

  // Optional: auto-create client credentials for Platform 2
  const clientUsername = d.email.toLowerCase();
  const tempPassword = "Client@1234"; // you can generate dynamically
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  await appendRow("Users!A:G", [
    `U-${Date.now()}`,
    d.companyName,
    d.email,
    clientUsername,
    passwordHash,
    "client",
    "active",
  ]);

  await appendRow("Audit_Log!A:E", [
    Date.now().toString(),
    "CLIENT_CREATED",
    d.companyName,
    d.email,
    createdAt,
  ]);

  return NextResponse.json({
    ok: true,
    clientId,
    clientUsername,
    tempPassword,
    message: "Client created. Share credentials with client.",
  });
}
