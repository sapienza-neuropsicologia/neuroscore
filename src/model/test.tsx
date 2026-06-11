import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext
} from 'react'
import { TEST_REGISTRY } from '#/tests'
import type { Assessment } from './assessment'
import type {
  TestResults,
  TestResultsRegistry,
  TestType,
  TypedTestResults
} from './registry'
import { api } from './storage'
import type { Saved } from './types'

export interface TestCrudRecord {
  id: string
  assessmentId: string
  type: TestType
}

export function useAssessmentResults(assessmentId?: string) {
  return useQuery({
    queryKey: ['tests', 'assessmentId', assessmentId],
    enabled: !!assessmentId,
    queryFn: async () => {
      if (!assessmentId) return [] as Saved<TestResults>[]
      const tests = await api.tests.find('assessmentId', assessmentId)
      return tests
        .filter((result) => result.type in TEST_REGISTRY)
        .sort(
          (a, b) =>
            TEST_REGISTRY[a.type].priority - TEST_REGISTRY[b.type].priority
        ) as unknown as Saved<TestResults>[]
    }
  })
}

export function useTestResults<K extends TestType>(
  assessmentId: string,
  testType: K
) {
  const { data, isLoading, isError } = useAssessmentResults(assessmentId)
  return {
    test:
      !data || isLoading || isError
        ? undefined
        : findTestResults(data, assessmentId, testType),
    isLoading,
    isError
  }
}

export function useSaveResults() {
  const queryClient = useQueryClient()
  return useMutation(
    {
      mutationFn: (record: TestResults) => api.tests.save(record),
      onSuccess: (record) => {
        return queryClient.invalidateQueries({
          queryKey: ['tests', 'assessmentId', record.assessmentId]
        })
      }
    },
    queryClient
  )
}

export function useDeleteTests() {
  const queryClient = useQueryClient()
  return useMutation(
    {
      mutationFn: async (ids: string[]) => {
        await api.tests.delete(ids)
        await Promise.all([
          ...ids.map((id) =>
            queryClient.invalidateQueries({
              queryKey: ['tests', id],
              refetchType: 'none'
            })
          ),
          queryClient.invalidateQueries({ queryKey: ['tests', 'assessmentId'] })
        ])
      }
    },
    queryClient
  )
}

function findTestResults<K extends TestType>(
  tests: Saved<TestResults>[] | undefined,
  assessmentId: string,
  testType: K
) {
  const results = tests?.find((test) => test.type === testType)
  return (results ?? {
    ...TEST_REGISTRY[testType].initialValue,
    assessmentId
  }) as TestResultsRegistry[K] | undefined
}

export const TestContext = createContext<
  | {
      assessment: Saved<Assessment>
      results: TestResults
      setResults: Dispatch<SetStateAction<TestResults>>
    }
  | undefined
>(undefined)

export function useCurrentTest<T extends TestType>() {
  const context = useContext(TestContext)
  if (!context) throw new Error('No test context')
  return {
    results: context.results as TypedTestResults<T>,
    setResults: context.setResults as Dispatch<
      SetStateAction<TypedTestResults<T>>
    >,
    assessment: context.assessment
  }
}
