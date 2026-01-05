"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function OverviewTab({ user, refreshUser }: { user: any; refreshUser: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    contactNumber: user?.contactNumber || "",
  });
  const [loading, setLoading] = useState(false);

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        contactNumber: user.contactNumber || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        refreshUser();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-jsOrange-50 border border-jsOrange-100 rounded-full flex items-center justify-center text-jsOrange-600 text-xl font-bold">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "AU"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-jsBlack-900">{user?.name || "Loading..."}</h2>
            <p className="text-sm text-gray-500">{user?.email || "..."}</p>
          </div>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
             <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={loading}>Cancel</Button>
             <Button size="sm" onClick={handleSave} disabled={loading}>
               {loading ? "Saving..." : "Save Changes"}
             </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input 
              value={isEditing ? formData.name : (user?.name || "")} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              readOnly={!isEditing} 
              className={!isEditing ? "bg-gray-50/50" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              value={user?.role?.toUpperCase() || ""}
              disabled
              className="bg-gray-50 font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Number</Label>
            <Input 
              value={isEditing ? formData.contactNumber : (user?.contactNumber || "-")} 
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              placeholder="+971 50 000 0000"
              readOnly={!isEditing}
              className={!isEditing ? "bg-gray-50/50" : ""}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Email Address</Label>
            <Input
              value={user?.email || ""}
              disabled
              className="bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400">
              Email and Role are managed by the administrator.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
