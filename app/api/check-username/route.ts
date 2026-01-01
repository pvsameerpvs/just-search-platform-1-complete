
import { NextResponse } from "next/server";
import { readRange } from "@/lib/googleSheets";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  // Users sheet column D (index 3) is commonly Username
  const rows = await readRange("Users!D2:D"); 
  const usernames = rows.map((r) => (r?.[0]?.toString() ?? "").trim().toLowerCase());

  const exists = usernames.includes(username.trim().toLowerCase());

  return NextResponse.json({ exists });
}
