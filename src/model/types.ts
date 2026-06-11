import type { AssessmentCrudRecord } from './assessment'
import type { PatientCrudRecord } from './patient'
import type { TestCrudRecord } from './test'

export interface CrudRecord {
  id?: string
}

export interface SavedCrudRecord {
  id: string
}

export type Saved<T extends CrudRecord> = Omit<T, 'id'> & { id: string }

export type Possible<T extends SavedCrudRecord> = Omit<T, 'id'> & {
  id?: string
}

export type CrudApi<T extends SavedCrudRecord> = {
  list(): Promise<T[]>
  find(key: string, value: any): Promise<T[]>
  get(id: string): Promise<T | undefined>
  save(record: Possible<T>): Promise<T>
  delete(ids: string[]): Promise<void>
}

export type CrudRegistry<Config extends Record<string, { id: string }>> = {
  [K in keyof Config]: CrudApi<Config[K]>
}

export type NeuroScoreCrudApi = CrudRegistry<{
  patients: PatientCrudRecord
  assessments: AssessmentCrudRecord
  tests: TestCrudRecord
}>
