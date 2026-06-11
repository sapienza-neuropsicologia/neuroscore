import type { Patient } from '#/model'

export interface TestCorrectedScore {
  raw: number
  corrected: number
  es: number
  note: string
}

function roundNumber(value: number, to?: number) {
  if (to) {
    to = 10 ** to
    return Math.round(value * to) / to
  } else {
    return value
  }
}

function equivalentScore(score: number, cutoffs: number[], inverse: boolean) {
  const max = cutoffs.length
  let es = 0
  while (es < max && (inverse ? score <= cutoffs[es] : score >= cutoffs[es]))
    es++
  return es
}

export function scoreCorrection(
  correction: (patient: Patient, raw: number) => number,
  cutoff: number | number[],
  {
    minValue = Number.NEGATIVE_INFINITY,
    maxValue = Number.POSITIVE_INFINITY,
    round,
    inverse = false
  }: {
    minValue?: number
    maxValue?: number
    round?: number
    inverse?: boolean
  } = {}
) {
  return (raw: number, patient: Patient): TestCorrectedScore => {
    const k = correction(patient, raw)
    const corrected = Math.min(Math.max(raw + k, minValue), maxValue)
    const cutoffs = Array.isArray(cutoff) ? cutoff : [cutoff]
    const es = equivalentScore(corrected, cutoffs, inverse)
    return {
      raw,
      corrected: roundNumber(corrected, round),
      es,
      note: `Correzione: ${k >= 0 ? '+' : ''}${roundNumber(k, round)}`
    }
  }
}
