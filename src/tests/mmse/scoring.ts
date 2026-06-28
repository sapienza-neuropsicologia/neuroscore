import type { BaseTestResults, Patient } from '#/model'

export interface MMSEResults extends BaseTestResults {
  type: 'mmse'
  checks: Record<string, boolean>
  sectionScores: {
    ot: number
    os: number
    reg: number
    att: number
    rie: number
    lin: number
  }
  total: number
  corrected: {
    value: number
    note: string
    interp: string
  }
}

export const MMSE_INITIAL_VALUE = {
  type: 'mmse' as const,
  checks: {},
  sectionScores: {
    ot: 0,
    os: 0,
    reg: 0,
    att: 0,
    rie: 0,
    lin: 0
  },
  total: 0,
  corrected: {
    value: 0,
    note: '',
    interp: 'Deterioramento grave (< 18)'
  }
}

type Item = {
  id: string
  section: 'ot' | 'os' | 'reg' | 'att' | 'rie' | 'lin'
  label: string
  note?: string
  pts: number
}

export const MMSE_ITEMS: Item[] = [
  {
    id: 'ot-year',
    section: 'ot',
    label: 'In che anno siamo?',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },
  {
    id: 'ot-season',
    section: 'ot',
    label: 'In che stagione siamo?',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },
  {
    id: 'ot-month',
    section: 'ot',
    label: 'In che mese siamo?',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },
  {
    id: 'ot-date',
    section: 'ot',
    label: 'Mi dica la data di oggi',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },
  {
    id: 'ot-weekday',
    section: 'ot',
    label: 'Che giorno della settimana è oggi?',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },

  {
    id: 'os-country',
    section: 'os',
    label: 'Mi dica in che nazione siamo',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },
  {
    id: 'os-region',
    section: 'os',
    label: 'In quale regione italiana siamo?',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },
  {
    id: 'os-city',
    section: 'os',
    label: 'In quale città ci troviamo?',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },
  {
    id: 'os-place',
    section: 'os',
    label: 'Mi dica il name del luogo in cui ci troviamo',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },
  {
    id: 'os-floor',
    section: 'os',
    label: 'A che piano siamo?',
    note: '0 = errata · 1 = corretta',
    pts: 1
  },

  {
    id: 'reg-pane',
    section: 'reg',
    label: 'Registrazione parola: pane',
    note: '1 punto se ripetuta',
    pts: 1
  },
  {
    id: 'reg-casa',
    section: 'reg',
    label: 'Registrazione parola: casa',
    note: '1 punto se ripetuta',
    pts: 1
  },
  {
    id: 'reg-gatto',
    section: 'reg',
    label: 'Registrazione parola: gatto',
    note: '1 punto se ripetuta',
    pts: 1
  },

  {
    id: 'att-93',
    section: 'att',
    label: '93 / O',
    note: 'Sottrazioni seriali o MONDO al contrario',
    pts: 1
  },
  { id: 'att-86', section: 'att', label: '86 / D', pts: 1 },
  { id: 'att-79', section: 'att', label: '79 / N', pts: 1 },
  { id: 'att-72', section: 'att', label: '72 / O', pts: 1 },
  { id: 'att-65', section: 'att', label: '65 / M', pts: 1 },

  {
    id: 'rie-pane',
    section: 'rie',
    label: 'Rievocazione parola: pane',
    pts: 1
  },
  {
    id: 'rie-casa',
    section: 'rie',
    label: 'Rievocazione parola: casa',
    pts: 1
  },
  {
    id: 'rie-gatto',
    section: 'rie',
    label: 'Rievocazione parola: gatto',
    pts: 1
  },

  { id: 'lin-watch', section: 'lin', label: 'Denominazione: orologio', pts: 1 },
  { id: 'lin-pencil', section: 'lin', label: 'Denominazione: matita', pts: 1 },
  { id: 'lin-repeat', section: 'lin', label: 'Ripetizione frase', pts: 1 },
  {
    id: 'lin-take',
    section: 'lin',
    label: 'Comando: prende il foglio',
    pts: 1
  },
  { id: 'lin-fold', section: 'lin', label: 'Comando: piega il foglio', pts: 1 },
  { id: 'lin-put', section: 'lin', label: 'Comando: mette sul tavolo', pts: 1 },
  {
    id: 'lin-read',
    section: 'lin',
    label: 'Lettura: chiuda gli occhi',
    pts: 1
  },
  { id: 'lin-write', section: 'lin', label: 'Scrittura spontanea', pts: 1 },
  { id: 'lin-draw', section: 'lin', label: 'Copia dei pentagoni', pts: 1 }
]

const CT: Record<string, Record<string, number>> = {
  '65': { '0': 0.4, '5': -1.1, '8': -2.0, '13': -2.8 },
  '70': { '0': 0.7, '5': -0.7, '8': -1.6, '13': -2.3 },
  '75': { '0': 1.0, '5': -0.3, '8': -1.0, '13': -1.7 },
  '80': { '0': 1.5, '5': 0.4, '8': -0.3, '13': -0.9 },
  '85': { '0': 2.2, '5': 1.4, '8': 0.8, '13': 0.3 }
}

function mapAgeToMmseClass(age: number): '65' | '70' | '75' | '80' | '85' {
  const v = age as number
  if (v <= 69) return '65'
  if (v <= 74) return '70'
  if (v <= 79) return '75'
  if (v <= 84) return '80'
  return '85'
}

function mapSchoolYearsToMmseClass(years: number): '0' | '5' | '8' | '13' {
  if (!Number.isFinite(years) || years < 0) return ''
  if (years <= 4) return '0'
  if (years <= 7) return '5'
  if (years <= 12) return '8'
  return '13'
}

function computeCorrection(patient: Patient, raw: number) {
  const ageClass = mapAgeToMmseClass(patient.age)
  const schoolClass = mapSchoolYearsToMmseClass(patient.literacy)
  const k = CT[ageClass]?.[schoolClass]
  const c = Math.min(30, Math.max(0, raw + k))
  let interp = 'Deterioramento grave (< 18)'
  if (c >= 24) interp = 'Nella norma (>= 24)'
  else if (c >= 22) interp = 'Declino lieve (22-23)'
  else if (c >= 18) interp = 'Deterioramento moderato (18-21)'

  return {
    value: c,
    note: `Correzione applicata: ${k >= 0 ? '+' : ''}${k.toFixed(1)} pt (Magni et al., 1996)`,
    interp
  }
}

export function recalculate(
  patient: Patient,
  results: MMSEResults,
  id: string
) {
  const checks = { ...results.checks }
  checks[id] = !checks[id]
  const total = MMSE_ITEMS.reduce(
    (sum, item) => (checks[item.id] ? sum + item.pts : sum),
    0
  )
  const sectionScores = {
    ot: MMSE_ITEMS.filter((i) => i.section === 'ot').reduce(
      (s, i) => s + (checks[i.id] ? i.pts : 0),
      0
    ),
    os: MMSE_ITEMS.filter((i) => i.section === 'os').reduce(
      (s, i) => s + (checks[i.id] ? i.pts : 0),
      0
    ),
    reg: MMSE_ITEMS.filter((i) => i.section === 'reg').reduce(
      (s, i) => s + (checks[i.id] ? i.pts : 0),
      0
    ),
    att: MMSE_ITEMS.filter((i) => i.section === 'att').reduce(
      (s, i) => s + (checks[i.id] ? i.pts : 0),
      0
    ),
    rie: MMSE_ITEMS.filter((i) => i.section === 'rie').reduce(
      (s, i) => s + (checks[i.id] ? i.pts : 0),
      0
    ),
    lin: MMSE_ITEMS.filter((i) => i.section === 'lin').reduce(
      (s, i) => s + (checks[i.id] ? i.pts : 0),
      0
    )
  }
  const corrected = computeCorrection(patient, total)
  return {
    type: 'mmse' as const,
    assessmentId: results.assessmentId,
    checks,
    total,
    sectionScores,
    corrected
  }
}
