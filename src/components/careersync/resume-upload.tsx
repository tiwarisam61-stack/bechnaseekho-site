import { useRef, useState } from "react";
import { FileText, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { uploadCareerSyncResume } from "@/services/careersync/careersync-service";
import { uploadSharedCareerSyncResume } from "@/lib/careersync-jobs-api";

interface Props {
  userId: string;
  value: { path: string; url: string; name: string } | null;
  onChange: (v: { path: string; url: string; name: string } | null) => void;
}

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function ResumeUpload({ userId, value, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!ALLOWED.includes(file.type) && !/\.(pdf|docx?)$/i.test(file.name)) {
      toast.error("Only PDF or Word (.doc, .docx) files are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Resume must be under 5 MB.");
      return;
    }
    setBusy(true);
    try {
      let uploaded: { path: string; url: string; name: string };
      try {
        uploaded = await uploadSharedCareerSyncResume({ userId, file });
      } catch (error) {
        console.warn("[CareerSync] Shared resume upload failed, using local fallback", error);
        uploaded = await uploadCareerSyncResume({ userId, file });
      }
      onChange(uploaded);
      setJustUploaded(true);
      window.setTimeout(() => setJustUploaded(false), 1800);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed. Please try again.";
      toast.error(message);
      setBusy(false);
      return;
    }
    setBusy(false);
  }

  return (
    <div>
      {!value ? (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) void handleFile(f);
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 transition ${drag
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
            }`}
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-blue-600 ring-1 ring-blue-100">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900">
              {busy ? "Uploading…" : "Upload resume"}
            </div>
            <div className="text-[11px] text-slate-500">
              PDF or Word · Max 5 MB · Drag & drop or click
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
        </label>
      ) : (
        <div className="relative flex items-center gap-3 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-3 overflow-hidden">
          {justUploaded && (
            <>
              <span className="pointer-events-none absolute -left-2 top-1 h-5 w-5 rounded-full bg-emerald-300/50 animate-ping" />
              <span className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 rounded-full bg-cyan-300/50 animate-ping" style={{ animationDelay: "120ms" }} />
              <span className="pointer-events-none absolute right-10 bottom-2 h-4 w-4 rounded-full bg-blue-300/50 animate-ping" style={{ animationDelay: "220ms" }} />
            </>
          )}
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-200">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-900 truncate">
              <CheckCircle2 className="h-3.5 w-3.5" /> {value.name}
            </div>
            <a href={value.url} target="_blank" rel="noopener" className="text-[11px] text-emerald-700 hover:underline">
              Preview signed link
            </a>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
