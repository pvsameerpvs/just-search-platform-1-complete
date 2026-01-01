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
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clients/list")
      .then((res) => res.json())
      .then((data) => {
         setClients(data.clients || []);
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteClient = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/clients/delete?clientId=${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients(prev => prev.filter(c => c.client_id !== id));
        toast.success("Client deleted successfully");
      } else {
        toast.error("Failed to delete client");
      }
    } catch (err) {
      toast.error("Error deleting client");
    } finally {
      setDeletingId(null);
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
           {/* ... existing header ... */}
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
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {loading ? (
                          <tr>
                             <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                Loading clients...
                             </td>
                          </tr>
                       ) : filtered.length === 0 ? (
                          <tr>
                             <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                No clients found matching "{search}".
                             </td>
                          </tr>
                       ) : (
                          filtered.map((c, idx) => (
                             <tr key={c.client_id || idx} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                   <div className="font-bold text-jsBlack-900 text-base">{c.companyName}</div>
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
                                <td className="px-6 py-4 text-right">
                                   <Button 
                                      variant="secondary" 
                                      onClick={() => deleteClient(c.client_id, c.companyName)}
                                      disabled={deletingId === c.client_id}
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      title="Delete Client"
                                   >
                                      {deletingId === c.client_id ? (
                                         <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                      ) : (
                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                      )}
                                   </Button>
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
