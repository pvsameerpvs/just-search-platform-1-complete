import { NextResponse } from "next/server";
import { readRange } from "@/lib/googleSheets";

export const dynamic = 'force-dynamic';

// Clients columns recommended:
// A client_id | B companyName | C industry | D contactNumber | E whatsapp | F email | G location | H createdAt
export async function GET() {
  const rows = await readRange("Clients!A2:H");
  const clients = rows.map((r) => ({
    client_id: (r?.[0] ?? "").toString(),
    companyName: (r?.[1] ?? "").toString(),
    industry: (r?.[2] ?? "").toString(),
    contactNumber: (r?.[3] ?? "").toString(),
    whatsapp: (r?.[4] ?? "").toString(),
    email: (r?.[5] ?? "").toString(),
    location: (r?.[6] ?? "").toString(),
    createdAt: (r?.[7] ?? "").toString(),
  })).filter(c => c.companyName);
  return NextResponse.json({ clients });
}
