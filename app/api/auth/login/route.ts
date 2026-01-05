import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/schemas";
import { readRange } from "@/lib/googleSheets";
import { signSession } from "@/lib/auth";

// Platform_Users sheet columns:
// A: staff_id | B: staff_name | C: staff_email | D: staff_username | E: staff_password_hash | F: staff_role
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

  const rows = await readRange("Platform_Users!A2:F");

  const userRow = rows.find((r) => {
    // C: staff_email (index 2), D: staff_username (index 3)
    const email = (r?.[2] ?? "").toString().toLowerCase();
    const uname = (r?.[3] ?? "").toString().toLowerCase();
    const input = username.toLowerCase();
    return email === input || uname === input;
  });

  if (!userRow) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // E: staff_password_hash (index 4)
  const passwordHash = (userRow?.[4] ?? "").toString();
  const ok = await bcrypt.compare(password, passwordHash).catch(() => false);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Map Platform_Users columns to Session User Object
  const user = {
    user_id: (userRow?.[0] ?? "").toString(), // A: staff_id
    name: (userRow?.[1] ?? "").toString(),    // B: staff_name
    email: (userRow?.[2] ?? "").toString(),   // C: staff_email
    role: (userRow?.[5] ?? "sales").toString() as "admin" | "sales", // F: staff_role
  };

  const token = signSession(user);
  const res = NextResponse.json({ ...user, ok: true });
  // Set cookie manually (Route Handler Response)
  res.cookies.set("js_admin_session", token, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}
