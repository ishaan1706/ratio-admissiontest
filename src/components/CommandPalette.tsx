import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Compass,
  Layers,
  PenTool,
  Search,
  X,
} from 'lucide-react';
import { PASSAGES } from '../data/passages';
import { ESSAY_SETS } from '../data/essays';
import { AppView, LnatPassage, SkillTag } from '../types';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  onStartDiagnostic: () => void;
  onStartPassage: (passage: LnatPassage) => void;
  onStartSkill: (skill: SkillTag) => void;
}

interface CommandItem {
  id: string;
  group: string;
  title: string;
  subtitle: string;
  action: () => void;
}

const SKILLS: SkillTag[] = [
  'Inference',
  'Assumption',
  'Main Argument',
  'Tone & Attitude',
  'Evidence & Structure',
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onNavigate,
  onStartDiagnostic,
  onStartPassage,
  onStartSkill,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const items = useMemo<CommandItem[]>(() => {
    const core: CommandItem[] = [
      {
        id: 'act-diag',
        group: 'Quick start',
        title: 'Start 15-min Free Diagnostic',
        subtitle: '2 passages · 8 MCQs · projected score out of 42',
        action: () => {
          onClose();
          onStartDiagnostic();
        },
      },
      {
        id: 'nav-plan',
        group: 'Pages',
        title: 'Study Plan — Day-by-day LNAT schedule',
        subtitle: 'Pick your test date, see what to fix first',
        action: () => {
          onClose();
          onNavigate('plan');
        },
      },
      {
        id: 'nav-essay',
        group: 'Pages',
        title: 'Section B Essay Studio',
        subtitle: `${ESSAY_SETS.length} exam sets · 40-min timer · live telemetry`,
        action: () => {
          onClose();
          onNavigate('essay');
        },
      },
      {
        id: 'nav-resources',
        group: 'Pages',
        title: 'Official LNAT Guide & 4-Question Reading Lab',
        subtitle: 'Direct links to lnat.ac.uk tutorial, sample test & essays',
        action: () => {
          onClose();
          onNavigate('resources');
        },
      },
      {
        id: 'nav-tests',
        group: 'Pages',
        title: 'All UK Admissions Tests (LNAT, TSA, UCAT, TMUA)',
        subtitle: 'Try live sample questions across 4 UK test tracks',
        action: () => {
          onClose();
          onNavigate('tests');
        },
      },
      {
        id: 'nav-progress',
        group: 'Pages',
        title: 'Progress & Score Analytics',
        subtitle: 'Past attempts, skill accuracy & saved essays',
        action: () => {
          onClose();
          onNavigate('progress');
        },
      },
    ];

    const passageItems: CommandItem[] = PASSAGES.map((p, idx) => ({
      id: `p-${p.id}`,
      group: 'Section A Passages',
      title: `${String(idx + 1).padStart(2, '0')} — ${p.title}`,
      subtitle: `${p.domain} · ${p.difficulty} · ${p.questions.length} MCQs`,
      action: () => {
        onClose();
        onStartPassage(p);
      },
    }));

    const skillItems: CommandItem[] = SKILLS.map((skill) => ({
      id: `sk-${skill}`,
      group: 'Skill Drills',
      title: `Drill: ${skill}`,
      subtitle: 'Focused untimed/timed questions targeting this LNAT skill',
      action: () => {
        onClose();
        onStartSkill(skill);
      },
    }));

    return [...core, ...passageItems, ...skillItems];
  }, [onClose, onNavigate, onStartDiagnostic, onStartPassage, onStartSkill]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 10);
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.subtitle.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[var(--paper)] border border-[var(--ink)] text-[var(--ink)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--rule)]">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a passage, skill drill, essay set, study plan, or test..."
            className="w-full bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--ink)] cursor-pointer"
            aria-label="Close quick jump"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto divide-y divide-[var(--rule)]">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              No matching passages, drills, or pages.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="w-full px-4 py-3 flex items-center justify-between gap-4 text-left hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="studio-kicker text-[10px]">{item.group}</span>
                  </div>
                  <div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] truncate mt-0.5">
                    {item.title}
                  </div>
                  <div className="font-serif-passage text-xs text-[var(--text-muted)] truncate">
                    {item.subtitle}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] shrink-0" />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-[var(--rule)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Passages
            </span>
            <span className="inline-flex items-center gap-1">
              <PenTool className="w-3 h-3" /> Essays
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="w-3 h-3" /> Study Plan
            </span>
            <span className="inline-flex items-center gap-1">
              <Compass className="w-3 h-3" /> Official
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers className="w-3 h-3" /> All Tests
            </span>
          </div>
          <span className="font-mono-tabular">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
