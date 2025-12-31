"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type PricingRow = { name: string; price: number };

export default function CreateClientPage() {
  const [step, setStep] = useState<1|2|3>(1);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [clientLocation, setClientLocation] = useState("");

  // Step 2 pricing
  const [industryPricing, setIndustryPricing] = useState<PricingRow[]>([]);
  const [areaPricing, setAreaPricing] = useState<PricingRow[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [leadQty, setLeadQty] = useState(100);
  const [channels, setChannels] = useState<{whatsapp: boolean; email: boolean}>({ whatsapp: true, email: false });
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/pricing/industry").then(r=>r.json()).catch(()=>({items:[]})),
      fetch("/api/pricing/area").then(r=>r.json()).catch(()=>({items:[]})),
    ]).then(([ind, area]) => {
      setIndustryPricing(ind.items ?? []);
      setAreaPricing(area.items ?? []);
    });
  }, []);

  const baseIndustryPrice = useMemo(() => {
    // If multiple industries, take average price (business rule; can be changed).
    const selected = industryPricing.filter(x => industries.includes(x.name));
    if (!selected.length) return 0;
    const sum = selected.reduce((a,b)=>a+b.price,0);
    return sum / selected.length;
  }, [industryPricing, industries]);

  const areaMultiplier = useMemo(() => {
    // Use average area multiplier for selected areas
    const selected = areaPricing.filter(x => areas.includes(x.name));
    if (!selected.length) return 1;
    const sum = selected.reduce((a,b)=>a+b.price,0);
    return sum / selected.length;
  }, [areaPricing, areas]);

  const channelAdd = useMemo(() => {
    // Business rule: WhatsApp +0.50 per lead, Email +0.30 per lead
    let add = 0;
    if (channels.whatsapp) add += 0.5;
    if (channels.email) add += 0.3;
    return add;
  }, [channels]);

  const total = useMemo(() => {
    const perLead = (baseIndustryPrice + channelAdd) * areaMultiplier;
    const gross = perLead * (leadQty || 0);
    const disc = gross * (discountPercent/100);
    return { perLead, gross, disc, net: gross - disc };
  }, [baseIndustryPrice, channelAdd, areaMultiplier, leadQty, discountPercent]);

  async function submit() {
    const payload = {
      companyName, industry, contactNumber, whatsapp, email, location: clientLocation,
      industries, areas, leadQty,
      channels: Object.entries(channels).filter(([,v])=>v).map(([k])=>k),
      discountPercent,
    };
    const res = await fetch("/api/clients/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Client created successfully.");
      window.location.href = "/clients";
    } else {
      const data = await res.json().catch(()=>({}));
      alert(data?.error ?? "Failed to create client");
    }
  }

  return (
    <AppShell title="Create Client">
      <Card>
        <CardHeader>
          <div className="text-jsBlack-900 font-semibold">Client Registration</div>
          <div className="text-gray-500 text-sm">Step {step} of 3</div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Company Name *</Label>
                <Input value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="Company Name" />
              </div>
              <div className="md:col-span-2">
                <Label>Industry *</Label>
                <Input value={industry} onChange={e=>setIndustry(e.target.value)} placeholder="Select Industry" />
              </div>
              <div>
                <Label>Contact Number *</Label>
                <Input value={contactNumber} onChange={e=>setContactNumber(e.target.value)} placeholder="+971..." />
              </div>
              <div>
                <Label>Email ID *</Label>
                <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@email.com" />
              </div>
              <div>
                <Label>WhatsApp *</Label>
                <Input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="+971..." />
              </div>
              <div>
                <Label>Your Location *</Label>
                <Input value={clientLocation} onChange={e=>setClientLocation(e.target.value)} placeholder="Dubai, UAE" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={() => setStep(2)}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Industries (Multi Select)</Label>
                  <div className="mt-2 space-y-2">
                    {industryPricing.map((it) => (
                      <label key={it.name} className="flex items-center gap-2 text-gray-700 text-sm">
                        <input
                          type="checkbox"
                          checked={industries.includes(it.name)}
                          onChange={(e) => {
                            setIndustries((prev) => e.target.checked ? [...prev, it.name] : prev.filter(x=>x!==it.name));
                          }}
                        />
                        <span className="flex-1">{it.name}</span>
                        <span className="text-gray-500">AED {it.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Select Areas (Multi Select)</Label>
                  <div className="mt-2 space-y-2">
                    {areaPricing.map((it) => (
                      <label key={it.name} className="flex items-center gap-2 text-gray-700 text-sm">
                        <input
                          type="checkbox"
                          checked={areas.includes(it.name)}
                          onChange={(e) => {
                            setAreas((prev) => e.target.checked ? [...prev, it.name] : prev.filter(x=>x!==it.name));
                          }}
                        />
                        <span className="flex-1">{it.name}</span>
                        <span className="text-gray-500">x {it.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Number of Leads *</Label>
                  <Input type="number" value={leadQty} onChange={(e)=>setLeadQty(parseInt(e.target.value||"0",10))} />
                </div>

                <div>
                  <Label>Marketing Channel</Label>
                  <div className="mt-2 space-y-2 text-gray-700 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={channels.whatsapp} onChange={(e)=>setChannels(p=>({...p, whatsapp:e.target.checked}))} />
                      WhatsApp (+0.50/lead)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={channels.email} onChange={(e)=>setChannels(p=>({...p, email:e.target.checked}))} />
                      Email (+0.30/lead)
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Discount Available (%)</Label>
                  <Input type="number" value={discountPercent} onChange={(e)=>setDiscountPercent(parseFloat(e.target.value||"0"))} />
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700 text-sm">
                <div className="flex justify-between"><span>Price / Lead</span><b className="text-jsBlack-900">AED {total.perLead.toFixed(2)}</b></div>
                <div className="flex justify-between"><span>Total Price</span><b className="text-jsBlack-900">AED {total.gross.toFixed(2)}</b></div>
                <div className="flex justify-between"><span>Discount</span><b className="text-jsBlack-900">- AED {total.disc.toFixed(2)}</b></div>
                <div className="flex justify-between border-t border-gray-200 mt-2 pt-2"><span>Final Price</span><b className="text-jsBlack-900">AED {total.net.toFixed(2)}</b></div>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-gray-700 text-sm">
              <div className="text-jsBlack-900 font-semibold">Review & Confirm</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="text-gray-500">Client</div>
                  <div className="text-jsBlack-900">{companyName}</div>
                  <div>{email}</div>
                  <div>{whatsapp}</div>
                  <div>{clientLocation}</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="text-gray-500">Package</div>
                  <div>Industries: <b className="text-jsBlack-900">{industries.join(", ") || "-"}</b></div>
                  <div>Areas: <b className="text-jsBlack-900">{areas.join(", ") || "-"}</b></div>
                  <div>Leads: <b className="text-jsBlack-900">{leadQty}</b></div>
                  <div>Channels: <b className="text-jsBlack-900">{Object.entries(channels).filter(([,v])=>v).map(([k])=>k).join(", ")}</b></div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex justify-between"><span>Total</span><b className="text-jsBlack-900">AED {total.gross.toFixed(2)}</b></div>
                <div className="flex justify-between"><span>Discount</span><b className="text-jsBlack-900">- AED {total.disc.toFixed(2)}</b></div>
                <div className="flex justify-between border-t border-gray-200 mt-2 pt-2"><span>Final Price</span><b className="text-jsBlack-900">AED {total.net.toFixed(2)}</b></div>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={submit}>Create Client</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
