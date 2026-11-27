import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\)|\*[^*]+\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(text.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={key++} className="font-semibold text-[var(--ink)]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--rule)] font-mono-tabular text-[0.85em] text-[var(--ink)]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[')) {
      const m = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/.exec(token);
      if (m) {
        nodes.push(
          <a
            key={key++}
            href={m[2]}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
          >
            {m[1]}
          </a>
        );
      } else {
        nodes.push(token);
      }
    } else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIdx = match.index + token.length;
  }

  if (lastIdx < text.length) {
    nodes.push(text.slice(lastIdx));
  }
  return nodes;
}

function splitTableRow(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return false;
  const cells = splitTableRow(trimmed);
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      i++;
      continue;
    }

    // Fenced code block
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push(
        <pre
          key={key++}
          className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4 overflow-x-auto font-mono-tabular text-xs text-[var(--ink)] leading-relaxed"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push(<hr key={key++} className="border-[var(--rule)] my-5" />);
      i++;
      continue;
    }

    // Headings
    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      if (level === 1) {
        blocks.push(
          <h1
            key={key++}
            className="font-display text-2xl sm:text-3xl text-[var(--ink)] tracking-tight pt-2 first:pt-0"
          >
            {renderInline(text)}
          </h1>
        );
      } else if (level === 2) {
        blocks.push(
          <h2
            key={key++}
            className="font-display text-xl sm:text-2xl text-[var(--ink)] pt-4 first:pt-0 pb-1.5 border-b border-[var(--rule)]"
          >
            {renderInline(text)}
          </h2>
        );
      } else if (level === 3) {
        blocks.push(
          <h3
            key={key++}
            className="text-sm font-semibold text-[var(--ink)] uppercase tracking-wider font-mono-tabular pt-3"
          >
            {renderInline(text)}
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={key++} className="text-sm font-semibold text-[var(--ink)] pt-2">
            {renderInline(text)}
          </h4>
        );
      }
      i++;
      continue;
    }

    // Pipe table: header line + separator line + body rows
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headers = splitTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().includes('|') && !isTableSeparator(lines[i])) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push(
        <div
          key={key++}
          className="overflow-x-auto rounded-xl border border-[var(--rule)] bg-[var(--bg)]"
        >
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--rule)] bg-[var(--surface-2)]">
                {headers.map((h, hi) => (
                  <th
                    key={hi}
                    className="px-4 py-2.5 text-[11px] font-mono-tabular font-semibold uppercase tracking-wider text-[var(--text-muted)] whitespace-nowrap"
                  >
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule)]">
              {rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-[var(--surface)]/70 transition-colors">
                  {headers.map((_, ci) => {
                    const cell = row[ci] ?? '';
                    return (
                      <td
                        key={ci}
                        className={`px-4 py-2.5 align-top leading-relaxed ${
                          ci === 0
                            ? 'font-medium text-[var(--ink)] whitespace-nowrap sm:whitespace-normal sm:w-52'
                            : 'text-[var(--text)]'
                        }`}
                      >
                        {renderInline(cell)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="border-l-2 border-[var(--accent)] pl-4 py-1 text-sm text-[var(--text-muted)] bg-[var(--accent-soft)]/30 rounded-r-lg"
        >
          {renderInline(quoteLines.join(' '))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul key={key++} className="space-y-1.5 pl-5 list-disc text-sm text-[var(--text)] leading-relaxed marker:text-[var(--accent)]">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol key={key++} className="space-y-1.5 pl-5 list-decimal text-sm text-[var(--text)] leading-relaxed marker:font-mono-tabular marker:text-[var(--text-muted)]">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph (collect consecutive plain lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,4}\s+|```|[-*+]\s+|\d+\.\s+|>\s?|-{3,}$|\*{3,}$)/.test(lines[i].trim()) &&
      !(lines[i].trim().includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push(
        <p key={key++} className="text-sm text-[var(--text)] leading-relaxed">
          {renderInline(paraLines.join(' '))}
        </p>
      );
    } else {
      i++;
    }
  }

  return <div className={`space-y-4 ${className}`}>{blocks}</div>;
};
