"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Client } from "@/lib/data";
import { DeleteClientButton } from "@/components/clients/DeleteClientButton";

// Reuse a subset of the create schema, or make a new one.
// Simplification: Manual schema here for speed, matching fields in Google Sheet
const editSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  industry: z.string().min(1, "Industry is required"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  whatsapp: z.string().optional(),
  email: z.string().email("Invalid email"),
  location: z.string().min(1, "Location is required"),
  // Pricing/Package fields
  leadQty: z.number().min(0),
  perLeadPrice: z.number().min(0),
  totalPrice: z.number().min(0),
});

type EditFormData = z.infer<typeof editSchema>;

export function ClientEditForm({ client }: { client: Client }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      companyName: client.companyName,
      industry: client.industry,
      contactNumber: client.contactNumber,
      whatsapp: client.whatsapp,
      email: client.email,
      location: client.location,
      leadQty: client.leadQty,
      perLeadPrice: client.perLeadPrice,
      totalPrice: client.totalPrice,
    },
  });

  const onSubmit = async (data: EditFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           clientId: client.client_id,
           ...data 
        }),
      });

      if (res.ok) {
        toast.success("Client updated successfully");
        router.push(`/clients/${client.client_id}`);
        router.refresh();
      } else {
        toast.error("Failed to update client");
      }
    } catch {
      toast.error("Error updating client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
           
           <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input {...form.register("companyName")} />
              {form.formState.errors.companyName && <p className="text-xs text-red-500">{form.formState.errors.companyName.message}</p>}
           </div>

           <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <Input {...form.register("industry")} />
              {form.formState.errors.industry && <p className="text-xs text-red-500">{form.formState.errors.industry.message}</p>}
           </div>
           
           <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <Input {...form.register("contactNumber")} />
              {form.formState.errors.contactNumber && <p className="text-xs text-red-500">{form.formState.errors.contactNumber.message}</p>}
           </div>

           <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp</label>
              <Input {...form.register("whatsapp")} />
           </div>

           <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input {...form.register("email")} />
              {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
           </div>

           <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input {...form.register("location")} />
              {form.formState.errors.location && <p className="text-xs text-red-500">{form.formState.errors.location.message}</p>}
           </div>

        </CardContent>
      </Card>

      <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
                <label className="text-sm font-medium">Lead Qty</label>
                <Input type="number" {...form.register("leadQty", { valueAsNumber: true })} />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Per Lead Price</label>
                <Input type="number" {...form.register("perLeadPrice", { valueAsNumber: true })} />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Total Price</label>
                <Input type="number" {...form.register("totalPrice", { valueAsNumber: true })} />
             </div>
          </CardContent>
      </Card>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 mt-6">
         <DeleteClientButton id={client.client_id} name={client.companyName} />
         
         <div className="flex gap-3">
            <Link href={`/clients/${client.client_id}`}>
               <Button variant="secondary" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-jsOrange-500 hover:bg-jsOrange-600">
               {loading ? "Saving..." : "Save Changes"}
            </Button>
         </div>
      </div>
    </form>
  );
}
