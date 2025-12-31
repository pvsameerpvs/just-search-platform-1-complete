import { NextResponse } from "next/server";
import { readRange } from "@/lib/googleSheets";

export const dynamic = 'force-dynamic';

export async function GET() {
  const clients = await readRange("Clients!A2:H");
  const payments = await readRange("Payments!A2:E").catch(() => [] as any[]);

  const totalClients = clients.length;
  const registeredCustomers = totalClients; // in your flow, created clients are registered
  const paidCustomers = payments.filter((p) => (p?.[3] ?? "").toString().toLowerCase() === "paid").length;
  const pendingPayments = payments.filter((p) => (p?.[3] ?? "").toString().toLowerCase() === "pending").length;

  return NextResponse.json({
    totalClients,
    registeredCustomers,
    paidCustomers,
    pendingPayments,
  });
}
