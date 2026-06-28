import type { ReactNode } from 'react'
import type { CognitiveAreas } from '#/tests'
import type { CrudRecord } from './types'

export type ScoreTableRow = {
  area: keyof CognitiveAreas
  test: TestType
  priority: number
  measure: string
  raw: string
  corrected: string
  percentile: string
  equivalent: string
  interpretation: string
}

export type TestDefinition<T extends TestType> = {
  type: T
  priority: number
  abbreviation: string
  title: string
  description: string
  links: Record<string, string>
  initialValue: Omit<TestResultsRegistry[T], 'assessmentId'>
  formatResults?: (result: TestResultsRegistry[T]) => ScoreTableRow[]
  Form: () => ReactNode
}

export interface BaseTestResults extends CrudRecord {
  type: TestType
  assessmentId: string
}

export type TestRegistry = {
  [K in keyof TestResultsRegistry]: TestResultsRegistry[K] extends CrudRecord & {
    type: K
  }
    ? TestDefinition<K>
    : never
}

// biome-ignore lint/suspicious/noEmptyInterface: augmented by test modules
export interface TestResultsRegistry {}
export type TestType = keyof TestResultsRegistry
export type TestResults = {
  [K in keyof TestResultsRegistry]: TestResultsRegistry[K] extends BaseTestResults & {
    type: K
  }
    ? TestResultsRegistry[K]
    : never
}[keyof TestResultsRegistry]

export type TypedTestResults<K extends TestType> =
  TestResultsRegistry[K] extends BaseTestResults & {
    type: K
  }
    ? TestResultsRegistry[K]
    : never
