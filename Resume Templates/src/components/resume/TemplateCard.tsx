import { Heart, Maximize2, Sparkles, ShieldCheck, Crown, Zap, ThumbsUp, ImageIcon, User, FileText } from "lucide-react";
import { memo } from "react";
import { ResumeDocument } from "./ResumeDocument";
import type { ResumeTemplate } from "@/lib/templates";
import type { ResumeDoc } from "@/lib/resume-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  template: ResumeTemplate;
  sample: ResumeDoc;
  favorite: boolean;
  onToggleFavorite: () => void;
  onPreview: () => void;
  onUse: () => void;
}

export const TemplateCard = memo(function TemplateCard({
  template,
  sample,
  favorite,
  onToggleFavorite,
  onPreview,
  onUse,
}: Props) {
  return (
    <article className="group relative flex cursor-pointer flex-col rounded-3xl border border-border/70 bg-card p-3 shadow-soft transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform lg:hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_22px_48px_-16px_hsl(var(--primary)/0.35)]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted/60">
        <div className="pointer-events-none absolute left-1/2 top-4 origin-top -translate-x-1/2">
          <div style={{ transform: "scale(0.3)", transformOrigin: "top center" }}>
            <ResumeDocument doc={sample} watermark={false} />
          </div>
        </div>

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-1.5">
            {template.premium && (
              <Badge className="border-0 bg-foreground text-[10px] font-semibold tracking-wide text-background">
                <Crown className="mr-1 size-3" /> Premium
              </Badge>
            )}
            {template.modern && (
              <Badge variant="secondary" className="text-[10px] font-semibold tracking-wide">
                <Zap className="mr-1 size-3" /> Modern
              </Badge>
            )}
            {template.recruiterFavorite && (
              <Badge className="border-0 bg-primary text-[10px] font-semibold tracking-wide text-primary-foreground">
                <ThumbsUp className="mr-1 size-3" /> Recruiter favourite
              </Badge>
            )}
            {template.popular && !template.premium && (
              <Badge className="brass-surface border-0 text-[10px] font-semibold tracking-wide">Popular</Badge>
            )}
            {template.isNew && (
              <Badge variant="outline" className="bg-card/80 text-[10px] font-semibold tracking-wide">
                New
              </Badge>
            )}
          </div>
          <button
            type="button"
            aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
            onClick={onToggleFavorite}
            className="grid size-10 shrink-0 place-items-center rounded-full glass text-foreground transition hover:scale-110"
          >
            <Heart className={cn("size-4", favorite && "fill-destructive text-destructive")} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 hidden items-center gap-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex lg:translate-y-3">
          <Button size="sm" variant="secondary" className="flex-1 glass" onClick={onPreview}>
            <Maximize2 className="size-3.5" /> Preview
          </Button>
          <Button size="sm" className="flex-1" onClick={onUse}>
            Use template
          </Button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
        <Button size="sm" variant="outline" className="min-h-11" onClick={onPreview}>
          <Maximize2 className="size-3.5" /> Preview
        </Button>
        <Button size="sm" className="min-h-11" onClick={onUse}>
          Use template
        </Button>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-1.5 pb-1 pt-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg leading-tight">{template.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{template.blurb}</p>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {template.category}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 px-1.5 pt-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 font-medium text-success">
          <ShieldCheck className="size-3" /> ATS {template.atsScore}%
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">
          <Sparkles className="size-3" /> Readability {template.readability}%
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium">
          <FileText className="size-3" /> One page
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium">
          <User className="size-3" /> {template.experienceLevel}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium">
          <ImageIcon className="size-3" /> {template.withPhoto ? "With photo" : "No photo"}
        </span>
      </div>

      <p className="mt-auto truncate px-1.5 pb-1.5 pt-2 text-[11px] text-muted-foreground">
        Best for: {template.roles.join(" · ")}
      </p>
    </article>
  );
});
