import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function useInView<T extends Element>(threshold = 0.2, once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return { ref, inView };
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const style: CSSProperties = { transitionDelay: `${delay}ms` };
  return (
    <div ref={ref} data-visible={inView} style={style} className={cn("reveal", className)}>
      {children}
    </div>
  );
}
