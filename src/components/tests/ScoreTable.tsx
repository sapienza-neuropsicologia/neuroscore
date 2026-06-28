import type { ScoreTableRow } from '#/model'

export function ScoreTable({ results }: { results: ScoreTableRow[] }) {
  return (
    <table className="min-w-full overflow-x-auto text-sm print:text-[11px]">
      <thead className="text-xs border-b uppercase tracking-wide text-[#6f5a4f] print:text-[10px]">
        <tr>
          <th className="px-3 py-1 text-left print:px-2 print:py-1">Misura</th>
          <th className="px-3 py-1 text-right print:px-2 print:py-1">PG</th>
          <th className="px-3 py-1 text-right print:px-2 print:py-1">PC</th>
          <th className="px-3 py-1 text-right print:px-2 print:py-1">RP</th>
          <th className="px-3 py-1 text-right print:px-2 print:py-1">PE</th>
          <th className="px-3 py-1 text-right print:px-2 print:py-1"></th>
        </tr>
      </thead>
      <tbody>
        {results.map((row) => (
          <tr key={`${row.area}-${row.test}-${row.measure}`}>
            <td className="pb-0.5 pt-0 px-3 align-top text-[#2c1f1a] print:px-2">
              {row.measure}
            </td>
            <td className="pb-0.5 pt-0 px-3 text-right font-medium tabular-nums text-[#2c1f1a] print:px-2">
              {row.raw}
            </td>
            <td className="pb-0.5 pt-0 px-3 text-right font-medium tabular-nums text-[#2c1f1a] print:px-2">
              {row.corrected}
            </td>
            <td className="pb-0.5 pt-0 px-3 text-right font-medium tabular-nums text-[#2c1f1a] print:px-2">
              {row.percentile}
            </td>
            <td className="pb-0.5 pt-0 px-3 text-right font-medium tabular-nums text-[#2c1f1a] print:px-2">
              {row.equivalent}
            </td>
            <td className="pb-0.5 pt-0 px-3 align-top text-[#2c1f1a] print:px-2">
              {row.interpretation}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
