import { CheckCircle2, Download, FileText, Home, PartyPopper } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DownloadSuccessDialog({
  open,
  onOpenChange,
  fileName,
  format,
  onDownloadAgain,
  onGoHome,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fileName: string;
  format: "PDF" | "Word";
  onDownloadAgain: () => void;
  onGoHome: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden text-center sm:rounded-3xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 mx-auto size-56 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-4 py-2">
          <span className="relative grid size-16 animate-scale-in place-items-center rounded-full bg-success/12 text-success">
            <span className="absolute inset-0 animate-ping rounded-full bg-success/20" />
            <CheckCircle2 className="relative size-9" />
          </span>

          <div className="space-y-1.5">
            <DialogTitle className="text-2xl">
              <PartyPopper className="mr-1 inline size-5 text-primary" /> Resume downloaded
            </DialogTitle>
            <DialogDescription>
              Your ATS-optimised {format} is ready. Good luck with the application!
            </DialogDescription>
          </div>

          <div className="flex w-full items-center gap-2 rounded-2xl border bg-muted/40 px-3 py-2.5 text-left">
            <FileText className="size-4 shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{fileName}</span>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2">
            <Button variant="outline" onClick={onDownloadAgain}>
              <Download className="size-4" /> Download again
            </Button>
            <Button onClick={onGoHome}>
              <Home className="size-4" /> Browse templates
            </Button>
          </div>
          <button
            type="button"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => onOpenChange(false)}
          >
            Keep editing
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
