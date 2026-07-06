import React from "react";
import { cn } from "@/lib/cn";

const variants = {
    default: "bg-black text-white hover:bg-zinc-800",
    outline: "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
};

const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10 p-0",
};

export const Button = React.forwardRef(function Button(
    { className = "", variant = "default", size = "default", type = "button", ...props },
    ref,
) {
    return (
        <button
            ref={ref}
            type={type}
            className={cn(
                "inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant] || variants.default,
                sizes[size] || sizes.default,
                className,
            )}
            {...props}
        />
    );
});