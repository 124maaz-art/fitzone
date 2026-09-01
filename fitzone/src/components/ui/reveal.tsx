"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealEffect = "rise" | "zoom" | "fade" | "left" | "blur";

const variants: Record<RevealEffect, { hidden: any; show: any }> = {
  rise: { hidden: { opacity: 1, y: 24 }, show: { opacity: 1, y: 0 } },
  zoom: { hidden: { opacity: 1, scale: 0.97 }, show: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 1 }, show: { opacity: 1 } },
  left: { hidden: { opacity: 1, x: -20 }, show: { opacity: 1, x: 0 } },
  blur: {
    hidden: { opacity: 1, y: 12 },
    show: { opacity: 1, y: 0 },
  },
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
  effect = "rise",
  duration = 0.6,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  effect?: RevealEffect;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const v = variants[effect];

  return (
    <motion.div
      ref={ref}
      initial={effect === "rise" ? { ...v.hidden, y } : v.hidden}
      animate={inView ? v.show : {}}
      transition={{ duration, delay, ease }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function Counter({
  value,
  suffix = "",
  duration = 1.5,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf: number;
    const step = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / (duration * 1000), 1);
      setDisplay(Math.floor((1 - Math.pow(1 - progress, 3)) * value));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
