"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
      <div className="p-5 text-jsOrange-500">
        <div className="text-lg font-semibold">Just Search</div>
        <div className="text-xs text-gray-500">Admin & Sales</div>
      </div>
      <nav className="px-2 pb-4">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors",
              pathname === it.href && "bg-jsOrange-500 text-white shadow-md hover:bg-jsOrange-600 hover:text-white"
            )}
          >
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
