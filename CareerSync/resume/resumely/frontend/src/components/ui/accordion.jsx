import React, { createContext, useContext, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const AccordionContext = createContext(null);
const AccordionItemContext = createContext(null);

export function Accordion({ children, defaultValue = [], className = "", type = "multiple" }) {
    const initial = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    const [openValues, setOpenValues] = useState(initial);

    const value = useMemo(
        () => ({
            openValues,
            toggle: (itemValue) => {
                setOpenValues((current) => {
                    const isOpen = current.includes(itemValue);
                    if (type === "single") {
                        return isOpen ? [] : [itemValue];
                    }
                    return isOpen ? current.filter((entry) => entry !== itemValue) : [...current, itemValue];
                });
            },
        }),
        [openValues, type],
    );

    return (
        <AccordionContext.Provider value={value}>
            <div className={className}>{children}</div>
        </AccordionContext.Provider>
    );
}

export function AccordionItem({ children, value, className = "" }) {
    return (
        <AccordionItemContext.Provider value={value}>
            <div className={className}>{children}</div>
        </AccordionItemContext.Provider>
    );
}

export function AccordionTrigger({ children, className = "", ...props }) {
    const accordion = useContext(AccordionContext);
    const itemValue = useContext(AccordionItemContext);
    const isOpen = accordion?.openValues.includes(itemValue);

    return (
        <button
            type="button"
            className={cn("flex w-full items-center justify-between py-4 text-left", className)}
            onClick={() => accordion?.toggle(itemValue)}
            {...props}
        >
            {children}
            <ChevronDown size={16} className={cn("transition-transform", isOpen && "rotate-180")} />
        </button>
    );
}

export function AccordionContent({ children, className = "" }) {
    const accordion = useContext(AccordionContext);
    const itemValue = useContext(AccordionItemContext);
    const isOpen = accordion?.openValues.includes(itemValue);

    if (!isOpen) {
        return null;
    }

    return <div className={className}>{children}</div>;
}