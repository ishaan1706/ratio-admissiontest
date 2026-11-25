import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

/**
 * Handcrafted motion primitives (Motion Primitives + React Bits inspired)
 * sharing one consistent spring/ease curve across the whole app:
 * - TextScramble: crisp character-resolve reveal for technical/legal specimen labels
 * - RevealLine: masked baseline slide-up for display headlines (no blurry fadey slop)
 * - SlidingMarquee: dual opposing infinite horizontal band (recall-politics inspired)
 * - CountUp: viewport-triggered tabular counter
 * - GridCrosshairs: subtle architectural drafting corner marks
 */

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—';

export const TextScramble: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 18;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = frame / totalFrames;
      const lockedCount = Math.floor(progress * text.length);
      const next = text
        .split('')
        .map((ch, idx) => {
          if (ch === ' ') return ' ';
          if (idx < lockedCount) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');
      setDisplay(next);
      if (frame >= totalFrames) {
        setDisplay(text);
        window.clearInterval(id);
      }
    }, 28);
    return () => window.clearInterval(id);
  }, [text]);

  return <span className={className}>{display}</span>;
};

export const RevealLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: '105%', opacity: 0 }}
      animate={{ y: '0%', opacity: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

interface SlidingMarqueeProps {
  items: { label: string; tag?: string }[];
  reverse?: boolean;
}

export const SlidingMarquee: React.FC<SlidingMarqueeProps> = ({ items, reverse = false }) => {
  const doubled = [...items, ...items];
  return (
    <div className="rb-marquee-mask py-1">
      <div className={`rb-marquee-track ${reverse ? 'reverse' : ''}`}>
        {doubled.map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            aria-hidden={idx >= items.length}
            className="whitespace-nowrap inline-flex items-center gap-2.5 px-4 py-2 border border-white/10 bg-[#0B0F17] text-sm text-slate-200"
          >
            <span className="font-medium tracking-tight">{item.label}</span>
            {item.tag && (
              <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-slate-500 border-l border-white/10 pl-2.5">
                {item.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface CountUpProps {
  to: number;
  suffix?: string;
  durationMs?: number;
}

export const CountUp: React.FC<CountUpProps> = ({ to, suffix = '', durationMs = 750 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / durationMs);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, durationMs]);

  return (
    <span ref={ref} className="font-mono-tabular">
      {val}
      {suffix}
    </span>
  );
};

export const GridCrosshair: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br' }> = ({ position }) => {
  const posClass =
    position === 'tl'
      ? '-top-[5px] -left-[5px]'
      : position === 'tr'
      ? '-top-[5px] -right-[5px]'
      : position === 'bl'
      ? '-bottom-[5px] -left-[5px]'
      : '-bottom-[5px] -right-[5px]';
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute ${posClass} w-[9px] h-[9px] text-white/30 flex items-center justify-center font-mono text-[10px] leading-none select-none`}
    >
      +
    </span>
  );
};
