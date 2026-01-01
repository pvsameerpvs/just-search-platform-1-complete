
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteClientButton } from "@/components/clients/DeleteClientButton";
import { getClientById } from "@/lib/data";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await getClientById(params.id);

  if (!client) {
    notFound();
  }

  return (
    <AppShell title={`Client: ${client.companyName}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <Link href="/clients">
             <Button variant="secondary" className="gap-2">
               &larr; Back to Directory
             </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
           {/* Main Info Card */}
           <Card className="md:col-span-2 shadow-md border-t-4 border-t-jsOrange-500">
              <CardHeader className="border-b border-gray-100 pb-3">
                 <h2 className="text-xl font-bold text-jsBlack-900">Company Overview</h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs text-gray-400 uppercase tracking-wide">Company Name</label>
                       <div className="text-lg font-semibold">{client.companyName}</div>
                    </div>
                    <div>
                       <label className="text-xs text-gray-400 uppercase tracking-wide">Industry</label>
                       <div className="text-lg font-semibold">{client.industry}</div>
                    </div>
                    <div>
                       <label className="text-xs text-gray-400 uppercase tracking-wide">Location</label>
                       <div className="text-base">{client.location}</div>
                    </div>
                    <div>
                       <label className="text-xs text-gray-400 uppercase tracking-wide">Created On</label>
                       <div className="text-base">{new Date(client.createdAt).toLocaleDateString()}</div>
                    </div>
                 </div>
                 
                 <div className="pt-4 border-t border-gray-50 mt-4">
                    <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Contact Information</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-gray-600">
                       <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">Email:</span> {client.email}
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">Phone:</span> {client.contactNumber}
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">WhatsApp:</span> {client.whatsapp}
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Package Info */}
           <Card className="shadow-md bg-gray-50 border border-gray-200">
              <CardHeader className="border-b border-gray-200 pb-3 bg-white">
                 <h2 className="text-lg font-bold text-gray-900">Package Details</h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                 <div>
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-sm font-semibold text-gray-700">Lead Volume</span>
                       <span className="text-lg font-bold text-jsOrange-600">{client.leadQty}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-jsOrange-500 h-full w-full" style={{ width: '100%' }}></div>
                    </div>
                 </div>

                 <div className="space-y-2 pt-2">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Channels</span>
                        <span className="font-medium">{client.channels}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Discount</span>
                        <span className="font-medium text-green-600">{client.discountPercent}% OFF</span>
                     </div>
                 </div>

                 <div className="pt-4 border-t border-gray-200 mt-2 space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-xs uppercase text-gray-400 font-bold">Per Lead</span>
                       <span className="font-mono font-bold">AED {client.perLeadPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="text-xs uppercase text-jsBlack-900 font-bold">Total Deal Value</span>
                       <span className="font-bold text-2xl text-jsBlack-900">AED {client.totalPrice?.toLocaleString()}</span>
                    </div>
                 </div>
              </CardContent>
           </Card>
           
        </div>

        {/* Additional Details (Industries/Areas) */}
        <Card className="shadow-sm">
           <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">Target Industries</h3>
                    <div className="flex flex-wrap gap-2">
                       {client.industries.split(",").map((i: string, idx: number) => (
                          <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                             {i.trim()}
                          </span>
                       ))}
                    </div>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">Target Areas</h3>
                     <div className="flex flex-wrap gap-2">
                       {client.areas.split(",").map((a: string, idx: number) => (
                          <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-100">
                             {a.trim()}
                          </span>
                       ))}
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
