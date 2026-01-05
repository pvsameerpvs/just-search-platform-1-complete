"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// Removed missing Shadcn UI imports: Table, Dialog, Badge
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Edit, KeyRound, X, Loader2 } from "lucide-react";

type User = {
  staff_id: string;
  name: string;
  email: string;
  username: string;
  role: "admin" | "sales";
  contactNumber: string;
};

export default function PlatformUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Stores ID of item being acted on or "edit" / "reset"
  const [editUser, setEditUser] = useState<User | null>(null);
  /* State for Password Reset */
  const [passwordResetUser, setPasswordResetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/platform-users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    setActionLoading(staffId);
    try {
      const res = await fetch(`/api/platform-users?id=${staffId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted successfully");
        await fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      toast.error("Error deleting user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setActionLoading("edit");
    try {
      const res = await fetch("/api/platform-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });
      if (res.ok) {
        toast.success("User updated successfully");
        setEditUser(null);
        await fetchUsers();
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      toast.error("Error updating user");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetUser || !newPassword) return;

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setActionLoading("reset");
    try {
      const res = await fetch("/api/platform-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staff_id: passwordResetUser.staff_id, password: newPassword }),
      });
      if (res.ok) {
        toast.success("Password reset successfully");
        setPasswordResetUser(null);
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error("Failed to reset password");
      }
    } catch (err) {
      toast.error("Error resetting password");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AppShell title="Platform Users">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
             <div className="space-y-1">
                <h3 className="font-bold text-lg">Staff List</h3>
                <p className="text-sm text-gray-500">Manage all admin and sales accounts.</p>
             </div>
             <Button onClick={fetchUsers} variant="outline" size="sm" disabled={loading}>
               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Refresh
             </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3">Start Date</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Email / Username</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.staff_id} className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                           {/* Extract timestamp from ID roughly */}
                           {new Date(parseInt(u.staff_id.split("-")[1])).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === "admin" ? "bg-black text-white" : "bg-gray-100 text-gray-800"
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                           <div className="text-sm text-gray-900">{u.email}</div>
                           <div className="text-xs text-gray-500">@{u.username}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{u.contactNumber || "-"}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                             <Button size="icon" variant="ghost" title="Edit User" onClick={() => setEditUser(u)}>
                                <Edit className="h-4 w-4 text-blue-500" />
                             </Button>
                             <Button size="icon" variant="ghost" title="Reset Password" onClick={() => setPasswordResetUser(u)}>
                                <KeyRound className="h-4 w-4 text-orange-500" />
                             </Button>
                             <Button 
                               size="icon" 
                               variant="ghost" 
                               title="Delete User" 
                               onClick={() => handleDelete(u.staff_id)}
                               disabled={actionLoading === u.staff_id}
                             >
                                {actionLoading === u.staff_id ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                ) : (
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                )}
                             </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Modal for Edit User */}
        {editUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                   <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-bold text-lg">Edit User: {editUser.name}</h3>
                      <button onClick={() => setEditUser(null)} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                      </button>
                   </div>
                   <div className="p-4">
                       <form onSubmit={handleUpdate} className="space-y-4">
                          <div className="space-y-2">
                             <Label>Full Name</Label>
                             <Input value={editUser.name} onChange={(e) => setEditUser({...editUser, name: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={editUser.email} onChange={(e) => setEditUser({...editUser, email: e.target.value})} />
                             </div>
                             <div className="space-y-2">
                                <Label>Username</Label>
                                <Input value={editUser.username} onChange={(e) => setEditUser({...editUser, username: e.target.value})} />
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                 <Label>Contact Number</Label>
                                 <Input value={editUser.contactNumber || ""} onChange={(e) => setEditUser({...editUser, contactNumber: e.target.value})} />
                             </div>
                             <div className="space-y-2">
                                <Label>Role</Label>
                                 <div className="relative">
                                   <select
                                     value={editUser.role}
                                     onChange={(e) => setEditUser({...editUser, role: e.target.value as "admin" | "sales"})}
                                     className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                   >
                                     <option value="sales">Sales Person</option>
                                     <option value="admin">Admin</option>
                                   </select>
                                 </div>
                             </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                              <Button type="button" variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
                              <Button type="submit" disabled={actionLoading === "edit"}>
                                {actionLoading === "edit" ? "Saving..." : "Save Changes"}
                              </Button>
                          </div>
                       </form>
                   </div>
                </div>
            </div>
        )}

        {/* Custom Modal for Reset Password */}
        {passwordResetUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                   <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-bold text-lg">Reset Password for {passwordResetUser.name}</h3>
                      <button onClick={() => setPasswordResetUser(null)} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                      </button>
                   </div>
                   <div className="p-4">
                       <form onSubmit={handlePasswordReset} className="space-y-4">
                           <p className="text-sm text-gray-500">
                             Enter a new password for this user. They will need to use this new password to log in.
                           </p>
                           <div className="space-y-2">
                              <Label>New Password</Label>
                              <Input 
                                type="text"
                                placeholder="Enter new password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={6}
                                required
                              />
                           </div>
                           <div className="space-y-2">
                              <Label>Confirm Password</Label>
                              <Input 
                                type="text"
                                placeholder="Confirm new password" 
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                minLength={6}
                                required
                              />
                           </div>
                           <div className="flex justify-end gap-2 pt-4">
                              <Button type="button" variant="ghost" onClick={() => setPasswordResetUser(null)}>Cancel</Button>
                              <Button type="submit" variant="destructive" disabled={actionLoading === "reset"}>
                                {actionLoading === "reset" ? "Resetting..." : "Reset Password"}
                              </Button>
                           </div>
                       </form>
                   </div>
                </div>
            </div>
        )}

      </div>
    </AppShell>
  );
}
