"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/app-shell";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function DraftsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients/list")
      .then((res) => res.json())
      .then((data) => {
         // Filter for Drafts only
         const allClients: Client[] = data.clients || [];
         setClients(allClients.filter(c => c.status === "Draft"));
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = clients.filter((c) => 
     c.companyName.toLowerCase().includes(search.toLowerCase()) || 
     c.email.toLowerCase().includes(search.toLowerCase()) ||
     c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Draft Directory">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div className="relative w-full sm:w-96">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
              <Input 
                 placeholder="Search drafts..." 
                 className="pl-10 bg-white"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           {/* No Create button needed here, logical flow is to start a new client */}
        </div>

        {/* Clients Table Card */}
        <Card className="shadow-sm border-dashed border-2 border-gray-200">
           <CardContent className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                       <tr>
                          <th className="px-6 py-4">Company Details</th>
                          <th className="px-6 py-4">Contact Info</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4 text-center">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {loading ? (
                          <tr>
                             <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                Loading drafts...
                             </td>
                          </tr>
                       ) : filtered.length === 0 ? (
                          <tr>
                             <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                {clients.length === 0 
                                  ? "No draft clients found." 
                                  : `No drafts found matching "${search}".`}
                             </td>
                          </tr>
                       ) : (
                          filtered.map((c, idx) => (
                             <tr key={c.client_id || idx} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                   <div className="font-bold text-gray-700 text-base">{c.companyName}</div>
                                   <div className="text-xs text-gray-400 font-medium inline-block bg-gray-100 px-2 py-0.5 rounded mt-1">
                                      {c.industry || "Unspecified"}
                                   </div>
                                </td>
                                <td className="px-6 py-4 space-y-1">
                                   <div className="flex items-center gap-2 text-gray-600">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                      {c.email || "-"}
                                   </div>
                                   <div className="flex items-center gap-2 text-gray-600">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                      {c.whatsapp || c.contactNumber || "-"}
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                   <div className="flex items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                      {c.location || "-"}
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      Draft
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                   <Link href={`/clients/${c.client_id}/edit`}>
                                      <Button variant="secondary" className="h-8 text-xs px-3 bg-white border text-jsOrange-600 border-jsOrange-500 hover:bg-jsOrange-50 hover:text-jsOrange-700">
                                         Resume
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
