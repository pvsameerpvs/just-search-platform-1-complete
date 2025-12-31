import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary"
          ? "bg-jsOrange-500 hover:bg-jsOrange-600 text-white shadow"
          : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
