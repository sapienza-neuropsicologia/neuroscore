import {
  type DBSchema,
  type IDBPDatabase,
  openDB,
  type StoreKey,
  type StoreNames,
  type StoreValue
} from 'idb'
import type {
  AssessmentCrudRecord,
  CrudApi,
  NeuroScoreCrudApi,
  PatientCrudRecord,
  Possible,
  SavedCrudRecord,
  TestCrudRecord
} from '..'

type PatientIndexedDb = Omit<PatientCrudRecord, 'birthDate'> & {
  birthDate: string
}

type AssessmentIndexedDb = Omit<AssessmentCrudRecord, 'date'> & {
  date: string
}

type TestIndexedDb = TestCrudRecord

interface NeuroscoreDb extends DBSchema {
  patients: {
    key: string
    value: PatientIndexedDb
  }
  assessments: {
    key: string
    value: AssessmentIndexedDb
    indexes: { patientId: string }
  }
  tests: {
    key: string
    value: TestIndexedDb
    indexes: { assessmentId: string }
  }
}

const DB_NAME = 'neuroscore'
const DB_VERSION = 5

export async function __dangerousResetStorageForTests(): Promise<void> {
  const db = await getDb
  const tx = db.transaction(['patients', 'assessments', 'tests'], 'readwrite')

  await tx.objectStore('patients').clear()
  await tx.objectStore('assessments').clear()
  await tx.objectStore('tests').clear()
  await tx.done
}

const getDb = (() =>
  openDB<NeuroscoreDb>(DB_NAME, DB_VERSION, {
    upgrade(db, _oldVersion, _newVersion, tx) {
      if (!db.objectStoreNames.contains('patients')) {
        db.createObjectStore('patients', { keyPath: 'id' })
      }

      if (!db.objectStoreNames.contains('assessments')) {
        const assessmentsStore = db.createObjectStore('assessments', {
          keyPath: 'id'
        })
        assessmentsStore.createIndex('patientId', 'patientId', {
          unique: false
        })
      } else {
        const assessmentsStore = tx.objectStore('assessments')
        if (!assessmentsStore.indexNames.contains('patientId')) {
          assessmentsStore.createIndex('patientId', 'patientId', {
            unique: false
          })
        }
      }

      if (!db.objectStoreNames.contains('tests')) {
        const testsStore = db.createObjectStore('tests', {
          keyPath: 'id'
        })
        testsStore.createIndex('assessmentId', 'assessmentId', {
          unique: false
        })
      } else {
        const testsStore = tx.objectStore('tests')
        if (!testsStore.indexNames.contains('assessmentId')) {
          testsStore.createIndex('assessmentId', 'assessmentId', {
            unique: false
          })
        }
      }
    }
  }))()

function createCrudApi<
  T extends SavedCrudRecord,
  Schema extends DBSchema,
  Store extends StoreNames<Schema>
>(
  getDb: Promise<IDBPDatabase<Schema>>,
  store: Store,
  {
    fromStore,
    toStore
  }: {
    fromStore: (record: StoreValue<Schema, Store>) => T
    toStore: (record: Possible<T>) => StoreValue<Schema, Store>
  }
): CrudApi<T> {
  return {
    list: async () => {
      const db = await getDb
      const records = await db.getAll(store)
      await artificialDelay()
      return records.map(fromStore)
    },
    find: async (key: string, value: any) => {
      const db = await getDb
      const records = await db.getAllFromIndex(store, key as never, value)
      await artificialDelay()
      return records.map(fromStore)
    },
    get: async (id: string) => {
      const db = await getDb
      const record = await db.get(store, id as StoreKey<Schema, Store>)
      await artificialDelay()
      return record ? fromStore(record) : undefined
    },
    save: async (data: Possible<T>) => {
      const db = await getDb
      const record = toStore(data)
      await db.put(store, record)
      await artificialDelay()
      return fromStore(record)
    },
    delete: async (ids: string[]) => {
      if (ids.length > 0) {
        const db = await getDb
        const tx = db.transaction(store, 'readwrite')
        const s = tx.objectStore(store)
        await Promise.all([
          ...ids.map((id) => s.delete(id as StoreKey<Schema, Store>)),
          tx.done
        ])
        await artificialDelay()
      }
    }
  }
}

export const patients = createCrudApi(getDb, 'patients', {
  fromStore: (patient) => ({
    ...patient,
    birthDate: parseIsoDate(patient.birthDate)
  }),
  toStore: (patient) => ({
    ...patient,
    id: patient.id ?? crypto.randomUUID(),
    birthDate: saveIsoDate(patient.birthDate)
  })
})

export const assessments = createCrudApi(getDb, 'assessments', {
  fromStore: (assessment) => ({
    ...assessment,
    date: parseIsoDate(assessment.date)
  }),
  toStore: (assessment) => ({
    ...assessment,
    id: assessment.id ?? crypto.randomUUID(),
    date: saveIsoDate(assessment.date)
  })
})

export const tests = createCrudApi(getDb, 'tests', {
  fromStore: (test) => test,
  toStore: (test) => ({
    ...test,
    id: test.id ?? `${test.assessmentId}:${test.type}`
  })
})

function parseIsoDate(raw: string) {
  const value = new Date(raw)
  return Number.isNaN(value.getTime()) ? new Date() : value
}

function saveIsoDate(date: Date) {
  return date.toISOString().split('T')[0]
}

export const indexedDbApi: NeuroScoreCrudApi = {
  patients,
  assessments,
  tests
}

function artificialDelay() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 10)
  })
}
