import { useCallback, useMemo } from 'react'
import { useCurrentTest } from '#/model'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '#/sapneuro-ui/components'
import item1 from './assets/rey1.png'
import item2 from './assets/rey2.png'
import item3 from './assets/rey3.png'
import item4 from './assets/rey4.png'
import item5 from './assets/rey5.png'
import item6 from './assets/rey6.png'
import item7 from './assets/rey7.png'
import item8 from './assets/rey8.png'
import item9 from './assets/rey9.png'
import item10 from './assets/rey10.png'
import item11 from './assets/rey11.png'
import item12 from './assets/rey12.png'
import item13 from './assets/rey13.png'
import item14 from './assets/rey14.png'
import item15 from './assets/rey15.png'
import item16 from './assets/rey16.png'
import item17 from './assets/rey17.png'
import item18 from './assets/rey18.png'
import { scoreLabels, scoringItems } from './items'
import { computeScores } from './scoring'

const images = [
  item1,
  item2,
  item3,
  item4,
  item5,
  item6,
  item7,
  item8,
  item9,
  item10,
  item11,
  item12,
  item13,
  item14,
  item15,
  item16,
  item17,
  item18
]

export function FiguraReyForm() {
  return (
    <Tabs defaultValue="copy">
      <div className="flex justify-center">
        <TabsList>
          <TabsTrigger value="copy">Copia</TabsTrigger>
          <TabsTrigger value="immediate">Richiamo immediato</TabsTrigger>
          <TabsTrigger value="deferred">Richiamo differito</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="copy">
        <FiguraReyVersion version="copy" />
      </TabsContent>
      <TabsContent value="immediate">
        <FiguraReyVersion version="immediate" />
      </TabsContent>
      <TabsContent value="deferred">
        <FiguraReyVersion version="deferred" />
      </TabsContent>
    </Tabs>
  )
}

function FiguraReyVersion({
  version
}: {
  version: 'copy' | 'immediate' | 'deferred'
}) {
  const { assessment, results, setResults } = useCurrentTest<'figurarey'>()
  const itemScores = useMemo(() => results[version].items, [results, version])
  const setItemScore = useCallback(
    (index: number, value: number) => {
      setResults((score) => {
        score[version].items[index] = value
        return computeScores(assessment.patient, score)
      })
    },
    [setResults, version, assessment.patient]
  )

  return (
    <div className="print:grid print:grid-cols-2 print:gap-2">
      {scoringItems.map(({ label, note }, item) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the array is const
        <div key={item} className={note ? 'print:mb-0.5' : ''}>
          <div className="grid w-full grid-cols-[auto_1fr] items-start gap-4 py-2">
            <Tooltip>
              <TooltipTrigger className="cursor-help">
                <img
                  src={images[item]}
                  alt={`Figura Rey elemento ${item + 1}`}
                  className="h-auto w-50"
                />
              </TooltipTrigger>
              {note && (
                <TooltipContent>
                  <div className="text-xs max-w-xs md:max-w-sm lg:max-w-md">
                    {note}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
            <div className="w-full">
              <div className="mt-1 flex flex-col gap-1">
                <div className="text-sm leading-4">
                  {item + 1}. {label}
                </div>
                {scoreLabels.map((label, index) => (
                  <div key={label} className="flex items-center  gap-2">
                    <input
                      type="radio"
                      id={`${version}-${item}-${label}`}
                      name={`${version}-${item}`}
                      value={index}
                      className="accent-[#8e2f3f] cursor-pointer"
                      checked={itemScores[item] === index}
                      onChange={() => setItemScore(item, index)}
                    />
                    <label
                      htmlFor={`${version}-${item}-${label}`}
                      className="text-xs leading-4"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden print:grid print:grid-cols-[8rem_1fr] print:items-center print:gap-2 print:py-0">
            <div>
              <img
                src={images[item]}
                alt={`Figura Rey elemento ${item + 1}`}
                className="h-auto w-full object-contain"
              />
            </div>
            <div>
              {item + 1}. {scoreLabels[itemScores[item]]}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
