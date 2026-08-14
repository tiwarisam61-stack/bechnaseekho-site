import { useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type MagneticButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  strength?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function MagneticButton<T extends ElementType = "button">({
  as,
  children,
  strength = 0.25,
  className,
  ...rest
}: MagneticButtonProps<T>) {
  const Tag = (as || "button") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 20, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Tag ref={ref as never} className={className} {...rest}>
        {children}
      </Tag>
    </motion.div>
  );
}
