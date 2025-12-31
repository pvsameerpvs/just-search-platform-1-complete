import { NextResponse } from "next/server";
import { readRange } from "@/lib/googleSheets";

export const dynamic = 'force-dynamic';

// Industry_Pricing columns:
// A industry_name | B price_per_lead
export async function GET() {
  const rows = await readRange("IndustryPricing!A2:B");
  const items = rows.map((r) => ({
    name: (r?.[0] ?? "").toString(),
    price: Number(r?.[1] ?? 0),
  })).filter(x => x.name);
  return NextResponse.json({ items });
}
