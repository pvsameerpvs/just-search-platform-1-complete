"use client";
import { Button } from "@/components/ui/button";

export function Topbar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div>
        <div className="text-jsBlack-900 text-lg font-semibold">{title}</div>
        <div className="text-gray-500 text-sm">Welcome back!</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-gray-600 text-sm">Admin</div>
        <Button variant="secondary" onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(()=>location.href="/")}>
          Logout
        </Button>
      </div>
    </div>
  );
}
