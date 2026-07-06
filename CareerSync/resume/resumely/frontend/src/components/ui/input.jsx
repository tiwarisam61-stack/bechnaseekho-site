import React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
    return (
        <input
            ref={ref}
            className={cn(
                "h-10 w-full border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-black focus:ring-2 focus:ring-black/10",
                className,
            )}
            {...props}
        />
    );
});