import React from "react";
import { cn } from "@/lib/cn";

export const Textarea = React.forwardRef(function Textarea({ className = "", ...props }, ref) {
    return (
        <textarea
            ref={ref}
            className={cn(
                "min-h-[96px] w-full border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-black focus:ring-2 focus:ring-black/10",
                className,
            )}
            {...props}
        />
    );
});