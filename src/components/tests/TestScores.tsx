import { SectionPill } from '#/components/SectionPill'
import type { TestCorrectedScore } from '#/tests/correction'

export function TestScores({
  scores
}: {
  scores: Record<string, TestCorrectedScore>
}) {
  return (
    <>
      <SectionPill>Punteggi</SectionPill>
      <div className="mt-5 overflow-x-auto rounded-xl border border-[#e8d8cc] bg-[#fffaf7] print:mt-2 print:rounded-none print:border-[#888] print:bg-white">
        <table className="min-w-full border-collapse text-sm print:text-[11px]">
          <thead className="bg-[#f4e9df] text-xs uppercase tracking-wide text-[#6f5a4f] print:bg-white print:text-[10px] print:text-black">
            <tr>
              <th className="px-3 py-2 text-left print:px-2 print:py-1">
                Misura
              </th>
              <th className="px-3 py-2 text-right print:px-2 print:py-1">
                Punteggio grezzo
              </th>
              <th className="px-3 py-2 text-right print:px-2 print:py-1">
                Punteggio corretto
              </th>
              <th className="px-3 py-2 text-right print:px-2 print:py-1">
                Punteggio equivalente
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(scores).map((key) => (
              <tr key={key} className="border-t border-[#e8d8cc]">
                <td className="px-3 py-2 text-sm text-[#6f5a4f] print:px-2 print:py-1 print:text-[10px] print:text-black">
                  <span className="font-bold">{key}</span>
                  <span className="print:hidden">
                    <br />
                    {scores[key].note}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-lg font-semibold tabular-nums text-[#2c1f1a] print:px-2 print:py-1 print:text-base">
                  {numberRepr(scores[key].raw)}
                </td>
                <td className="px-3 py-2 text-right text-lg font-semibold tabular-nums text-[#2c1f1a] print:px-2 print:py-1 print:text-base">
                  {numberRepr(scores[key].corrected)}
                </td>
                <td className="px-3 py-2 text-right text-lg font-semibold tabular-nums text-[#2c1f1a] print:px-2 print:py-1 print:text-base">
                  {numberRepr(scores[key].es)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function numberRepr(value: number) {
  return Number.isFinite(value)
    ? Math.round(value) === value
      ? value
      : value.toFixed(1)
    : '-'
}
