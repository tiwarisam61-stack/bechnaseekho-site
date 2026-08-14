import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STEPS = ["Generating resume…", "Checking layout…", "Preparing file…", "Download ready"];

/** Reassuring staged feedback while an export is being produced. */
export function DownloadProgressDialog({
  open,
  format,
  onDone,
}: {
  open: boolean;
  format: "PDF" | "Word";
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    const timers = [
      window.setTimeout(() => setStep(1), 500),
      window.setTimeout(() => setStep(2), 1000),
      window.setTimeout(() => setStep(3), 1500),
      window.setTimeout(() => onDone(), 2000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [open, onDone]);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[88vw] rounded-2xl sm:max-w-sm [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Creating your {format}</DialogTitle>
          <DialogDescription>This only takes a moment — please stay on this screen.</DialogDescription>
        </DialogHeader>
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
        <ul className="space-y-2">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 text-sm",
                i < step ? "text-success" : i === step ? "font-medium" : "text-muted-foreground",
              )}
            >
              {i < step ? (
                <Check className="size-4" />
              ) : i === step ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span className="size-4" />
              )}
              {label}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
