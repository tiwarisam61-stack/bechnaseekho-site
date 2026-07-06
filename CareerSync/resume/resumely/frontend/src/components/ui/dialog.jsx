import React, { createContext, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const DialogContext = createContext(null);

export function Dialog({ open, onOpenChange, children }) {
    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                onOpenChange?.(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onOpenChange]);

    return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogContent({ children, className = "" }) {
    const ctx = useContext(DialogContext);

    if (!ctx?.open) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" onMouseDown={() => ctx.onOpenChange?.(false)}>
            <div
                className={cn("w-full bg-white shadow-2xl", className)}
                onMouseDown={(event) => event.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}

export function DialogHeader({ children, className = "" }) {
    return <div className={cn("space-y-1.5", className)}>{children}</div>;
}

export function DialogTitle({ children, className = "", ...props }) {
    return <h2 className={cn("text-xl font-semibold text-zinc-900", className)} {...props}>{children}</h2>;
}