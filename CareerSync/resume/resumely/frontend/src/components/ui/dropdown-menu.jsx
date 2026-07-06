import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const DropdownContext = createContext(null);

export function DropdownMenu({ children }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleClick = (event) => {
            const target = event.target;
            if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) {
                return;
            }
            setOpen(false);
        };

        window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [open]);

    const value = useMemo(
        () => ({ open, setOpen, triggerRef, contentRef }),
        [open],
    );

    return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
}

export function DropdownMenuTrigger({ children, asChild = false }) {
    const { open, setOpen, triggerRef } = useContext(DropdownContext);

    const triggerProps = {
        ref: triggerRef,
        onClick: () => setOpen(!open),
    };

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, triggerProps);
    }

    return <button type="button" {...triggerProps}>{children}</button>;
}

export function DropdownMenuContent({ children, className = "" }) {
    const { open, triggerRef, contentRef } = useContext(DropdownContext);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!open || !triggerRef.current) {
            return;
        }
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    }, [open, triggerRef]);

    if (!open) {
        return null;
    }

    return createPortal(
        <div
            ref={contentRef}
            className={cn("z-[70] min-w-[12rem] border border-zinc-200 bg-white p-1 shadow-lg", className)}
            style={{ position: "absolute", top: position.top, left: position.left }}
        >
            {children}
        </div>,
        document.body,
    );
}

export function DropdownMenuLabel({ children, className = "" }) {
    return <div className={cn("px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500", className)}>{children}</div>;
}

export function DropdownMenuSeparator() {
    return <div className="my-1 h-px bg-zinc-200" />;
}

export function DropdownMenuItem({ children, className = "", onClick, ...props }) {
    const { setOpen } = useContext(DropdownContext);

    return (
        <button
            type="button"
            className={cn("flex w-full items-center rounded-sm px-2 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100", className)}
            onClick={() => {
                onClick?.();
                setOpen(false);
            }}
            {...props}
        >
            {children}
        </button>
    );
}