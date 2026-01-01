"use client";

import { useState } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "security" | "system">("account");

  return (
    <AppShell title="Settings">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            <h3 className="font-bold text-lg px-4 mb-4 text-jsBlack-900">Preferences</h3>
            <button
               onClick={() => setActiveTab("account")}
               className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "account" ? "bg-jsOrange-50 text-jsOrange-700" : "text-gray-600 hover:bg-gray-100"
               }`}
            >
               Account Profile
            </button>
            <button
               onClick={() => setActiveTab("security")}
               className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "security" ? "bg-jsOrange-50 text-jsOrange-700" : "text-gray-600 hover:bg-gray-100"
               }`}
            >
               Security & Login
            </button>
            <button
               onClick={() => setActiveTab("system")}
               className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "system" ? "bg-jsOrange-50 text-jsOrange-700" : "text-gray-600 hover:bg-gray-100"
               }`}
            >
               System & Integrations
            </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
           {activeTab === "account" && (
              <Card>
                 <CardHeader className="border-b pb-4">
                    <h2 className="text-xl font-bold text-jsBlack-900">Account Profile</h2>
                    <p className="text-sm text-gray-500">Manage your personal information</p>
                 </CardHeader>
                 <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input defaultValue="Admin User" />
                       </div>
                       <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input defaultValue="System Administrator" />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                          <Label>Email Address</Label>
                          <Input defaultValue="admin@justsearch.ae" disabled className="bg-gray-50" />
                          <p className="text-xs text-gray-500">Contact IT support to change email.</p>
                       </div>
                    </div>
                    <div className="flex justify-end pt-4">
                       <Button onClick={() => toast.success("Profile updated successfully")}>Save Changes</Button>
                    </div>
                 </CardContent>
              </Card>
           )}

           {activeTab === "security" && (
              <Card>
                 <CardHeader className="border-b pb-4">
                    <h2 className="text-xl font-bold text-jsBlack-900">Security</h2>
                    <p className="text-sm text-gray-500">Update your password and security settings</p>
                 </CardHeader>
                 <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4 max-w-md">
                       <div className="space-y-2">
                          <Label>Current Password</Label>
                          <Input type="password" placeholder="••••••••" />
                       </div>
                       <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type="password" placeholder="••••••••" />
                       </div>
                       <div className="space-y-2">
                          <Label>Confirm New Password</Label>
                          <Input type="password" placeholder="••••••••" />
                       </div>
                    </div>
                    <div className="flex justify-start pt-4">
                       <Button variant="secondary" onClick={() => toast.success("Password update link sent")}>Update Password</Button>
                    </div>
                 </CardContent>
              </Card>
           )}

           {activeTab === "system" && (
              <Card>
                 <CardHeader className="border-b pb-4">
                    <h2 className="text-xl font-bold text-jsBlack-900">System & Integrations</h2>
                    <p className="text-sm text-gray-500">Connection status for external services</p>
                 </CardHeader>
                 <CardContent className="space-y-6 pt-6">
                    
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-4">
                       <div className="p-2 bg-white rounded shadow-sm text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                       </div>
                       <div>
                          <h4 className="font-bold text-green-900">Google Sheets Connected</h4>
                          <p className="text-sm text-green-700 mt-1">Database is synchronized with the master sheet.</p>
                          <p className="text-xs text-green-600 mt-2 font-mono">Last sync: Just now</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-base">System Preferences</Label>
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                           <span className="text-sm font-medium">Dark Mode (Beta)</span>
                           <div className="h-6 w-10 bg-gray-200 rounded-full relative cursor-not-allowed">
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                           </div>
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                           <span className="text-sm font-medium">Email Notifications</span>
                           <div className="h-6 w-10 bg-jsOrange-500 rounded-full relative cursor-pointer">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                           </div>
                        </div>
                    </div>

                 </CardContent>
              </Card>
           )}
        </div>

      </div>
    </AppShell>
  );
}
