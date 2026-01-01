
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

async function getReports() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  const [admin, sales] = await Promise.all([
    fetch(`${baseUrl}/api/reports/admin`, { cache: "no-store" }).then(r => r.json()).catch(() => null),
    fetch(`${baseUrl}/api/reports/sales`, { cache: "no-store" }).then(r => r.json()).catch(() => null),
  ]);
  return { admin, sales };
}

export default async function ReportsPage() {
  const data = await getReports();

  return (
    <AppShell title="Reports">
      <div className="space-y-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
           <div>
              <h2 className="text-3xl font-bold text-jsBlack-900">Platform Reports</h2>
              <p className="text-gray-500 mt-1">Consolidated view of Admin & Sales performance</p>
           </div>
           <div>
              <Button variant="secondary" className="gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                 Export PDF
              </Button>
           </div>
        </div>

        {/* Admin Section */}
        <div className="space-y-4">
           <h3 className="text-xl font-bold text-jsBlack-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
              Admin Overview
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-100">
                 <CardContent className="p-6">
                    <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">Total Clients</div>
                    <div className="text-3xl font-bold text-blue-900">{data.admin?.totalClients ?? "-"}</div>
                    <div className="text-xs text-blue-500 mt-2">Registered in database</div>
                 </CardContent>
              </Card>
              <Card className="bg-white">
                 <CardContent className="p-6">
                    <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Paid Accounts</div>
                    <div className="text-3xl font-bold text-gray-900">{data.admin?.paidCustomers ?? "-"}</div>
                    <div className="text-xs text-green-500 mt-2 font-medium">Active Revenue</div>
                 </CardContent>
              </Card>
              <Card className="bg-white">
                 <CardContent className="p-6">
                    <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Pending</div>
                    <div className="text-3xl font-bold text-gray-900">{data.admin?.pendingPayments ?? "-"}</div>
                    <div className="text-xs text-orange-500 mt-2 font-medium">Requires follow-up</div>
                 </CardContent>
              </Card>
              <Card className="bg-white">
                 <CardContent className="p-6 opacity-50">
                     <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Growth Rate</div>
                     <div className="text-3xl font-bold text-gray-900">--</div>
                     <div className="text-xs text-gray-400 mt-2">Not enough data</div>
                 </CardContent>
              </Card>
           </div>
        </div>

        {/* Sales Section */}
        <div className="space-y-4 pt-6">
           <h3 className="text-xl font-bold text-jsBlack-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-jsOrange-500 rounded-full inline-block"></span>
              Sales Performance
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Revenue Big Card */}
              <Card className="md:col-span-2 shadow-sm border-t-4 border-t-green-500">
                 <CardHeader className="bg-gray-50/50 border-b pb-4">
                    <div className="flex justify-between items-center">
                       <div>
                          <div className="font-bold text-lg text-gray-900">Total Validated Revenue</div>
                          <div className="text-sm text-gray-500">Based on paid invoices</div>
                       </div>
                       <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded text-sm">Validated</div>
                    </div>
                 </CardHeader>
                 <CardContent className="p-8">
                     <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold text-jsBlack-900">
                           AED {(data.sales?.revenue ?? 0).toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">YTD</span>
                     </div>
                 </CardContent>
              </Card>

              {/* Stats Column */}
              <div className="space-y-4">
                 <Card>
                    <CardContent className="p-5 flex items-center justify-between">
                       <div>
                          <div className="text-xs text-gray-400 font-bold uppercase">Total Leads</div>
                          <div className="text-xl font-bold mt-1">{data.sales?.totalLeads ?? "-"}</div>
                       </div>
                       <div className="p-2 bg-gray-100 rounded text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                       </div>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardContent className="p-5 flex items-center justify-between">
                       <div>
                          <div className="text-xs text-jsOrange-500 font-bold uppercase">Conversion Rate</div>
                          <div className="text-xl font-bold mt-1">
                             {data.sales?.totalLeads && data.sales?.totalLeads > 0 
                                ? Math.round(((data.sales?.conversions ?? 0) / data.sales?.totalLeads) * 100) 
                                : 0}%
                          </div>
                       </div>
                       <div className="p-2 bg-orange-50 rounded text-jsOrange-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </div>

      </div>
    </AppShell>
  );
}
