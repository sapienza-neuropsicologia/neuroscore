import type { TestDefinition } from '#/model/registry'
import { asset } from '#/utils'
import { FiguraReyForm } from './form'
import { FIGURAREY_INITIAL_VALUE, type FiguraReyResults } from './scoring'
import { figuraReyTable } from './table'

declare module '#/model/registry' {
  interface TestResultsRegistry {
    figurarey: FiguraReyResults
  }
}

export const FiguraRey: TestDefinition<'figurarey'> = {
  type: 'figurarey',
  priority: 101,
  abbreviation: 'Figura di Rey',
  title: 'Figura complessa di Rey',
  description: 'Taratura di Carlesimo et al. (2002)',
  links: {
    Taratura: asset('/papers/seidicembre.carlesimo.2002.pdf'),
    'Figura da stampare': asset('/tests/figurarey/print.pdf')
  },
  initialValue: FIGURAREY_INITIAL_VALUE,
  formatResults: figuraReyTable,
  Form: FiguraReyForm
}
