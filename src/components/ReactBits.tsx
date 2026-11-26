import React, { useRef } from 'react';
import { motion } from 'motion/react';

/**
 * Restrained React Bits + Motion Primitives components sharing one ease curve:
 * - SplitText (React Bits): crisp staggered word entrance without blur slop
 * - SpotlightTile (React Bits): subtle cursor-tracked matte surface highlight
 * - SlidingMarquee: dual opposing infinite horizontal band (recall-politics inspired)
 */

interface SplitTextProps {
  text: string;
  className?: string;
  delayOffset?: number;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delayOffset = 0,
}) => {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.48,
              delay: delayOffset + idx * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

interface SpotlightTileProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const SpotlightTile: React.FC<SpotlightTileProps> = ({
  children,
  onClick,
  className = '',
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden text-left transition-colors cursor-pointer ${className}`}
      style={
        {
          '--mx': '50%',
          '--my': '50%',
        } as React.CSSProperties
      }
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(240px circle at var(--mx) var(--my), rgba(255,255,255,0.06), transparent 72%)',
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
    </button>
  );
};

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
            className="whitespace-nowrap inline-flex items-center gap-2.5 px-4 py-2 border border-white/[0.08] bg-[#111114] text-sm text-zinc-200"
          >
            <span className="font-medium tracking-tight">{item.label}</span>
            {item.tag && (
              <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-zinc-500 border-l border-white/[0.08] pl-2.5">
                {item.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
