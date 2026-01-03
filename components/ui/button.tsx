import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary"
          ? "bg-jsOrange-500 hover:bg-jsOrange-600 text-white shadow"
          : variant === "secondary"
          ? "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
          : "bg-transparent hover:bg-gray-100 text-gray-700", // ghost variant
        className
      )}
      {...props}
    />
  );
}
