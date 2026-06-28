import type { BaseTestResults, Patient } from '#/model'
import { scoreCorrection, type TestCorrectedScore } from '../correction'

interface Checks {
  strarip: boolean
  city: boolean
  time: boolean
  morti: boolean
  mortiNum: boolean
  amm: boolean
  ammNum: boolean
  salv: boolean
  salvDet: boolean
}

export interface SeiDicembreResults extends BaseTestResults {
  type: 'seidicembre'
  immChecks: Checks
  difChecks: Checks
  immText: string
  difText: string
  imm: TestCorrectedScore
  dif: TestCorrectedScore
  tot: number
  obl: TestCorrectedScore
}

export const SEIDICEMBRE_INITIAL_VALUE = {
  type: 'seidicembre' as const,
  immChecks: {
    strarip: false,
    city: false,
    time: false,
    morti: false,
    mortiNum: false,
    amm: false,
    ammNum: false,
    salv: false,
    salvDet: false
  },
  difChecks: {
    strarip: false,
    city: false,
    time: false,
    morti: false,
    mortiNum: false,
    amm: false,
    ammNum: false,
    salv: false,
    salvDet: false
  },
  immText: '',
  difText: '',
  imm: {
    raw: 0,
    corrected: 0,
    es: 0,
    note: ''
  },
  dif: {
    raw: 0,
    corrected: 0,
    es: 0,
    note: ''
  },
  tot: 0,
  obl: {
    raw: 0,
    corrected: 0,
    es: 0,
    note: ''
  }
}

const correctImmediateScore = scoreCorrection(
  // Equazione di correzione: 5.90 + 3.13 [log10(130-età) - 1.86]
  (patient) => -3.13 * (Math.log10(130 - patient.age) - 1.86),
  [3.1, 3.87, 5.33, 6.16],
  { minValue: 0, maxValue: 8, round: 1 }
)

const correctDeferredScore = scoreCorrection(
  // Equazione di correzione: 5.68 + 2.59 * (log10(100-età) - 1.60) + 0.32 * (sqrt(scolarità) - 3.41)
  ({ age, literacy }) =>
    -2.59 * (Math.log10(100 - age) - 1.6) - 0.32 * (Math.sqrt(literacy) - 3.41),
  [2.39, 3.77, 5.07, 5.88],
  { minValue: 0, maxValue: 8, round: 1 }
)

const correctOblivionScore = scoreCorrection(
  // Equazione di correzione: 0.22 - 1.03 [log10(100-età) - 1.60] - 0.15 M/ +0.15 F
  ({ age, sex }) =>
    1.03 * (Math.log10(100 - age) - 1.6) + (sex === 'M' ? 0.15 : -0.15),
  [2.32, 1.02, 0.37, 0.1],
  { round: 1, inverse: true }
)

function scoreRecall(v: Checks): number {
  const s =
    (v.strarip ? 3 : 0) +
    (v.strarip && v.city ? 0.3 : 0) +
    (v.strarip && v.time ? 0.3 : 0)
  const m = (v.morti ? 2 : 0) + (v.morti && v.mortiNum ? 0.2 : 0)
  const a = (v.amm ? 1 : 0) + (v.amm && v.ammNum ? 0.1 : 0)
  const t = (v.salv ? 1 : 0) + (v.salv && v.salvDet ? 0.1 : 0)
  return s + m + a + t
}

export function toggleCheck(
  patient: Patient,
  results: SeiDicembreResults,
  which: 'imm' | 'dif',
  key: keyof Checks
) {
  if (which === 'imm') {
    results.immChecks[key] = !results.immChecks[key]
    results.imm = correctImmediateScore(scoreRecall(results.immChecks), patient)
  } else {
    results.difChecks[key] = !results.difChecks[key]
    results.dif = correctDeferredScore(scoreRecall(results.difChecks), patient)
  }
  results.tot = results.imm.raw + results.dif.raw
  results.obl = correctOblivionScore(
    results.imm.raw - results.dif.raw,
    patient
  )!
  return { ...results }
}

export function setRecallText(
  results: SeiDicembreResults,
  which: 'imm' | 'dif',
  text: string
) {
  if (which === 'imm') {
    results.immText = text
  } else {
    results.difText = text
  }
  return { ...results }
}
