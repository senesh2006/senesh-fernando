import { useEffect, useRef } from "react";

// Subtle spotlight that follows the cursor inside its parent (the element
// passed via the `target` ref). Disabled on touch / reduced-motion.
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const parent = ref.current?.parentElement;
    if (!parent) return;
    parent.style.position = parent.style.position || "relative";
    parent.style.overflow = "hidden";
    let raf = 0;
    let tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.opacity = "1";
          ref.current.style.background = `radial-gradient(360px circle at ${tx}px ${ty}px, color-mix(in oklab, var(--color-foreground) 8%, transparent), transparent 60%)`;
        }
        raf = 0;
      });
    };
    const onLeave = () => { if (ref.current) ref.current.style.opacity = "0"; };
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" />;
}