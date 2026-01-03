"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

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
      <div className="max-w-4xl mx-auto">
         <Card>
            <CardHeader className="border-b pb-4">
               <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-jsOrange-50 border border-jsOrange-100 rounded-full flex items-center justify-center text-jsOrange-600 text-xl font-bold">
                     {user?.name ? user.name.substring(0,2).toUpperCase() : "AU"}
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-jsBlack-900">{user?.name || "Loading..."}</h2>
                     <p className="text-sm text-gray-500">{user?.email || "..."}</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label>Full Name</Label>
                     <Input defaultValue={user?.name || ""} key={user?.name} />
                  </div>
                  <div className="space-y-2">
                     <Label>Role</Label>
                     <Input value={user?.role || ""} disabled className="capitalize bg-gray-50" key={user?.role} />
                  </div>
                  <div className="space-y-2">
                     <Label>Job Title</Label>
                     <Input defaultValue="System Administrator" />
                  </div>
                  <div className="space-y-2">
                     <Label>Phone Number</Label>
                     <Input defaultValue="+971 50 000 0000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                     <Label>Email Address</Label>
                     <Input value={user?.email || ""} disabled className="bg-gray-50" key={user?.email} />
                     <p className="text-xs text-gray-500">Contact IT support to change email.</p>
                  </div>
               </div>
               <div className="flex justify-end pt-4">
                  <Button onClick={() => toast.success("Profile updated successfully")}>Save Changes</Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </AppShell>
  );
}
