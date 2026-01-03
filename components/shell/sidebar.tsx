"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/drafts", label: "Drafts" }, // Added Drafts
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-gray-100 bg-white h-screen sticky top-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-40">
      
      {/* Brand Header */}
      <div className="p-6 pb-8">
         <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-jsOrange-500 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-jsOrange-200 shadow-lg group-hover:scale-105 transition-transform">
               J
            </div>
            <div>
               <div className="font-bold text-gray-900 text-lg leading-tight tracking-tight">Just Search</div>
               <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</div>
            </div>
         </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {items.map((it) => {
           const isActive = pathname.startsWith(it.href);
           return (
             <Link
               key={it.href}
               href={it.href}
               className={cn(
                 "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                 isActive 
                   ? "bg-jsOrange-50 text-jsOrange-600 shadow-sm ring-1 ring-jsOrange-100 translate-x-1" 
                   : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
               )}
             >
               {/* Dot Indicator for Active State (Optional, mostly implied by color) */}
               {isActive && <div className="w-1.5 h-1.5 rounded-full bg-jsOrange-500 animate-pulse" />}
               <span>{it.label}</span>
             </Link>
           );
        })}
      </nav>

      {/* Footer / User Info could go here if not in Header */}
      <div className="p-4 border-t border-gray-50">
         <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-400 text-center">
            &copy; 2024 Just Search <br /> Platform v1.2
         </div>
      </div>
    </aside>
  );
}
