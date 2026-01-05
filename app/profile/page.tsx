"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffRegisterSchema } from "@/lib/schemas";
import { z } from "zod";

import { OverviewTab } from "@/components/profile/overview-tab";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "admin">("overview");

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  return (
    <AppShell title="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Helper Tabs */}
        <div className="flex border-b border-gray-200">
           <button
             onClick={() => setActiveTab("overview")}
             className={cn(
               "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
               activeTab === "overview" 
                 ? "border-jsBlack-900 text-jsBlack-900" 
                 : "border-transparent text-gray-500 hover:text-gray-700"
             )}
           >
             Overview
           </button>
           {user?.role === "admin" && (
             <button
               onClick={() => setActiveTab("admin")}
               className={cn(
                 "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                 activeTab === "admin" 
                   ? "border-jsBlack-900 text-jsBlack-900" 
                   : "border-transparent text-gray-500 hover:text-gray-700"
               )}
             >
               Staff Management
             </button>
           )}
        </div>

        {/* Tab Content: Overview */}
        {activeTab === "overview" && (
          <OverviewTab user={user} refreshUser={() => {
             // Re-fetch user
             fetch("/api/user/me")
              .then((res) => res.json())
              .then((data) => {
                if (data.user) setUser(data.user);
              })
              .catch((err) => console.error("Failed to fetch user:", err));
          }} />
        )}

        {/* Tab Content: Admin */}
        {activeTab === "admin" && user?.role === "admin" && (
            <Card>
              <CardHeader className="border-b pb-4">
                <h3 className="text-lg font-bold text-jsBlack-900">Create New Staff Account</h3>
                <p className="text-sm text-gray-500">Add a new Sales or Admin user to the Platform.</p>
              </CardHeader>
              <CardContent className="pt-6">
                <AdminRegisterForm />
              </CardContent>
            </Card>
        )}

      </div>
    </AppShell>
  );
}

function AdminRegisterForm() {
  const [loading, setLoading] = useState(false);
  
  type FormData = z.infer<typeof StaffRegisterSchema>;
  
  const form = useForm<FormData>({
    resolver: zodResolver(StaffRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "sales",
      contactNumber: "",
    },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        toast.error(result.error || "Failed to create account");
        return;
      }

      toast.success("New staff account created successfully!");
      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
         <Label>Full Name</Label>
         <Input {...form.register("name")} placeholder="Staff Name" />
         {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label>Email</Label>
            <Input {...form.register("email")} placeholder="staff@example.com" />
            {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
         </div>
         <div className="space-y-2">
            <Label>Username</Label>
            <Input {...form.register("username")} placeholder="username" />
            {form.formState.errors.username && <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>}
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
           <Label>Password</Label>
           <Input type="password" {...form.register("password")} placeholder="••••••••" />
           {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
        </div>
        <div className="space-y-2">
           <Label>Confirm Password</Label>
           <Input type="password" {...form.register("confirmPassword")} placeholder="••••••••" />
           {form.formState.errors.confirmPassword && <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
         <Label>Contact Number</Label>
         <Input {...form.register("contactNumber")} placeholder="+971 50 000 0000" />
         {form.formState.errors.contactNumber && <p className="text-sm text-red-500">{form.formState.errors.contactNumber.message}</p>}
      </div>
      <div className="space-y-2">
         <Label>Role</Label>
         <div className="relative">
           <select
             {...form.register("role")}
             className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
           >
             <option value="sales">Sales Person</option>
             <option value="admin">Admin</option>
           </select>
         </div>
         {form.formState.errors.role && <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>}
      </div>
      <Button disabled={loading} type="submit">{loading ? "Creating..." : "Create Account"}</Button>
    </form>
  );
}
