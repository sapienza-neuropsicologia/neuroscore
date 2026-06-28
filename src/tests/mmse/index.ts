import type { TestDefinition } from '#/model/registry'
import { asset } from '#/utils'
import { MmseForm } from './form'
import { MMSE_INITIAL_VALUE, type MMSEResults } from './scoring'
import { mmseTable } from './table'

declare module '#/model/registry' {
  interface TestResultsRegistry {
    mmse: MMSEResults
  }
}

export const MMSE: TestDefinition<'mmse'> = {
  type: 'mmse',
  priority: 10,
  abbreviation: 'MMSE',
  title: 'Mini-Mental State Examination (MMSE)',
  description: 'Versione italiana di Magni et al. (1996)',
  links: {
    'Magni et al. 1996': asset('/papers/mmse.magni.1996.pdf')
  },
  initialValue: MMSE_INITIAL_VALUE,
  formatResults: mmseTable,
  Form: MmseForm
}
