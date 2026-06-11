import type { ScoreTableRow } from '#/model'
import { esInterp, formatScore } from '#/utils'
import type { SeiDicembreResults } from './scoring'

export function seiDicembreTable(result: SeiDicembreResults): ScoreTableRow[] {
  return [
    {
      area: 'Memoria',
      test: 'seidicembre',
      measure: 'Richiamo immediato',
      priority: 1,
      raw: formatScore(result.imm.raw),
      corrected: formatScore(result.imm.corrected),
      percentile: '',
      equivalent: String(result.imm.es),
      interpretation: esInterp(result.imm.es)
    },
    {
      area: 'Memoria',
      test: 'seidicembre',
      measure: 'Richiamo differito',
      priority: 3,
      raw: formatScore(result.dif.raw),
      corrected: formatScore(result.dif.corrected),
      percentile: '',
      equivalent: String(result.dif.es),
      interpretation: esInterp(result.dif.es)
    },
    {
      area: 'Memoria',
      test: 'seidicembre',
      measure: 'Totale',
      priority: 4,
      raw: formatScore(result.tot),
      corrected: '',
      percentile: '',
      equivalent: '',
      interpretation: ''
    },
    {
      area: 'Memoria',
      test: 'seidicembre',
      measure: 'Oblio',
      priority: 5,
      raw: formatScore(result.obl.raw),
      corrected: formatScore(result.obl.corrected),
      percentile: '',
      equivalent: String(result.obl.es),
      interpretation: esInterp(result.obl.es)
    }
  ]
}
