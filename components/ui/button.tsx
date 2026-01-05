import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "default", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-jsOrange-500/20 disabled:opacity-50 disabled:pointer-events-none",
        // Variants
        variant === "primary" && "bg-jsOrange-500 hover:bg-jsOrange-600 text-white shadow",
        variant === "secondary" && "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm",
        variant === "outline" && "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",
        variant === "ghost" && "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
        variant === "destructive" && "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        // Sizes
        size === "default" && "h-10 px-4 py-2 text-sm",
        size === "sm" && "h-9 rounded-md px-3 text-xs",
        size === "lg" && "h-11 rounded-md px-8 text-base",
        size === "icon" && "h-10 w-10",
        className
      )}
      {...props}
    />
  );
}
