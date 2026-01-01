
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getDashboard() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  const [admin, sales] = await Promise.all([
    fetch(`${baseUrl}/api/reports/admin`, { cache: "no-store" }).then(r => r.json()).catch(() => null),
    fetch(`${baseUrl}/api/reports/sales`, { cache: "no-store" }).then(r => r.json()).catch(() => null),
  ]);
  return { admin, sales };
}

export default async function DashboardPage() {
  const data = await getDashboard();

  // Aggregate Data
  const stats = {
    revenue: (data.sales?.revenue || 0) + (data.admin?.revenue || 0), // Assuming admin might have revenue field later, currently 0
    clients: data.admin?.totalClients || 0,
    paid: data.admin?.paidCustomers || 0,
    pending: data.admin?.pendingPayments || 0,
  };

  return (
    <AppShell title="Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-jsBlack-900">Just Search Management Suite</h2>
            <p className="text-gray-500 mt-1 text-lg">Centralized Internal Management Platform</p>
          </div>
          <div className="flex gap-3">
             <Link href="/clients/create">
                <Button className="bg-jsOrange-500 hover:bg-jsOrange-600 text-white shadow-lg transition-all hover:-translate-y-0.5">
                  + New Client
                </Button>
             </Link>
          </div>
        </div>

        {/* COMPACT KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Revenue Card */}
          <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Revenue</p>
                   <h3 className="text-2xl font-bold text-jsBlack-900 mt-1">AED {stats.revenue.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Clients Card */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Clients</p>
                   <h3 className="text-2xl font-bold text-jsBlack-900 mt-1">{stats.clients}</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>

           {/* Paid Customers Card */}
           <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Paid Clients</p>
                   <h3 className="text-2xl font-bold text-jsBlack-900 mt-1">{stats.paid}</h3>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments Card */}
          <Card className="border-l-4 border-l-jsOrange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending Payments</p>
                   <h3 className="text-2xl font-bold text-jsBlack-900 mt-1">{stats.pending}</h3>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg text-jsOrange-600">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Column: Quick Actions & Recent */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Quick Actions */}
              <section>
                 <h3 className="text-lg font-bold text-jsBlack-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    Quick Actions
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/clients/create" className="group">
                       <Card className="h-full hover:border-jsOrange-300 transition-colors cursor-pointer group-hover:shadow-md">
                          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                             <div className="w-12 h-12 bg-jsOrange-100 text-jsOrange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="20" x2="20" y1="8" y2="14"/><line x1="23" x2="17" y1="11" y2="11"/></svg>
                             </div>
                             <div>
                                <h4 className="font-bold text-jsBlack-900">Register New Client</h4>
                                <p className="text-xs text-gray-500 mt-1">Onboard a new client & generate invoice</p>
                             </div>
                          </CardContent>
                       </Card>
                    </Link>

                    <Link href="/clients" className="group">
                       <Card className="h-full hover:border-blue-300 transition-colors cursor-pointer group-hover:shadow-md">
                          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                             </div>
                             <div>
                                <h4 className="font-bold text-jsBlack-900">Client Directory</h4>
                                <p className="text-xs text-gray-500 mt-1">View and manage all registered clients</p>
                             </div>
                          </CardContent>
                       </Card>
                    </Link>
                    
                    <Link href="/reports" className="group">
                       <Card className="h-full hover:border-purple-300 transition-colors cursor-pointer group-hover:shadow-md">
                          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                             <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
                             </div>
                             <div>
                                <h4 className="font-bold text-jsBlack-900">Financial Reports</h4>
                                <p className="text-xs text-gray-500 mt-1">Track revenue and payments</p>
                             </div>
                          </CardContent>
                       </Card>
                    </Link>

                    
                 </div>
              </section>

           </div>

           {/* Right Column: Analytics Placeholder */}
           <div className="lg:col-span-1">
              <section className="h-full">
                 <h3 className="text-lg font-bold text-jsBlack-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    Performance Analytics
                 </h3>
                 <Card className="h-80 border-dashed border-2 bg-gray-50 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                    </div>
                    
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4 z-10">
                       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    
                    <h4 className="font-bold text-gray-800 z-10">Analytics Module</h4>
                    <p className="text-sm text-gray-500 mt-2 max-w-[200px] z-10">
                       Advanced charts and reporting coming soon.
                    </p>
                    <div className="mt-6 z-10">
                       <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">COMING SOON</span>
                    </div>
                 </Card>
              </section>
           </div>
        </div>
      </div>
    </AppShell>
  );
}
