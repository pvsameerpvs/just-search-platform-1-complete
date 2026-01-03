"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Topbar({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get initials
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "AU";

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4 shadow-sm sticky top-0 z-50">
      <div>
        <h1 className="text-jsBlack-900 text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your clients and operations efficiently.</p>
      </div>
      <div className="flex items-center gap-6">
        {/* User Profile Area */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 relative" ref={dropdownRef}>
           <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">{user?.name || "Admin User"}</span>
              <span className="text-xs text-gray-500">{user?.email || "admin@justsearch.ae"}</span>
           </div>
           
           {/* Avatar Trigger */}
           <button 
             onClick={() => setIsOpen(!isOpen)}
             className="h-10 w-10 full-rounded bg-jsOrange-50 border border-jsOrange-100 rounded-full flex items-center justify-center text-jsOrange-600 font-bold shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-jsOrange-200"
           >
              {initials}
           </button>

           {/* Dropdown Menu */}
           {isOpen && (
             <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-gray-50">
                   <p className="text-sm font-medium text-gray-900">My Account</p>
                </div>
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-jsOrange-600">
                   Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-jsOrange-600">
                   Settings
                </Link>
                <div className="border-t border-gray-50 mt-1 pt-1">
                   <button 
                      onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(()=>location.href="/")}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                   >
                      Logout
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
