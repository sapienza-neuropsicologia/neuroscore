import { useNavigate } from '@tanstack/react-router'
import { Pencil, Trash2 } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import {
  type Assessment,
  type Saved,
  useDeleteTests,
  useScoreTable
} from '#/model'
import type { TestRegistry } from '#/model/registry'
import { TooltipButton } from '#/sapneuro-ui/components'

export function TestScoreTable({
  assessment,
  registry
}: PropsWithChildren<{
  assessment: Saved<Assessment>
  registry: TestRegistry
}>) {
  const { mutateAsync: deleteTests } = useDeleteTests()
  const navigate = useNavigate()

  const tableRows = useScoreTable(registry, assessment)
  if (tableRows.length === 0) return null

  return (
    <div className="mb-3 overflow-x-auto rounded-lg border border-[#e8d8cc] bg-[#fffaf7] print:bg-white">
      <table className="min-w-full border-collapse text-sm print:text-[11px]">
        <thead className="bg-[#f4e9df] text-xs uppercase tracking-wide text-[#6f5a4f] print:bg-white print:text-[10px]">
          <tr>
            <th className="px-3 py-2 text-left print:px-2 print:py-1">
              Funzione
            </th>
            <th className="px-3 py-2 text-left print:px-2 print:py-1">Test</th>
            <th className="px-3 py-2 text-left print:px-2 print:py-1">
              Misura
            </th>
            <th className="px-3 py-2 text-right print:px-2 print:py-1">PG</th>
            <th className="px-3 py-2 text-right print:px-2 print:py-1">PC</th>
            <th className="px-3 py-2 text-right print:px-2 print:py-1">RP</th>
            <th className="px-3 py-2 text-right print:px-2 print:py-1">PE</th>
            <th className="px-3 py-2 text-right print:px-2 print:py-1"></th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => {
            const previous = tableRows[index - 1]
            const next = tableRows[index + 1]
            const showArea = !previous || previous.area !== row.area
            const showTest = !previous || previous.test !== row.test
            const hasSubRows = showTest && next?.test === row.test
            const cellPy = !showTest
              ? 'pb-0.5 pt-0'
              : hasSubRows
                ? 'pt-2 pb-0.5'
                : 'py-2'
            return (
              <tr
                key={`${row.area}-${row.test}-${row.measure}`}
                className={showTest ? 'border-t border-[#ecdccf]' : ''}
              >
                <td
                  className={`${cellPy} px-3 align-middle text-xs font-semibold uppercase tracking-wide text-[#6f5a4f] print:px-2 print:text-[10px]`}
                >
                  {showArea ? row.area : ''}
                </td>
                <td className={`${cellPy} px-3 align-top print:px-2`}>
                  {showTest && (
                    <div className="flex align-middle">
                      <div className="font-semibold text-[#8e2f3f] pr-1">
                        {registry[row.test].abbreviation}
                      </div>
                      <TooltipButton
                        tooltip="Modifica risultati test"
                        variant="ghost"
                        className="h-auto w-auto p-0 m-0 print:hidden"
                        onClick={() =>
                          navigate({
                            to: '/assessments/$assessmentId/test/$testType',
                            params: {
                              assessmentId: assessment.id,
                              testType: row.test
                            }
                          })
                        }
                      >
                        <Pencil size={12} />
                      </TooltipButton>
                      <TooltipButton
                        tooltip="Cancella risultati test"
                        variant="ghost"
                        className="h-auto w-auto p-0 m-0 print:hidden"
                        onClick={() =>
                          deleteTests([
                            assessment.results.find((t) => t.type === row.test)!
                              .id
                          ])
                        }
                      >
                        <Trash2 size={12} />
                      </TooltipButton>
                    </div>
                  )}
                </td>
                <td
                  className={`${cellPy} px-3 align-top text-[#2c1f1a] print:px-2`}
                >
                  {row.measure}
                </td>
                <td
                  className={`${cellPy} px-3 text-right font-medium tabular-nums text-[#2c1f1a] print:px-2`}
                >
                  {row.raw}
                </td>
                <td
                  className={`${cellPy} px-3 text-right font-medium tabular-nums text-[#2c1f1a] print:px-2`}
                >
                  {row.corrected}
                </td>
                <td
                  className={`${cellPy} px-3 text-right font-medium tabular-nums text-[#2c1f1a] print:px-2`}
                >
                  {row.percentile}
                </td>
                <td
                  className={`${cellPy} px-3 text-right font-medium tabular-nums text-[#2c1f1a] print:px-2`}
                >
                  {row.equivalent}
                </td>
                <td
                  className={`${cellPy} px-3 text-right font-medium tabular-nums text-[#2c1f1a] print:px-2`}
                >
                  {row.interpretation}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
