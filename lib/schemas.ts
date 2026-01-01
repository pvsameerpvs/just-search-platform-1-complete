import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
});

export const ClientCreateSchema = z.object({
  companyName: z.string().min(2),
  industry: z.string().min(2),
  contactNumber: z.string().min(5),
  whatsapp: z.string().min(5),
  email: z.string().email(),
  location: z.string().min(2),
  contactPerson: z.string().min(2),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6),

  // pricing step
  industries: z.array(z.string()).default([]),
  areas: z.array(z.string()).default([]),
  leadQty: z.number().int().min(1).default(100),
  channels: z.array(z.enum(["whatsapp", "email"])).default(["whatsapp"]),
  discountPercent: z.number().min(0).max(100).default(0),
});
