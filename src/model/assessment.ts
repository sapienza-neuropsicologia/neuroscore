import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { cognitiveAreas } from '#/tests'
import { type Patient, usePatient, usePatients } from './patient'
import type { TestRegistry, TestResults } from './registry'
import { api } from './storage'
import { useAssessmentResults, useDeleteTests } from './test'
import type { CrudRecord, Saved, SavedCrudRecord } from './types'

export interface AssessmentCrudRecord extends SavedCrudRecord {
  patientId: string
  date: Date
}

export interface Assessment extends CrudRecord {
  patient: Patient
  date: Date
  results: Saved<TestResults>[]
}

export function useAssessmentList() {
  const assessmentQuery = useQuery({
    queryKey: ['assessments', 'all'],
    queryFn: async () => api.assessments.list()
  })
  const patientQuery = usePatients(
    assessmentQuery.data?.map((s) => s.patientId)
  )
  const assessments = useMemo(
    () =>
      assessmentQuery.data
        ? assessmentQuery.data
            .map((assessment, index) =>
              populateAssessment(assessment, patientQuery[index].data, [])
            )
            .filter((assessment) => assessment !== undefined)
        : undefined,
    [assessmentQuery, patientQuery]
  )
  return {
    assessments,
    isLoading:
      assessmentQuery.isLoading || patientQuery.some((q) => q.isLoading),
    isError: assessmentQuery.isError || patientQuery.some((q) => q.isError)
  }
}

export function usePatientAssessments(patient?: Saved<Patient>) {
  return useQuery({
    queryKey: ['assessments', 'patientId', patient?.id],
    queryFn: async () => {
      if (!patient) return []
      const assessments = await api.assessments.find('patientId', patient.id)
      return assessments.map(
        (assessment) => populateAssessment(assessment, patient, [])!
      )
    }
  })
}

export function useAssessment(id?: string) {
  const assessmentQuery = useQuery({
    queryKey: ['assessments', id],
    queryFn: () => api.assessments.get(id!),
    enabled: !!id
  })
  const patientQuery = usePatient(assessmentQuery.data?.patientId, {
    populate: false
  })
  const resultsQuery = useAssessmentResults(assessmentQuery.data?.id)
  const assessment = useMemo(
    () =>
      populateAssessment(
        assessmentQuery.data,
        patientQuery.patient,
        resultsQuery.data
      ),
    [assessmentQuery, patientQuery, resultsQuery]
  )
  return {
    assessment,
    isLoading:
      assessmentQuery.isLoading ||
      patientQuery.isLoading ||
      resultsQuery.isLoading,
    isError:
      assessmentQuery.isError || patientQuery.isError || resultsQuery.isError
  }
}

export function useCreateAssessment() {
  const queryClient = useQueryClient()
  return useMutation(
    {
      mutationFn: (patient: Saved<Patient>) =>
        api.assessments.save(newAssessment(patient)),
      onSuccess: (record) => {
        queryClient.setQueryData(['assessments', record.id], record)
        return queryClient.invalidateQueries({
          queryKey: ['assessments', 'all']
        })
      }
    },
    queryClient
  )
}

export function useDeleteAssessments() {
  const queryClient = useQueryClient()
  const deleteTests = useDeleteTests()
  return useMutation(
    {
      mutationFn: async (assessments: Saved<Assessment>[]) => {
        const testIds = assessments.flatMap((assessment) =>
          assessment.results.map((result) => result.id)
        )
        await deleteTests.mutateAsync(testIds)
        await api.assessments.delete(
          assessments.map((assessment) => assessment.id)
        )
        await Promise.all([
          ...assessments.map((assessment) =>
            queryClient.invalidateQueries({
              queryKey: ['assessments', assessment.id],
              refetchType: 'none'
            })
          ),
          queryClient.invalidateQueries({ queryKey: ['assessments', 'all'] })
        ])
      }
    },
    queryClient
  )
}

export function useScoreTable(
  registry: TestRegistry,
  assessment: Saved<Assessment>
) {
  return useMemo(
    () =>
      assessment.results
        .flatMap(
          (test) => registry[test.type].formatResults?.(test as any) ?? []
        )
        .sort(
          (a, b) =>
            cognitiveAreas[a.area] * 1000000 +
            registry[a.test].priority * 1000 +
            a.priority -
            (cognitiveAreas[b.area] * 1000000 +
              registry[b.test].priority * 1000 +
              b.priority)
        ),
    [registry, assessment.results]
  )
}

function newAssessment(patient: Saved<Patient>) {
  return {
    patientId: patient.id,
    date: new Date()
  }
}

function populateAssessment(
  assessment?: AssessmentCrudRecord,
  patient?: Patient,
  results?: Saved<TestResults>[]
): Saved<Assessment> | undefined {
  if (assessment && patient && results) {
    const { patientId, ...data } = assessment
    return {
      ...data,
      patient,
      results
    }
  }
}
