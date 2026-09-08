import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AiMenu } from "./AiMenu";

export function MobileField({
  label,
  value,
  onChange,
  placeholder,
  helper,
  multiline,
  rows = 4,
  type = "text",
  inputMode,
  autoComplete,
  required,
  aiContext,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helper?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  autoComplete?: string;
  required?: boolean;
  aiContext?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex min-h-9 items-center justify-between gap-2">
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        {aiContext && <AiMenu value={value} context={aiContext} onApply={onChange} />}
      </div>
      {multiline ? (
        <Textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => e.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" })}
          className="text-base"
        />
      ) : (
        <Input
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => e.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" })}
          className="min-h-12 text-base"
        />
      )}
      {helper && <p className="text-xs leading-relaxed text-muted-foreground">{helper}</p>}
    </div>
  );
}
