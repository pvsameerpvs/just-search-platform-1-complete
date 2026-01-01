"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data?.error ?? "Login failed";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("Login successful");
    const data = await res.json();
    if (data.role === "admin") location.href = "/dashboard?role=admin";
    else location.href = "/dashboard?role=sales";
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="text-jsBlack-900 text-2xl font-semibold">Just Search Sales Module</div>
          <div className="text-gray-500 text-sm">Lead Automation & Client CRM Platform</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Username or Email</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <Button disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-xs text-gray-400 text-center pt-2">
              © Just Search Workspace • Privacy Policy • Terms
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
