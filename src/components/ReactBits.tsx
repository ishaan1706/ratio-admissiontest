import React, { useEffect, useRef, useState } from 'react';

/**
 * React Bits–inspired animated primitives:
 * - AuroraBackground: ambient emerald + indigo mesh glow
 * - BlurText: staggered word-by-word blur-to-sharp reveal
 * - ShinyText: metallic sheen sweep for badges
 * - SpotlightCard: cursor-tracking radial spotlight border & surface glow
 * - SlidingMarquee: smooth infinite horizontal sliding strip (forward or reverse)
 * - CountUp: viewport-triggered animated metric counter
 */

export const AuroraBackground: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div
      className="rb-aurora-lobe absolute -top-40 left-1/2 -translate-x-1/2 w-[920px] h-[520px] rounded-full opacity-35 blur-[110px]"
      style={{
        background:
          'radial-gradient(closest-side, rgba(16, 185, 129, 0.55), rgba(14, 165, 233, 0.2), transparent)',
      }}
    />
    <div
      className="rb-aurora-lobe-alt absolute top-16 -right-32 w-[560px] h-[440px] rounded-full opacity-25 blur-[110px]"
      style={{
        background:
          'radial-gradient(closest-side, rgba(245, 208, 138, 0.35), rgba(99, 102, 241, 0.2), transparent)',
      }}
    />
  </div>
);

interface BlurTextProps {
  text: string;
  accentWords?: string[];
  className?: string;
  delayStepMs?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  accentWords = [],
  className = '',
  delayStepMs = 55,
}) => {
  const accentSet = new Set(accentWords.map((w) => w.toLowerCase()));
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, idx) => {
        const clean = word.replace(/[.,!?]/g, '').toLowerCase();
        const isAccent = accentSet.has(clean);
        return (
          <React.Fragment key={`${word}-${idx}`}>
            <span
              className={`rb-blur-word ${
                isAccent
                  ? 'italic bg-gradient-to-r from-[#34D399] via-[#6EE7B7] to-[#F5D08A] bg-clip-text text-transparent pr-1'
                  : ''
              }`}
              style={{ animationDelay: `${idx * delayStepMs}ms` }}
            >
              {word}
            </span>
            {idx < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </span>
  );
};

export const ShinyText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <span className={`rb-shiny-text ${className}`}>{children}</span>;

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onClick={onClick}
      className={`rb-spotlight rounded-2xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

interface SlidingMarqueeProps {
  items: { label: string; tag?: string }[];
  reverse?: boolean;
}

export const SlidingMarquee: React.FC<SlidingMarqueeProps> = ({ items, reverse = false }) => {
  const doubled = [...items, ...items];
  return (
    <div className="rb-marquee-mask py-1.5">
      <div className={`rb-marquee-track ${reverse ? 'reverse' : ''}`}>
        {doubled.map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            aria-hidden={idx >= items.length}
            className="whitespace-nowrap inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-[#0E131D]/90 text-sm text-slate-200 shadow-[0_2px_0_rgba(255,255,255,0.04)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]/80 shrink-0" />
            <span className="font-medium">{item.label}</span>
            {item.tag && (
              <span className="text-[10px] font-mono-tabular uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/6 text-slate-400">
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

export const CountUp: React.FC<CountUpProps> = ({ to, suffix = '', durationMs = 900 }) => {
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
