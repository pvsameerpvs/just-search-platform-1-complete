"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/app-shell";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Client = {
  client_id: string;
  companyName: string;
  industry: string;
  contactNumber: string;
  whatsapp: string;
  email: string;
  location: string;
  createdAt: string;
  status: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clients/list")
      .then((res) => res.json())
      .then((data) => {
         setClients(data.clients || []);
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/clients/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: id, status: newStatus }),
      });

      if (res.ok) {
        setClients(prev => prev.map(c => c.client_id === id ? { ...c, status: newStatus } : c));
        toast.success(`Client marked as ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = clients.filter((c) => 
     c.companyName.toLowerCase().includes(search.toLowerCase()) || 
     c.email.toLowerCase().includes(search.toLowerCase()) ||
     c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Client Directory">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div className="relative w-full sm:w-96">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
              <Input 
                 placeholder="Search companies, emails, or industries..." 
                 className="pl-10 bg-white"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <Link href="/clients/create">
              <Button className="bg-jsOrange-500 hover:bg-jsOrange-600 text-white shadow-md">
                 + Create New Client
              </Button>
           </Link>
        </div>

        {/* Clients Table Card */}
        <Card className="shadow-sm">
           <CardContent className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                       <tr>
                          <th className="px-6 py-4">Company Details</th>
                          <th className="px-6 py-4">Contact Info</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4 text-right"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {loading ? (
                          <tr>
                             <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                Loading clients...
                             </td>
                          </tr>
                       ) : filtered.length === 0 ? (
                          <tr>
                             <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                No clients found matching "{search}".
                             </td>
                          </tr>
                       ) : (
                          filtered.map((c, idx) => (
                             <tr key={c.client_id || idx} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                   <Link href={`/clients/${c.client_id}`} className="block hover:underline decoration-jsOrange-500">
                                      <div className="font-bold text-jsBlack-900 text-base">{c.companyName}</div>
                                   </Link>
                                   <div className="text-xs text-gray-400 font-medium inline-block bg-gray-100 px-2 py-0.5 rounded mt-1">
                                      {c.industry}
                                   </div>
                                </td>
                                <td className="px-6 py-4 space-y-1">
                                   <div className="flex items-center gap-2 text-gray-600">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                      {c.email}
                                   </div>
                                   <div className="flex items-center gap-2 text-gray-600">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                      {c.whatsapp || c.contactNumber}
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                   <div className="flex items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                      {c.location}
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                   <div className="relative inline-block">
                                      <select 
                                         value={c.status} 
                                         onChange={(e) => updateStatus(c.client_id, e.target.value)}
                                         disabled={updatingId === c.client_id}
                                         className={`appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-medium cursor-pointer border-none focus:ring-2 focus:ring-offset-1 focus:outline-none transition-colors ${
                                            c.status === "Active" 
                                               ? "bg-green-100 text-green-800 focus:ring-green-500" 
                                               : "bg-gray-100 text-gray-600 focus:ring-gray-400"
                                         }`}
                                      >
                                         <option value="Active">Active</option>
                                         <option value="Inactive">Inactive</option>
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                         <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                      </div>
                                      {updatingId === c.client_id && (
                                         <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                            <svg className="animate-spin h-3 w-3 text-gray-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                         </div>
                                      )}
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <Link href={`/clients/${c.client_id}/edit`}>
                                      <Button variant="secondary" className="h-8 w-8 p-0 text-gray-400 hover:text-jsOrange-500 hover:bg-orange-50">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                                      </Button>
                                   </Link>
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                 </table>
              </div>
           </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
