
import { readRange } from "@/lib/googleSheets";

export type Client = {
  client_id: string;
  companyName: string;
  industry: string;
  contactNumber: string;
  whatsapp: string;
  email: string;
  location: string;
  createdAt: string;
  industries: string;
  areas: string;
  leadQty: number;
  channels: string;
  discountPercent: number;
  perLeadPrice: number;
  totalPrice: number;
  status: string;
};

export async function getAllClients(): Promise<Client[]> {
  // Read Columns A to P (16 columns)
  const rows = await readRange("Clients!A2:P").catch(() => []);
  
  return rows.map((r) => ({
    client_id: (r?.[0] ?? "").toString(),
    companyName: (r?.[1] ?? "").toString(),
    industry: (r?.[2] ?? "").toString(),
    contactNumber: (r?.[3] ?? "").toString(),
    whatsapp: (r?.[4] ?? "").toString(),
    email: (r?.[5] ?? "").toString(),
    location: (r?.[6] ?? "").toString(),
    createdAt: (r?.[7] ?? "").toString(),
    
    // New fields
    industries: (r?.[8] ?? "").toString(),
    areas: (r?.[9] ?? "").toString(),
    leadQty: Number(r?.[10] ?? 0),
    channels: (r?.[11] ?? "").toString(),
    discountPercent: Number(r?.[12] ?? 0),
    perLeadPrice: Number(r?.[13] ?? 0),
    totalPrice: Number(r?.[14] ?? 0),
    status: (r?.[15] ?? "Active").toString(),
  })).filter(c => c.companyName);
}

export async function getClientById(id: string): Promise<Client | undefined> {
  const clients = await getAllClients();
  return clients.find((c) => c.client_id === id);
}
