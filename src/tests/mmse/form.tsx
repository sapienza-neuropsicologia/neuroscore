import { useCallback } from 'react'
import { SectionPill } from '#/components/SectionPill'
import { useCurrentTest } from '#/model'
import { MMSE_ITEMS, recalculate } from './scoring'

const sectionMeta = {
  ot: { label: 'Orientamento temporale', max: 5 },
  os: { label: 'Orientamento spaziale', max: 5 },
  reg: { label: 'Memoria', max: 3 },
  att: { label: 'Attenzione e calcolo', max: 5 },
  rie: { label: 'Rievocazione', max: 3 },
  lin: { label: 'Linguaggio e prassie', max: 9 }
} as const

export function MmseForm() {
  const { assessment, results, setResults } = useCurrentTest<'mmse'>()

  const toggleCheck = useCallback(
    (id: string) => {
      setResults(recalculate(assessment.patient, results, id))
    },
    [assessment, results, setResults]
  )

  return (
    <>
      <div className="print:grid print:grid-cols-2 print:gap-2 print:[&_.section-pill]:mb-0.5 print:[&_.section-pill]:mt-0.5">
        {(Object.keys(sectionMeta) as Array<keyof typeof sectionMeta>).map(
          (sectionKey) => {
            const meta = sectionMeta[sectionKey]
            const sectionItems = MMSE_ITEMS.filter(
              (i) => i.section === sectionKey
            )
            return (
              <div key={sectionKey} className="print:mb-0">
                <SectionPill>
                  {meta.label}{' '}
                  <span className="ml-2 rounded-full bg-[#8e2f3f] px-2 py-0.5 text-white print:border print:border-black print:bg-transparent print:px-1 print:py-0 print:text-[9px] print:text-black">
                    {results.sectionScores[sectionKey]}/{meta.max}
                  </span>
                </SectionPill>
                <div className="divide-y divide-[#e8d8cc] border-y border-[#e8d8cc] print:divide-[#ddd] print:border-[#ddd]">
                  {sectionItems.map((item) => (
                    <label
                      key={item.id}
                      className="grid grid-cols-[1fr_auto] gap-3 py-2 print:gap-1 print:py-0"
                    >
                      <div>
                        <div className="text-sm leading-6 print:text-[10px] print:leading-3">
                          {item.label}
                        </div>
                        {item.note ? (
                          <div className="text-xs text-[#6f5a4f] print:hidden">
                            {item.note}
                          </div>
                        ) : null}
                      </div>
                      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-[#6f5a4f] print:gap-0.5 print:text-[9px] print:text-black">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[#8e2f3f] print:h-2.5 print:w-2.5 print:accent-black"
                          checked={Boolean(results.checks[item.id])}
                          onChange={() => toggleCheck(item.id)}
                        />
                        {item.pts}
                        <span className="print:hidden">pt</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          }
        )}
      </div>

      <div className="mt-5 rounded-xl border border-[#e8d8cc] bg-[#fffaf7] p-4 print:mt-1.5 print:rounded-none print:border-[#888] print:bg-white print:p-1.5">
        <div className="flex items-center justify-between border-b border-[#e8d8cc] pb-2 print:pb-0.5">
          <div className="text-sm text-[#6f5a4f] print:text-[10px] print:text-black">
            Punteggio grezzo
          </div>
          <div className="text-3xl font-semibold tabular-nums print:text-xl">
            {results.total}
            <span className="ml-1 text-sm text-[#6f5a4f] print:text-[10px] print:text-black">
              / 30
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-[#e8d8cc] py-2 print:py-0.5">
          <div>
            <div className="text-sm text-[#6f5a4f] print:text-[10px] print:text-black">
              Punteggio corretto
            </div>
            <div className="mt-1 text-sm text-[#6f5a4f] print:hidden">
              {results.corrected.note}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold text-[#8e2f3f] tabular-nums print:text-xl print:text-black">
              {results.corrected.value.toFixed(1)}
              <div className="text-sm font-semibold print:text-[10px]">
                {results.corrected.interp}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
