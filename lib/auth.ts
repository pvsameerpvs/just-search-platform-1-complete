import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE = "js_admin_session";

export type SessionUser = {
  user_id: string;
  name: string;
  role: "admin" | "sales";
  email?: string;
};

export function signSession(user: SessionUser) {
  const secret = process.env.AUTH_JWT_SECRET!;
  return jwt.sign(user, secret, { expiresIn: "7d" });
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  } as any);
}

export function clearSessionCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" } as any);
}

export function getSession(): SessionUser | null {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) return null;
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, secret) as SessionUser;
  } catch {
    return null;
  }
}
