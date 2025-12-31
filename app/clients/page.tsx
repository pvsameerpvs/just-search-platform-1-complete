import { AppShell } from "@/components/shell/app-shell";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

async function getClients() {
  const res = await fetch("http://localhost:3000/api/clients/list", { cache: "no-store" }).catch(()=>null);
  if (!res || !res.ok) return [];
  const data = await res.json();
  return data.clients ?? [];
}

export default async function ClientsPage() {
  const clients = await getClients();
  return (
    <AppShell title="Clients">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-500 text-sm">Manage clients and create new client accounts.</div>
        <Link className="rounded-md bg-jsOrange-500 px-4 py-2 text-sm text-white hover:bg-jsOrange-600" href="/clients/create">
          + Create Client
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="text-jsBlack-900 font-semibold">Clients List</div>
          <div className="text-gray-500 text-sm">Data loaded from Google Sheets</div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="text-gray-500">
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left">Company</th>
                  <th className="py-2 text-left">Industry</th>
                  <th className="py-2 text-left">Contact</th>
                  <th className="py-2 text-left">WhatsApp</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr><td className="py-4" colSpan={6}>No clients found (add rows in Clients sheet).</td></tr>
                ) : (
                  clients.map((c: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-2">{c.companyName}</td>
                      <td className="py-2">{c.industry}</td>
                      <td className="py-2">{c.contactNumber}</td>
                      <td className="py-2">{c.whatsapp}</td>
                      <td className="py-2">{c.email}</td>
                      <td className="py-2">{c.location}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
