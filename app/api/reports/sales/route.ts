import { NextResponse } from "next/server";
import { readRange } from "@/lib/googleSheets";

export const dynamic = 'force-dynamic';

export async function GET() {
  const invoices = await readRange("Invoices!A2:E").catch(() => [] as any[]);

  const totalLeads = 0; // Lead generation is handled in Platform 2; keep for future aggregation
  const revenue = invoices
    .filter((i) => (i?.[3] ?? "").toString().toLowerCase() === "paid")
    .reduce((sum, i) => sum + Number(i?.[2] ?? 0), 0);

  return NextResponse.json({
    totalLeads,
    revenue,
    meetings: 0,
    conversions: 0,
  });
}
