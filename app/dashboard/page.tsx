import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

async function getDashboard() {
  // For demo, we load both and render. In real use, role decides which endpoint.
  const [admin, sales] = await Promise.all([
    fetch(process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/admin` : "http://localhost:3000/api/reports/admin", { cache: "no-store" }).then(r=>r.json()).catch(()=>null),
    fetch(process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/sales` : "http://localhost:3000/api/reports/sales", { cache: "no-store" }).then(r=>r.json()).catch(()=>null),
  ]);
  return { admin, sales };
}

export default async function DashboardPage() {
  const data = await getDashboard();
  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="text-jsBlack-900 font-semibold">Admin Overview</div>
            <div className="text-gray-500 text-sm">Month-wise client addition & payments</div>
          </CardHeader>
          <CardContent className="text-gray-700 text-sm space-y-2">
            <div>Total Clients: <b className="text-jsBlack-900">{data.admin?.totalClients ?? "-"}</b></div>
            <div>Registered: <b className="text-jsBlack-900">{data.admin?.registeredCustomers ?? "-"}</b></div>
            <div>Paid: <b className="text-jsBlack-900">{data.admin?.paidCustomers ?? "-"}</b></div>
            <div>Pending Payments: <b className="text-jsBlack-900">{data.admin?.pendingPayments ?? "-"}</b></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-jsBlack-900 font-semibold">Sales Performance</div>
            <div className="text-gray-500 text-sm">Leads, revenue, meetings, conversions</div>
          </CardHeader>
          <CardContent className="text-gray-700 text-sm space-y-2">
            <div>Total Leads: <b className="text-jsBlack-900">{data.sales?.totalLeads ?? "-"}</b></div>
            <div>Revenue: <b className="text-jsBlack-900">{data.sales?.revenue ?? "-"}</b></div>
            <div>Meetings: <b className="text-jsBlack-900">{data.sales?.meetings ?? "-"}</b></div>
            <div>Conversions: <b className="text-jsBlack-900">{data.sales?.conversions ?? "-"}</b></div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
