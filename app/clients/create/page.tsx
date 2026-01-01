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
  const [step, setStep] = useState<1 | 2 | 3>(1);

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
    },

    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
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
    let fieldsToValidate: (keyof FormData)[] = [];
    if (step === 1) {
      fieldsToValidate = ["companyName", "industry", "contactPerson", "contactNumber", "whatsapp", "email", "username", "password", "location"];
    } else if (step === 2) {
      fieldsToValidate = ["industries", "areas", "leadQty", "channels", "discountPercent"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((s) => (s < 3 ? (s + 1 as 1 | 2 | 3) : s));
    }
  };

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/clients/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Client created successfully.");
      window.location.href = "/clients";
    } else {
      const errorData = await res.json().catch(() => ({}));
      toast.error(errorData?.error ?? "Failed to create client");
    }
  };

  return (
    <AppShell title="Create Client">
      <Card>
        <CardHeader>
          <div className="text-jsBlack-900 font-semibold">Client Registration</div>
          <div className="text-gray-500 text-sm">Step {step} of 3</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Company Name *</Label>
                  <Input {...register("companyName")} placeholder="Company Name" />
                  {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label>Industry *</Label>
                  <select
                    {...register("industry")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Industry</option>
                    {industryPricing.map((item) => (
                      <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                  {errors.industry && <p className="text-red-500 text-xs">{errors.industry.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label>Contact Person *</Label>
                  <Input {...register("contactPerson")} placeholder="Full Name" />
                  {errors.contactPerson && <p className="text-red-500 text-xs">{errors.contactPerson.message}</p>}
                </div>
                <div>
                  <Label>Contact Number *</Label>
                  <Input {...register("contactNumber")} placeholder="+971..." />
                  {errors.contactNumber && <p className="text-red-500 text-xs">{errors.contactNumber.message}</p>}
                </div>
                <div>
                  <Label>Email ID *</Label>
                  <Input {...register("email")} placeholder="example@email.com" />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
                <div>
                  <Label>WhatsApp *</Label>
                  <Input {...register("whatsapp")} placeholder="+971..." />
                  {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp.message}</p>}
                </div>
                <div>
                  <Label>Username *</Label>
                  <Input {...register("username")} placeholder="client_username" />
                  {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input type="password" {...register("password")} placeholder="******" />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <div>
                  <Label>Area *</Label>
                  <select
                    {...register("location")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Area</option>
                    {areaPricing.map((item) => (
                      <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                  {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="button" onClick={onNextStep}>Next</Button>
                </div>
              </div>
            )}

            {/* STEP 2: Pricing & Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Select Industries (Multi Select)</Label>
                    <div className="mt-2 space-y-2">
                      <Controller
                        control={control}
                        name="industries"
                        render={({ field }) => (
                          <>
                            {industryPricing.map((it) => (
                              <label key={it.name} className="flex items-center gap-2 text-gray-700 text-sm">
                                <input
                                  type="checkbox"
                                  checked={field.value.includes(it.name)}
                                  onChange={(e) => {
                                    const newVal = e.target.checked
                                      ? [...field.value, it.name]
                                      : field.value.filter((x) => x !== it.name);
                                    field.onChange(newVal);
                                  }}
                                />
                                <span className="flex-1">{it.name}</span>
                                <span className="text-gray-500">AED {it.price.toFixed(2)}</span>
                              </label>
                            ))}
                          </>
                        )}
                      />
                    </div>
                    {errors.industries && <p className="text-red-500 text-xs">{errors.industries.message}</p>}
                  </div>

                  <div>
                    <Label>Select Areas (Multi Select)</Label>
                    <div className="mt-2 space-y-2">
                      <Controller
                        control={control}
                        name="areas"
                        render={({ field }) => (
                          <>
                            {areaPricing.map((it) => (
                              <label key={it.name} className="flex items-center gap-2 text-gray-700 text-sm">
                                <input
                                  type="checkbox"
                                  checked={field.value.includes(it.name)}
                                  onChange={(e) => {
                                    const newVal = e.target.checked
                                      ? [...field.value, it.name]
                                      : field.value.filter((x) => x !== it.name);
                                    field.onChange(newVal);
                                  }}
                                />
                                <span className="flex-1">{it.name}</span>
                                <span className="text-gray-500">x {it.price.toFixed(2)}</span>
                              </label>
                            ))}
                          </>
                        )}
                      />
                    </div>
                    {errors.areas && <p className="text-red-500 text-xs">{errors.areas.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Number of Leads *</Label>
                    <Input
                      type="number"
                      {...register("leadQty", { valueAsNumber: true })}
                    />
                    {errors.leadQty && <p className="text-red-500 text-xs">{errors.leadQty.message}</p>}
                  </div>

                  <div>
                    <Label>Marketing Channel</Label>
                    <div className="mt-2 space-y-2 text-gray-700 text-sm">
                      <Controller
                        control={control}
                        name="channels"
                        render={({ field }) => (
                          <>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.value.includes("whatsapp")}
                                onChange={(e) => {
                                  const newVal = e.target.checked
                                    ? [...field.value, "whatsapp"]
                                    : field.value.filter((x) => x !== "whatsapp");
                                  field.onChange(newVal);
                                }}
                              />
                              WhatsApp (+0.50/lead)
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.value.includes("email")}
                                onChange={(e) => {
                                  const newVal = e.target.checked
                                    ? [...field.value, "email"]
                                    : field.value.filter((x) => x !== "email");
                                  field.onChange(newVal);
                                }}
                              />
                              Email (+0.30/lead)
                            </label>
                          </>
                        )}
                      />
                    </div>
                    {errors.channels && <p className="text-red-500 text-xs">{errors.channels.message}</p>}
                  </div>

                  <div>
                    <Label>Discount Available (%)</Label>
                    <Input
                      type="number"
                      {...register("discountPercent", { valueAsNumber: true })}
                    />
                     {errors.discountPercent && <p className="text-red-500 text-xs">{errors.discountPercent.message}</p>}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700 text-sm">
                  <div className="flex justify-between"><span>Price / Lead</span><b className="text-jsBlack-900">AED {total.perLead.toFixed(2)}</b></div>
                  <div className="flex justify-between"><span>Total Price</span><b className="text-jsBlack-900">AED {total.gross.toFixed(2)}</b></div>
                  <div className="flex justify-between"><span>Discount</span><b className="text-jsBlack-900">- AED {total.disc.toFixed(2)}</b></div>
                  <div className="flex justify-between border-t border-gray-200 mt-2 pt-2"><span>Final Price</span><b className="text-jsBlack-900">AED {total.net.toFixed(2)}</b></div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" onClick={onNextStep}>Next</Button>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div className="space-y-4 text-gray-700 text-sm">
                <div className="text-jsBlack-900 font-semibold">Review & Confirm</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-gray-500">Client</div>
                    <div className="text-jsBlack-900">{watch("companyName")}</div>
                    <div className="text-sm font-medium">{watch("contactPerson")}</div>
                    <div>{watch("email")}</div>
                    <div>Username: <b>{watch("username")}</b></div>
                    <div>{watch("whatsapp")}</div>
                    <div>{watch("location")}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-gray-500">Package</div>
                    <div>Industries: <b className="text-jsBlack-900">{wIndustries.join(", ") || "-"}</b></div>
                    <div>Areas: <b className="text-jsBlack-900">{wAreas.join(", ") || "-"}</b></div>
                    <div>Leads: <b className="text-jsBlack-900">{wLeadQty}</b></div>
                    <div>Channels: <b className="text-jsBlack-900">{wChannels.join(", ")}</b></div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex justify-between"><span>Total</span><b className="text-jsBlack-900">AED {total.gross.toFixed(2)}</b></div>
                  <div className="flex justify-between"><span>Discount</span><b className="text-jsBlack-900">- AED {total.disc.toFixed(2)}</b></div>
                  <div className="flex justify-between border-t border-gray-200 mt-2 pt-2"><span>Final Price</span><b className="text-jsBlack-900">AED {total.net.toFixed(2)}</b></div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit">Create Client</Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
