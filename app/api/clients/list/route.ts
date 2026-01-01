import { NextResponse } from "next/server";
import { getAllClients } from "@/lib/data";

export const dynamic = 'force-dynamic';

export async function GET() {
  const clients = await getAllClients();
  return NextResponse.json({ clients });
}
