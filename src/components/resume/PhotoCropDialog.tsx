import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCw, ZoomIn, ZoomOut, Loader2, ScanFace } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const BOX = 288;
const OUT = 512;

type Shape = "circle" | "square";

interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Uses the browser's native FaceDetector when available; otherwise returns null. */
async function detectFace(img: HTMLImageElement): Promise<FaceBox | null> {
  const Ctor = (window as unknown as { FaceDetector?: new (o?: unknown) => { detect(i: unknown): Promise<{ boundingBox: FaceBox }[]> } })
    .FaceDetector;
  if (!Ctor) return null;
  try {
    const detector = new Ctor({ fastMode: true, maxDetectedFaces: 1 });
    const faces = await detector.detect(img);
    const box = faces?.[0]?.boundingBox;
    return box ? { x: box.x, y: box.y, width: box.width, height: box.height } : null;
  } catch {
    return null;
  }
}

export function PhotoCropDialog({
  open,
  src,
  shape = "circle",
  onOpenChange,
  onApply,
}: {
  open: boolean;
  src: string | null;
  shape?: Shape;
  onOpenChange: (v: boolean) => void;
  onApply: (dataUrl: string) => void;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [autoDetected, setAutoDetected] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Load + auto-frame */
  useEffect(() => {
    if (!open || !src) return;
    setBusy(true);
    setAutoDetected(null);
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = async () => {
      const base = BOX / Math.min(image.width, image.height);
      const face = await detectFace(image);
      if (face) {
        // Frame the head with generous headroom so forehead/chin never clip.
        const target = face.height * 2.1;
        const scale = (BOX / target) / base;
        const cx = face.x + face.width / 2;
        const cy = face.y + face.height * 0.52;
        setZoom(Math.min(3, Math.max(1, scale)));
        setOffset({
          x: (image.width / 2 - cx) * base * Math.min(3, Math.max(1, scale)),
          y: (image.height / 2 - cy) * base * Math.min(3, Math.max(1, scale)),
        });
        setAutoDetected(true);
      } else {
        // Heuristic: portraits put the face in the upper third.
        setZoom(1.08);
        setOffset({ x: 0, y: image.height > image.width ? BOX * 0.12 : 0 });
        setAutoDetected(false);
      }
      setRotation(0);
      setImg(image);
      setBusy(false);
    };
    image.onerror = () => setBusy(false);
    image.src = src;
  }, [open, src]);

  /* Draw */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const base = BOX / Math.min(img.width, img.height);
    const w = img.width * base * zoom;
    const h = img.height * base * zoom;
    ctx.clearRect(0, 0, BOX, BOX);
    ctx.save();
    ctx.translate(BOX / 2 + offset.x, BOX / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }, [img, zoom, rotation, offset]);

  useEffect(() => {
    draw();
  }, [draw]);

  const apply = () => {
    if (!img) return;
    const out = document.createElement("canvas");
    out.width = OUT;
    out.height = OUT;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    const k = OUT / BOX;
    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    const base = (BOX / Math.min(img.width, img.height)) * k;
    const w = img.width * base * zoom;
    const h = img.height * base * zoom;
    ctx.save();
    ctx.translate(OUT / 2 + offset.x * k, OUT / 2 + offset.y * k);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
    onApply(out.toDataURL("image/png"));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Adjust your photo</DialogTitle>
          <DialogDescription>
            {autoDetected === true
              ? "Face detected and centred automatically — fine-tune below if you like."
              : "Auto-framed for a portrait. Drag to move, then zoom or rotate to taste."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "relative grid place-items-center overflow-hidden border bg-muted",
              shape === "circle" ? "rounded-full" : "rounded-2xl",
            )}
            style={{ width: BOX, height: BOX }}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              setOffset({
                x: drag.current.ox + (e.clientX - drag.current.x),
                y: drag.current.oy + (e.clientY - drag.current.y),
              });
            }}
            onPointerUp={() => (drag.current = null)}
          >
            {busy && <Loader2 className="absolute size-6 animate-spin text-muted-foreground" />}
            <canvas ref={canvasRef} width={BOX} height={BOX} className="cursor-grab touch-none active:cursor-grabbing" />
          </div>

          <div className="w-full space-y-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                <ZoomOut className="size-3.5" /> Zoom <ZoomIn className="ml-auto size-3.5" />
              </Label>
              <Slider min={1} max={3} step={0.01} value={[zoom]} onValueChange={([v]) => setZoom(v)} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setRotation((r) => (r + 90) % 360)}>
                <RotateCw className="size-3.5" /> Rotate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                  setOffset({ x: 0, y: 0 });
                }}
              >
                <ScanFace className="size-3.5" /> Re-crop
              </Button>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={apply} disabled={!img}>
                  Use photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
