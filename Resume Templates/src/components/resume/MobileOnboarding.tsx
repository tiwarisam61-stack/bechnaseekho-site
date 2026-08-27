import { useEffect, useState } from "react";
import { FileDown, Gauge, LayoutTemplate, PencilLine, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const KEY = "careersync.onboarded.v1";

const POINTS = [
  { icon: LayoutTemplate, text: "Pick a professional, ATS-ready template" },
  { icon: Upload, text: "Or import a resume you already have" },
  { icon: PencilLine, text: "Fill one simple step at a time" },
  { icon: Gauge, text: "See your ATS score improve live" },
  { icon: FileDown, text: "Download as PDF or Word in one tap" },
];

/** One-time welcome guide for first-time mobile visitors. */
export function MobileOnboarding({ onStart }: { onStart?: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(KEY)) setOpen(true);
  }, []);

  const dismiss = (start: boolean) => {
    window.localStorage.setItem(KEY, "1");
    setOpen(false);
    if (start) onStart?.();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && dismiss(false)}>
      <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome to CareerSync Resume Builder</DialogTitle>
          <DialogDescription>Here is everything you can do — it takes about 5 minutes.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-2.5">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 rounded-xl bg-muted/60 p-3 text-sm">
              <Icon className="mt-0.5 size-4 shrink-0 text-brass" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-2">
          <Button className="min-h-12 text-base" onClick={() => dismiss(true)}>
            Start building
          </Button>
          <Button variant="ghost" className="min-h-11" onClick={() => dismiss(false)}>
            Skip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
