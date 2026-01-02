"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ClientCreateSchema } from "@/lib/schemas";


type PricingRow = { name: string; price: number };
type FormData = z.infer<typeof ClientCreateSchema>;

export default function CreateClientPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pricing Data
  const [industryPricing, setIndustryPricing] = useState<PricingRow[]>([]);
  const [areaPricing, setAreaPricing] = useState<PricingRow[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(ClientCreateSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      contactNumber: "",
      whatsapp: "",
      email: "",
      username: "",
      location: "",
      industries: [],
      areas: [],
      leadQty: 100,
      channels: ["whatsapp"],
      discountPercent: 0,
      contactPerson: "",
      password: "",
      confirmPassword: "",
    },

    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    setError,
    formState: { errors },
  } = form;

  // Fetch Pricing Logic
  useEffect(() => {
    Promise.all([
      fetch("/api/pricing/industry")
        .then((r) => r.json())
        .catch(() => ({ items: [] })),
      fetch("/api/pricing/area")
        .then((r) => r.json())
        .catch(() => ({ items: [] })),
    ]).then(([ind, area]) => {
      setIndustryPricing(ind.items ?? []);
      setAreaPricing(area.items ?? []);
    });
  }, []);

  // Watched Values for Pricing Calculation
  const wIndustry = watch("industry");
  const wIndustries = watch("industries");
  const wAreas = watch("areas");
  const wLeadQty = watch("leadQty");
  const wChannels = watch("channels");
  const wDiscountPercent = watch("discountPercent");

  // Pricing Calculation
  const total = useMemo(() => {
    // Industries Average
    const selectedInd = industryPricing.filter((x) => wIndustries.includes(x.name));
    const baseIndustryPrice =
      selectedInd.length > 0
        ? selectedInd.reduce((a, b) => a + b.price, 0) / selectedInd.length
        : 0;

    // Area Multiplier Average
    const selectedArea = areaPricing.filter((x) => wAreas.includes(x.name));
    const areaMultiplier =
      selectedArea.length > 0
        ? selectedArea.reduce((a, b) => a + b.price, 0) / selectedArea.length
        : 1;

    // Channel Add-ons
    let channelAdd = 0;
    if (wChannels.includes("whatsapp")) channelAdd += 0.5;
    if (wChannels.includes("email")) channelAdd += 0.3;

    const perLead = (baseIndustryPrice + channelAdd) * areaMultiplier;
    const gross = perLead * (wLeadQty || 0);
    const disc = gross * (wDiscountPercent / 100);

    return { perLead, gross, disc, net: gross - disc };
  }, [industryPricing, areaPricing, wIndustries, wAreas, wLeadQty, wChannels, wDiscountPercent]);

  const onNextStep = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let fieldsToValidate: (keyof FormData)[] = [];
    
    // Step 1: Client Info
    if (step === 1) {
      fieldsToValidate = ["companyName", "industry", "contactPerson", "contactNumber", "whatsapp", "email", "location"];
    } 
    // Step 2: Account Setup
    else if (step === 2) {
      fieldsToValidate = ["username", "password", "confirmPassword"];
    } 
    // Step 3: Package
    else if (step === 3) {
      fieldsToValidate = ["industries", "areas", "leadQty", "channels", "discountPercent"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) {
      toast.error("Please check the form for errors.");
      setIsSubmitting(false); // Reset state if validation fails
      return;
    }

    // Custom Async Validation for Step 2 (Username)
    if (step === 2) {
      const username = watch("username");
      if (username) {
         try {
           const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
           const data = await res.json();
           if (data.exists) {
             setError("username", { type: "manual", message: "Username is already taken." });
             toast.error("Username already exists. Please choose another.");
             return; // Halt navigation
           } else {
             toast.success("Username is available.");
           }
         } catch (err) {
            console.error(err);
            toast.error("Failed to validate username availability.");
            return;
         }
      }
    }

      setStep((s) => (s < 4 ? (s + 1 as 1 | 2 | 3 | 4) : s));
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveClient = async (data: FormData, status: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const toastId = toast.loading(status === "Draft" ? "Saving draft..." : "Creating client...");

    try {
      // Merge calculated totals
    const payload = {
      ...data,
      perLeadPrice: total.perLead,
      totalPrice: total.net,
      status, 
    };

    const res = await fetch("/api/clients/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(status === "Draft" ? "Client saved as Draft." : "Client created successfully.", { id: toastId });
      window.location.href = "/clients";
    } else {
      const errorData = await res.json().catch(() => ({}));
      toast.error(errorData?.error ?? "Failed to create client", { id: toastId });
      setIsSubmitting(false); // Allow retry
    }
    } catch (e) {
      toast.error("An error occurred.", { id: toastId });
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: FormData) => saveClient(data, "Active");


  // --- UI HELPERS ---
  const currentStepLabel = ["Client Info", "Account Setup", "Package & Pricing", "Review"][step - 1];
  
  return (
    <AppShell title="Create Client">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* STEPPER */}
        <div className="flex items-center justify-center w-full">
          <div className="relative flex items-center justify-between w-full max-w-3xl">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200 -z-10 rounded"></div>
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-jsOrange-500 -z-10 rounded transition-all duration-300"
                 style={{ width: `${(step - 1) * 33.33}%` }}></div>

            {[1, 2, 3, 4].map((s) => {
              const isActive = s <= step;
              return (
                <div key={s} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold border-2 transition-colors duration-300 ${
                    isActive ? "bg-jsOrange-500 border-jsOrange-500 text-white" : "bg-white border-gray-300 text-gray-400"
                  }`}>
                    {s}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "text-jsBlack-900" : "text-gray-400"}`}>
                    {["Client Info", "Account", "Package", "Review"][s - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Card className="shadow-lg border-t-4 border-t-jsOrange-500">
          <CardHeader className="border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-jsBlack-900">New Client Registration</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Complete the form below to create a client account. Step {step} of 4: <span className="text-jsOrange-600 font-medium">{currentStepLabel}</span>
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company */}
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-base font-semibold">Company Name</Label>
                      <Input {...register("companyName")} placeholder="e.g. Acme Real Estate LLC" className="h-11" />
                      {errors.companyName && <p className="text-red-500 text-xs font-medium">{errors.companyName.message}</p>}
                    </div>

                    {/* Industry & Area (Dropdowns) */}
                    <div className="space-y-2">
                      <Label className="font-semibold">Industry</Label>
                      <select
                        {...register("industry")}
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jsOrange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Industry...</option>
                        {industryPricing.map((item) => (
                          <option key={item.name} value={item.name}>{item.name}</option>
                        ))}
                      </select>
                      {errors.industry && <p className="text-red-500 text-xs font-medium">{errors.industry.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="font-semibold">Area / Location</Label>
                      <select
                        {...register("location")}
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jsOrange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Area...</option>
                        {areaPricing.map((item) => (
                          <option key={item.name} value={item.name}>{item.name}</option>
                        ))}
                      </select>
                      {errors.location && <p className="text-red-500 text-xs font-medium">{errors.location.message}</p>}
                    </div>

                    {/* Contact Person */}
                    <div className="md:col-span-2 space-y-2">
                       <Label className="font-semibold">Contact Person</Label>
                       <Input {...register("contactPerson")} placeholder="Full Name" className="h-11" />
                       {errors.contactPerson && <p className="text-red-500 text-xs font-medium">{errors.contactPerson.message}</p>}
                    </div>
                    
                    {/* Contact Details */}
                    <div className="space-y-2">
                      <Label className="font-semibold">Mobile Number</Label>
                      <Input {...register("contactNumber")} placeholder="+971 50 123 4567" className="h-11" />
                      {errors.contactNumber && <p className="text-red-500 text-xs font-medium">{errors.contactNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">WhatsApp</Label>
                      <Input {...register("whatsapp")} placeholder="+971 50 123 4567" className="h-11" />
                      {errors.whatsapp && <p className="text-red-500 text-xs font-medium">{errors.whatsapp.message}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label className="font-semibold">Email Address</Label>
                      <Input {...register("email")} placeholder="name@company.com" className="h-11" />
                      {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
                    </div>

                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button type="button" onClick={onNextStep} disabled={isSubmitting} className="bg-jsOrange-500 hover:bg-jsOrange-600 px-8 h-12 text-base shadow-md">
                      {isSubmitting ? "Validating..." : "Next Step \u2192"}
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Account Setup */}
              {step === 2 && (
                 <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                        <div className="text-center mb-4">
                           <h3 className="text-lg font-bold text-gray-900">Platform Credentials</h3>
                           <p className="text-sm text-gray-500">Create access for the client portal.</p>
                        </div>
                        
                        <div className="space-y-2">
                           <Label className="font-semibold">Username</Label>
                           <Input {...register("username")} placeholder="Create a unique username" className="h-11" />
                           {errors.username && <p className="text-red-500 text-xs font-medium">{errors.username.message}</p>}
                        </div>

                        <div className="space-y-2">
                           <Label className="font-semibold">Password</Label>
                           <Input type="password" {...register("password")} placeholder="••••••••" className="h-11" />
                           {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                           <Label className="font-semibold">Confirm Password</Label>
                           <Input type="password" {...register("confirmPassword")} placeholder="••••••••" className="h-11" />
                           {errors.confirmPassword && <p className="text-red-500 text-xs font-medium">{errors.confirmPassword.message}</p>}
                        </div>

                    </div>
                    <div className="mt-8 flex justify-between">
                       <Button type="button" variant="secondary" onClick={() => setStep(1)} className="h-12 px-6">Back</Button>
                       <Button type="button" onClick={onNextStep} disabled={isSubmitting} className="bg-jsOrange-500 hover:bg-jsOrange-600 px-8 h-12 text-base shadow-md">
                         {isSubmitting ? "Checking..." : "Next Step \u2192"}
                       </Button>
                    </div>
                 </div>
              )}

              {/* STEP 3: Pricing & Details */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                  
                  {/* Multi-Select Grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Industries */}
                    <div className="border rounded-lg p-4 bg-gray-50/50">
                      <Label className="text-lg font-bold mb-3 block text-jsBlack-800">Target Industries</Label>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        <Controller
                          control={control}
                          name="industries"
                          render={({ field }) => (
                            <>
                              {industryPricing.map((it) => {
                                const isSelected = field.value.includes(it.name);
                                const isPrimary = it.name === wIndustry;
                                return (
                                  <label key={it.name} 
                                    className={`flex items-center justify-between p-3 rounded-md border transition-all ${
                                      isPrimary 
                                        ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60" 
                                        : "cursor-pointer hover:border-jsOrange-300 " + (isSelected ? "border-jsOrange-500 bg-orange-50" : "border-gray-200 bg-white")
                                    }`}>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-jsOrange-600 rounded focus:ring-jsOrange-500 disabled:opacity-50"
                                        checked={isSelected}
                                        disabled={isPrimary}
                                        onChange={(e) => {
                                          const newVal = e.target.checked
                                            ? [...field.value, it.name]
                                            : field.value.filter((x) => x !== it.name);
                                          field.onChange(newVal);
                                        }}
                                      />
                                      <span className="font-medium text-sm">{it.name} {isPrimary && "(Primary)"}</span>
                                    </div>
                                    <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">AED {it.price.toFixed(0)}</span>
                                  </label>
                                );
                              })}
                            </>
                          )}
                        />
                      </div>
                      {errors.industries && <p className="text-red-500 text-xs mt-2">{errors.industries.message}</p>}
                    </div>

                    {/* Areas */}
                    <div className="border rounded-lg p-4 bg-gray-50/50">
                      <Label className="text-lg font-bold mb-3 block text-jsBlack-800">Target Areas</Label>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        <Controller
                          control={control}
                          name="areas"
                          render={({ field }) => (
                            <>
                              {areaPricing.map((it) => {
                                const isSelected = field.value.includes(it.name);
                                return (
                                  <label key={it.name} 
                                      className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all hover:border-jsOrange-300 ${
                                        isSelected ? "border-jsOrange-500 bg-orange-50" : "border-gray-200 bg-white"
                                      }`}>
                                      <div className="flex items-center gap-3">
                                        <input
                                          type="checkbox"
                                          className="w-4 h-4 text-jsOrange-600 rounded focus:ring-jsOrange-500"
                                          checked={isSelected}
                                          onChange={(e) => {
                                            const newVal = e.target.checked
                                              ? [...field.value, it.name]
                                              : field.value.filter((x) => x !== it.name);
                                            field.onChange(newVal);
                                          }}
                                        />
                                        <span className="font-medium text-sm">{it.name}</span>
                                      </div>
                                      <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">x{it.price.toFixed(2)}</span>
                                    </label>
                                );
                              })}
                            </>
                          )}
                        />
                      </div>
                      {errors.areas && <p className="text-red-500 text-xs mt-2">{errors.areas.message}</p>}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <h3 className="text-base font-semibold mb-4 border-b pb-2">Volume & Channels</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <Label>Lead Quantity</Label>
                           <Input type="number" {...register("leadQty", { valueAsNumber: true })} className="h-10" />
                           {errors.leadQty && <p className="text-red-500 text-xs">{errors.leadQty.message}</p>}
                        </div>

                        <div className="space-y-2">
                           <Label>Channels</Label>
                           <div className="flex flex-col gap-2 mt-2">
                              <Controller
                                 control={control}
                                 name="channels"
                                 render={({ field }) => (
                                    <>
                                       <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                             type="checkbox"
                                             className="rounded text-jsOrange-600 focus:ring-jsOrange-500"
                                             checked={field.value.includes("whatsapp")}
                                             onChange={(e) => {
                                                const newVal = e.target.checked ? [...field.value, "whatsapp"] : field.value.filter((x) => x !== "whatsapp");
                                                field.onChange(newVal);
                                             }}
                                          />
                                          <span className="text-sm">WhatsApp (+0.50)</span>
                                       </label>
                                       <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                             type="checkbox"
                                             className="rounded text-jsOrange-600 focus:ring-jsOrange-500"
                                             checked={field.value.includes("email")}
                                             onChange={(e) => {
                                                const newVal = e.target.checked ? [...field.value, "email"] : field.value.filter((x) => x !== "email");
                                                field.onChange(newVal);
                                             }}
                                          />
                                          <span className="text-sm">Email (+0.30)</span>
                                       </label>
                                    </>
                                 )}
                              />
                           </div>
                           {errors.channels && <p className="text-red-500 text-xs">{errors.channels.message}</p>}
                        </div>

                        <div className="space-y-2">
                           <Label>Discount (%)</Label>
                           <Input type="number" {...register("discountPercent", { valueAsNumber: true })} className="h-10" />
                           {errors.discountPercent && <p className="text-red-500 text-xs">{errors.discountPercent.message}</p>}
                        </div>
                     </div>
                  </div>

                  {/* Price Summary Stickyish */}
                  <div className="rounded-xl border border-gray-200 bg-gray-900 text-white p-6 shadow-md">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                           <div className="text-xs text-gray-400 uppercase tracking-wider">Per Lead</div>
                           <div className="text-xl font-bold">AED {total.perLead.toFixed(2)}</div>
                        </div>
                        <div>
                           <div className="text-xs text-gray-400 uppercase tracking-wider">Subtotal</div>
                           <div className="text-xl font-bold">AED {total.gross.toFixed(2)}</div>
                        </div>
                        <div>
                           <div className="text-xs text-gray-400 uppercase tracking-wider">Discount</div>
                           <div className="text-xl font-bold text-red-400">- {total.disc.toFixed(2)}</div>
                        </div>
                        <div className="border-l border-gray-700 pl-4">
                           <div className="text-xs text-jsOrange-400 uppercase tracking-wider font-bold">Final Total</div>
                           <div className="text-2xl font-black text-jsOrange-500">AED {total.net.toFixed(2)}</div>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="secondary" onClick={() => setStep(2)} className="h-12 px-6">Back</Button>
                    <Button type="button" onClick={onNextStep} disabled={isSubmitting} className="bg-jsOrange-500 hover:bg-jsOrange-600 h-12 px-8 text-base shadow-md">
                      {isSubmitting ? "Processing..." : "Next Step \u2192"}
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  
                   <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                         <h3 className="font-bold text-lg text-jsBlack-900">Summary Review</h3>
                         <p className="text-gray-500 text-sm">Please verify all details before submitting.</p>
                      </div>
                      
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                         <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Client Profile</h4>
                            <div className="space-y-3 text-sm">
                               <div className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="text-gray-500">Company</span>
                                  <span className="font-medium">{watch("companyName")}</span>
                               </div>
                               <div className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="text-gray-500">Contact Person</span>
                                  <span className="font-medium">{watch("contactPerson")}</span>
                               </div>
                               <div className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="text-gray-500">Username</span>
                                  <span className="font-medium font-mono bg-gray-100 px-1 rounded">{watch("username")}</span>
                               </div>
                               <div className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="text-gray-500">Email</span>
                                  <span className="font-medium">{watch("email")}</span>
                               </div>
                               <div className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="text-gray-500">WhatsApp</span>
                                  <span className="font-medium">{watch("whatsapp")}</span>
                               </div>
                               <div className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="text-gray-500">Area/Loc</span>
                                  <span className="font-medium">{watch("location")}</span>
                               </div>
                               <div className="flex justify-between border-b border-gray-100 pb-1">
                                  <span className="text-gray-500">Industry</span>
                                  <span className="font-medium">{watch("industry")}</span>
                               </div>
                            </div>
                         </div>

                         <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Package Configuration</h4>
                            <div className="space-y-3 text-sm">
                               <div>
                                  <span className="text-gray-500 block text-xs">Target Industries</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                     {wIndustries.length ? wIndustries.map(i => <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">{i}</span>) : "-"}
                                  </div>
                               </div>
                               <div>
                                  <span className="text-gray-500 block text-xs">Target Areas</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                     {wAreas.length ? wAreas.map(i => <span key={i} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs border border-green-100">{i}</span>) : "-"}
                                  </div>
                               </div>
                               
                               <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                                  <div>
                                     <span className="text-gray-500 text-xs">Lead Qty</span>
                                     <div className="font-bold text-lg">{wLeadQty}</div>
                                  </div>
                                  <div>
                                     <span className="text-gray-500 text-xs">Channels</span>
                                     <div className="font-medium text-sm">{wChannels.join(", ")}</div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase">Total Payable</span>
                            <span className="text-2xl font-bold">AED {total.net.toFixed(2)}</span>
                         </div>
                         <div className="text-right">
                            <div className="text-sm text-gray-400">Includes {wDiscountPercent}% discount</div>
                            <div className="text-xs text-gray-500">Tax inclusive where applicable</div>
                         </div>
                      </div>
                   </div>

                  <div className="flex justify-between pt-4 gap-4">
                    <Button type="button" variant="secondary" onClick={() => setStep(3)} className="h-12 px-6">Back</Button>
                    <div className="flex gap-4">
                       <Button 
                          type="button" 
                          variant="secondary"                           onClick={handleSubmit((data) => saveClient(data, "Draft"))} 
                           disabled={isSubmitting}
                           className="h-12 px-6 border-2 border-gray-200 hover:bg-gray-50 text-gray-600"
                         >
                           {isSubmitting ? "Saving..." : "Save as Draft"}
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-jsOrange-500 hover:bg-jsOrange-600 h-12 px-8 text-base shadow-lg w-40">
                          {isSubmitting ? "Creating..." : "Create Client"}
                        </Button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
