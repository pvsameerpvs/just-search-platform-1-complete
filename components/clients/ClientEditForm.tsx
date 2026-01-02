"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { Client } from "@/lib/data";
import { DeleteClientButton } from "@/components/clients/DeleteClientButton";

// Pricing Data Types
type PricingRow = { name: string; price: number };

const editSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  industry: z.string().min(1, "Industry is required"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  whatsapp: z.string().optional(),
  email: z.string().email("Invalid email"),
  location: z.string().min(1, "Location is required"),
  // Pricing/Package fields
  industries: z.array(z.string()), // Changed to array
  areas: z.array(z.string()),      // Changed to array
  leadQty: z.number().min(0),
  perLeadPrice: z.number().min(0),
  totalPrice: z.number().min(0),
});

type EditFormData = z.infer<typeof editSchema>;

export function ClientEditForm({ client }: { client: Client }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [industryPricing, setIndustryPricing] = useState<PricingRow[]>([]);
  const [areaPricing, setAreaPricing] = useState<PricingRow[]>([]);

  // Parse initial comma-separated strings into arrays
  const initialIndustries = client.industries 
    ? client.industries.split(",").map(s => s.trim()).filter(Boolean) 
    : [];
  const initialAreas = client.areas 
    ? client.areas.split(",").map(s => s.trim()).filter(Boolean) 
    : [];

  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      companyName: client.companyName,
      industry: client.industry,
      contactNumber: client.contactNumber,
      whatsapp: client.whatsapp,
      email: client.email,
      location: client.location,
      industries: initialIndustries,
      areas: initialAreas,
      leadQty: client.leadQty,
      perLeadPrice: client.perLeadPrice,
      totalPrice: client.totalPrice,
    },
  });

  const wIndustry = form.watch("industry");

  // Fetch Pricing Data
  useEffect(() => {
    Promise.all([
      fetch("/api/pricing/industry").then((r) => r.json()).catch(() => ({ items: [] })),
      fetch("/api/pricing/area").then((r) => r.json()).catch(() => ({ items: [] })),
    ]).then(([ind, area]) => {
      setIndustryPricing(ind.items ?? []);
      setAreaPricing(area.items ?? []);
    });
  }, []);

  const onSubmit = async (data: EditFormData) => {
    setLoading(true);
    try {
      // Convert arrays back to comma-separated strings for API
      const payload = {
        clientId: client.client_id,
        ...data,
        industries: data.industries.join(", "),
        areas: data.areas.join(", "),
      };

      const res = await fetch("/api/clients/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
              <Label>Company Name</Label>
              <Input {...form.register("companyName")} />
              {form.formState.errors.companyName && <p className="text-xs text-red-500">{form.formState.errors.companyName.message}</p>}
           </div>

           <div className="space-y-2">
              <Label>Industry</Label>
              {/* Main Industry Dropdown from pricing data (Single Select) */}
              <Controller
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     <option value="">Select Industry...</option>
                     {industryPricing.map((item) => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                     ))}
                  </select>
                )}
              />
              {form.formState.errors.industry && <p className="text-xs text-red-500">{form.formState.errors.industry.message}</p>}
           </div>
           
           <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input {...form.register("contactNumber")} />
              {form.formState.errors.contactNumber && <p className="text-xs text-red-500">{form.formState.errors.contactNumber.message}</p>}
           </div>

           <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input {...form.register("whatsapp")} />
           </div>

           <div className="space-y-2">
              <Label>Email</Label>
              <Input {...form.register("email")} />
              {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
           </div>

           <div className="space-y-2">
              <Label>Location</Label>
              <Controller
                control={form.control}
                name="location"
                render={({ field }) => (
                  <select
                     {...field}
                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     <option value="">Select Area...</option>
                     {areaPricing.map((item) => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                     ))}
                  </select>
                )}
              />
              {form.formState.errors.location && <p className="text-xs text-red-500">{form.formState.errors.location.message}</p>}
           </div>

           {/* TARGET INDUSTRIES (Multi-Select) */}
           <div className="space-y-2 md:col-span-2 border rounded-md p-4 bg-gray-50/50">
              <Label className="block mb-2 font-semibold">Target Industries (Multi-Select)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                 <Controller
                    control={form.control}
                    name="industries"
                    render={({ field }) => {
                       return (
                       <>
                              {industryPricing.map((it) => {
                                 const isSelected = field.value.includes(it.name);
                                 const isPrimary = it.name === wIndustry;
                                 return (
                                    <label key={it.name} className={`flex items-center justify-between p-2 rounded border transition-all ${isPrimary ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-white hover:shadow-sm " + (isSelected ? "bg-white border-jsOrange-500 ring-1 ring-jsOrange-500" : "bg-transparent border-gray-200")}`}>
                                       <div className="flex items-center gap-2">
                                          <input
                                             type="checkbox"
                                             className="rounded text-jsOrange-600 focus:ring-jsOrange-500 disabled:opacity-50"
                                             checked={isSelected}
                                             disabled={isPrimary}
                                             onChange={(e) => {
                                                const newVal = e.target.checked
                                                   ? [...field.value, it.name]
                                                   : field.value.filter((x) => x !== it.name);
                                                field.onChange(newVal);
                                             }}
                                          />
                                          <span className="text-sm">{it.name} {isPrimary && "(Primary)"}</span>
                                       </div>
                                       <span className="text-xs text-gray-400">AED {it.price}</span>
                                    </label>
                                 );
                              })}
                       </>
                    )}}
                 />
              </div>
           </div>

           {/* TARGET AREAS (Multi-Select) */}
           <div className="space-y-2 md:col-span-2 border rounded-md p-4 bg-gray-50/50">
              <Label className="block mb-2 font-semibold">Target Areas (Multi-Select)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                 <Controller
                    control={form.control}
                    name="areas"
                    render={({ field }) => (
                       <>
                          {areaPricing.map((it) => {
                             const isSelected = field.value.includes(it.name);
                             return (
                                <label key={it.name} className={`flex items-center justify-between p-2 rounded border cursor-pointer hover:bg-white hover:shadow-sm transition-all ${isSelected ? "bg-white border-jsOrange-500 ring-1 ring-jsOrange-500" : "bg-transparent border-gray-200"}`}>
                                   <div className="flex items-center gap-2">
                                      <input
                                         type="checkbox"
                                         className="rounded text-jsOrange-600 focus:ring-jsOrange-500"
                                         checked={isSelected}
                                         onChange={(e) => {
                                            const newVal = e.target.checked
                                               ? [...field.value, it.name]
                                               : field.value.filter((x) => x !== it.name);
                                            field.onChange(newVal);
                                         }}
                                      />
                                      <span className="text-sm">{it.name}</span>
                                   </div>
                                   <span className="text-xs text-gray-400">x{it.price}</span>
                                </label>
                             );
                          })}
                       </>
                    )}
                 />
              </div>
           </div>

        </CardContent>
      </Card>

      <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
                <Label>Lead Qty</Label>
                <Input type="number" {...form.register("leadQty", { valueAsNumber: true })} />
             </div>
             <div className="space-y-2">
                <Label>Per Lead Price</Label>
                <Input type="number" {...form.register("perLeadPrice", { valueAsNumber: true })} />
             </div>
             <div className="space-y-2">
                <Label>Total Price</Label>
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
