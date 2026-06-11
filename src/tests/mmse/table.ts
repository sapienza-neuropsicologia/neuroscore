import type { ScoreTableRow } from '#/model'
import type { MMSEResults } from './scoring'

export function mmseTable(results: MMSEResults): ScoreTableRow[] {
  return [
    {
      area: 'Funzionamento globale',
      test: 'mmse',
      measure: 'Totale',
      priority: 1,
      raw: `${results.total}/30`,
      corrected: results.corrected.value.toFixed(1),
      percentile: '',
      equivalent: '',
      interpretation: getInterpretationSymbol(results.corrected.value)
    }
  ]
}

function getInterpretationSymbol(corr: number): string {
  if (corr >= 26) return ''
  if (corr >= 24) return '°'
  return '*'
}
