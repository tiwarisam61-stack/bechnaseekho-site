import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { aiAssist } from "@/lib/ai.functions";

type Action =
  | "improve"
  | "rewrite"
  | "professional"
  | "shorter"
  | "longer"
  | "ats"
  | "grammar"
  | "bullets"
  | "achievements"
  | "summary"
  | "skills"
  | "projects";

const REFINE: [Action, string][] = [
  ["improve", "Improve"],
  ["rewrite", "Rewrite"],
  ["professional", "Professional tone"],
  ["shorter", "Make shorter"],
  ["longer", "Make longer"],
  ["ats", "ATS optimise"],
  ["grammar", "Fix grammar"],
];

const GENERATE: [Action, string][] = [
  ["bullets", "Generate bullet points"],
  ["achievements", "Generate achievements"],
  ["summary", "Generate summary"],
  ["skills", "Generate skills"],
  ["projects", "Generate projects"],
];

export function AiMenu({
  value,
  context,
  onApply,
  label = "AI",
}: {
  value: string;
  context: string;
  onApply: (text: string) => void;
  label?: string;
}) {
  const assist = useServerFn(aiAssist);
  const [busy, setBusy] = useState(false);

  const run = async (action: Action) => {
    setBusy(true);
    try {
      const res = await assist({ data: { action, text: value, context } });
      if (!res.text) throw new Error("AI returned nothing. Try again.");
      onApply(res.text);
      toast.success("AI updated this field");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs text-brass hover:bg-accent">
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs">Refine this text</DropdownMenuLabel>
        {REFINE.map(([a, l]) => (
          <DropdownMenuItem key={a} onSelect={() => void run(a)}>
            {l}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs">Generate</DropdownMenuLabel>
        {GENERATE.map(([a, l]) => (
          <DropdownMenuItem key={a} onSelect={() => void run(a)}>
            {l}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
