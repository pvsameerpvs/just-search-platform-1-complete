import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-jsBlack-900 placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-jsOrange-500/20 focus:border-jsOrange-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
