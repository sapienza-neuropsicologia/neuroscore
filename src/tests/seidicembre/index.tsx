import type { TestDefinition } from '#/model/registry'
import { asset } from '#/utils'
import { SeiDicembreForm } from './form'
import { SEIDICEMBRE_INITIAL_VALUE, type SeiDicembreResults } from './scoring'
import { seiDicembreTable } from './table'

declare module '#/model/registry' {
  interface TestResultsRegistry {
    seidicembre: SeiDicembreResults
  }
}

export const SeiDicembre: TestDefinition<'seidicembre'> = {
  type: 'seidicembre',
  priority: 100,
  abbreviation: 'Memoria di prosa',
  title: 'Memoria di Prosa - Breve Racconto',
  description:
    'Racconto da Spinnler & Tognoni (1987) - Taratura di Carlesimo et al. (2002)',
  links: {
    Taratura: asset('/papers/seidicembre.carlesimo.2002.pdf')
  },
  initialValue: SEIDICEMBRE_INITIAL_VALUE,
  formatResults: seiDicembreTable,
  Form: SeiDicembreForm
}
