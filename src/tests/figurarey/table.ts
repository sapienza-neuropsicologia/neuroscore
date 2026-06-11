import type { ScoreTableRow } from '#/model'
import { esInterp, formatScore } from '#/utils'
import type { FiguraReyResults } from './scoring'

export function figuraReyTable(results: FiguraReyResults): ScoreTableRow[] {
  return [
    {
      area: 'Prassie',
      test: 'figurarey',
      measure: 'Copia',
      priority: 1,
      raw: formatScore(results.copy.scores.raw),
      corrected: formatScore(results.copy.scores.corrected),
      percentile: '',
      equivalent: formatScore(results.copy.scores.es),
      interpretation: esInterp(results.copy.scores.es)
    },
    {
      area: 'Memoria',
      test: 'figurarey',
      measure: 'Richiamo immediato',
      priority: 2,
      raw: formatScore(results.immediate.scores.raw),
      corrected: formatScore(results.immediate.scores.corrected),
      percentile: '',
      equivalent: formatScore(results.immediate.scores.es),
      interpretation: esInterp(results.immediate.scores.es)
    },
    {
      area: 'Memoria',
      test: 'figurarey',
      measure: 'Richiamo differito',
      priority: 4,
      raw: formatScore(results.deferred.scores.raw),
      corrected: formatScore(results.deferred.scores.corrected),
      percentile: '',
      equivalent: formatScore(results.deferred.scores.es),
      interpretation: esInterp(results.deferred.scores.es)
    },
    {
      area: 'Memoria',
      test: 'figurarey',
      measure: 'Oblio',
      priority: 5,
      raw: formatScore(results.oblivion.raw),
      corrected: formatScore(results.oblivion.corrected),
      percentile: '',
      equivalent: formatScore(results.oblivion.es),
      interpretation: esInterp(results.oblivion.es)
    }
  ]
}
