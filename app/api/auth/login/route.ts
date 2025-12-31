import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/schemas";
import { readRange } from "@/lib/googleSheets";
import { signSession } from "@/lib/auth";

// Users sheet columns:
// A user_id | B name | C email | D username | E password_hash | F role | G status
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { username, password } = parsed.data;

  // DEV BYPASS: Allow admin/admin123 without Sheet connection
  if (username === "admin" && password === "admin123") {
    const user = {
      user_id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin" as const,
    };
    // Ensure we have a secret for signing even if env is missing
    if (!process.env.AUTH_JWT_SECRET) {
      process.env.AUTH_JWT_SECRET = "dev-fallback-secret";
    }
    const token = signSession(user);
    const res = NextResponse.json({ ...user, ok: true });
    res.cookies.set("js_admin_session", token, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  }

  const rows = await readRange("Users!A2:G");

  const userRow = rows.find((r) => {
    const email = (r?.[2] ?? "").toString().toLowerCase();
    const uname = (r?.[3] ?? "").toString().toLowerCase();
    const input = username.toLowerCase();
    return email === input || uname === input;
  });

  if (!userRow) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const status = (userRow?.[6] ?? "active").toString().toLowerCase();
  if (status !== "active") {
    return NextResponse.json({ error: "User is inactive" }, { status: 403 });
  }

  const passwordHash = (userRow?.[4] ?? "").toString();
  const ok = await bcrypt.compare(password, passwordHash).catch(() => false);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = {
    user_id: (userRow?.[0] ?? "").toString(),
    name: (userRow?.[1] ?? "").toString(),
    email: (userRow?.[2] ?? "").toString(),
    role: (userRow?.[5] ?? "sales").toString() as "admin" | "sales",
  };

  const token = signSession(user);
  const res = NextResponse.json({ ...user, ok: true });
  // Set cookie manually (Route Handler Response)
  res.cookies.set("js_admin_session", token, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}
