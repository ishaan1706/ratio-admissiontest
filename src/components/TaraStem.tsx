import React from 'react';

type StemBlock =
  | { kind: 'prose'; text: string }
  | { kind: 'table' | 'grid'; rows: string[][] };

function splitStem(stem: string): StemBlock[] {
  const lines = stem.split('\n');
  const layout = (line: string) =>
    line.includes('|') ? 'table' : /^(?:[A-Z·] +){2,}[A-Z·]$/.test(line.trim()) ? 'grid' : null;
  const blocks: StemBlock[] = [];
  let proseStart = 0;
  for (let i = 0; i < lines.length;) {
    const kind = layout(lines[i]);
    let end = i + 1;
    while (kind && end < lines.length && layout(lines[end]) === kind) end++;
    if (kind && end > i + 1) {
      const rows = lines.slice(i, end).map((line) =>
        kind === 'table'
          ? line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim())
          : line.trim().split(/ +/),
      );
      if (rows[0].length > 1 && rows.every((row) => row.length === rows[0].length)) {
        if (i > proseStart) blocks.push({ kind: 'prose', text: lines.slice(proseStart, i).join('\n') });
        blocks.push({ kind, rows });
        proseStart = end;
      }
    }
    i = end;
  }
  if (proseStart < lines.length) blocks.push({ kind: 'prose', text: lines.slice(proseStart).join('\n') });
  return blocks;
}

const numericCell = /^[+−-]?(?:[£$€]\s*)?\d[\d,.]*(?:(?:[:/–-]\d+)|(?:\s*(?:%|°?[A-Za-z]+[²³]?)))?$/;

export function TaraStem({ stem, className, exam = false }: { stem: string; className: string; exam?: boolean }) {
  const border = exam ? 'border-[#CBD5E1]' : 'border-[var(--rule)]';
  const surface = exam ? 'bg-white' : 'bg-[var(--surface)]';
  const header = exam ? 'bg-[#E9F1F5]' : 'bg-[var(--surface-subtle)]';
  const rowDividers = exam ? 'divide-[#CBD5E1]' : 'divide-[var(--rule)]';

  return (
    <div className={className}>
      {splitStem(stem).map((block, i) => {
        if (block.kind === 'prose') return <React.Fragment key={i}>{block.text}</React.Fragment>;
        const { rows } = block;
        if (block.kind === 'grid') {
          return (
            <React.Fragment key={i}>
              <span className="sr-only">
                {rows.map((row, j) => `Row ${j + 1}: ${row.map((cell) => cell === '·' ? 'blank' : cell).join(', ')}.`).join(' ')}
              </span>
              <div
                aria-hidden="true"
                className="my-2 grid w-fit max-w-full gap-0.5"
                style={{ gridTemplateColumns: `repeat(${rows[0].length}, minmax(0, 2rem))` }}
              >
                {rows.flat().map((cell, j) =>
                  cell === '·' ? (
                    <span key={j} className="aspect-square" />
                  ) : (
                    <span key={j} className={`grid aspect-square place-items-center border font-semibold ${border} ${header}`}>
                      {cell}
                    </span>
                  ),
                )}
              </div>
            </React.Fragment>
          );
        }
        const [headers, ...body] = rows;
        const columnClasses = headers.map((_, column) =>
          `px-3 py-2 whitespace-nowrap ${body.every((row) => numericCell.test(row[column])) ? 'text-right tabular-nums' : 'text-left'}`,
        );
        return (
          <div
            key={i}
            role="region"
            aria-label="Question data table, scrollable"
            tabIndex={0}
            className={`my-2 max-w-full overflow-x-auto rounded-lg border focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] ${border} ${surface}`}
          >
            <table className="w-full border-collapse text-sm">
              <thead className={header}>
                <tr className={`border-b ${border}`}>
                  {headers.map((cell, j) => (
                    <th key={j} scope="col" className={`${columnClasses[j]} font-semibold`}>{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${rowDividers}`}>
                {body.map((row, j) => (
                  <tr key={j}>
                    {row.map((cell, k) => <td key={k} className={columnClasses[k]}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
