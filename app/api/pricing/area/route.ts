import { NextResponse } from "next/server";
import { readRange } from "@/lib/googleSheets";

export const dynamic = 'force-dynamic';

// Area_Pricing columns:
// A area_name | B multiplier
export async function GET() {
  const rows = await readRange("Area_Pricing!A2:B");
  const items = rows.map((r) => ({
    name: (r?.[0] ?? "").toString(),
    price: Number(r?.[1] ?? 1),
  })).filter(x => x.name);
  return NextResponse.json({ items });
}
