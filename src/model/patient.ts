import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { useMemo } from 'react'
import { computePatientAge } from '#/utils'
import {
  type Assessment,
  useDeleteAssessments,
  usePatientAssessments
} from './assessment'
import { api } from './storage'
import type { Possible, Saved, SavedCrudRecord } from './types'

export type PatientSex = 'M' | 'F'

export interface PatientCrudRecord extends SavedCrudRecord {
  name: string
  surname: string
  birthDate: Date
  sex: PatientSex
  schoolYears: number
}

export interface Patient extends Possible<PatientCrudRecord> {
  age: number
  assessments: Saved<Assessment>[]
}

export function usePatientList() {
  return useQuery({
    queryKey: ['patients', 'all'],
    queryFn: async () => {
      const patients = await api.patients.list()
      return patients
        .map(fromStoredPatient)
        .sort((a, b) => a.surname.localeCompare(b.surname, 'it'))
    }
  })
}

export function usePatients(ids?: string[]) {
  return useQueries({
    queries: (ids ?? []).map((id) => ({
      queryKey: ['patients', id],
      queryFn: () =>
        api.patients.get(id).then((p) => (p ? fromStoredPatient(p) : undefined))
    }))
  })
}

export function usePatient(
  id?: string,
  { populate = true }: { populate?: boolean } = {}
) {
  const patientQuery = useQuery({
    queryKey: ['patients', id],
    queryFn: async () => {
      const record = await api.patients.get(id!)
      return record ? fromStoredPatient(record) : undefined
    },
    enabled: !!id
  })
  const assessmentQuery = usePatientAssessments(
    populate ? patientQuery.data : undefined
  )
  const patient: Saved<Patient> | undefined = useMemo(
    () =>
      patientQuery.data
        ? {
            ...patientQuery.data,
            assessments: assessmentQuery.data ?? []
          }
        : undefined,
    [patientQuery, assessmentQuery]
  )
  return {
    patient,
    isLoading: assessmentQuery.isLoading || patientQuery.isLoading,
    isError: assessmentQuery.isError || patientQuery.isError
  }
}

export function useSavePatient() {
  const queryClient = useQueryClient()
  return useMutation(
    {
      mutationFn: (record: Patient) =>
        api.patients.save(toStoredPatient(record)),
      onSuccess: (record) => {
        queryClient.setQueryData(['patients', record.id], record)
        return queryClient.invalidateQueries({
          queryKey: ['patients', 'all']
        })
      }
    },
    queryClient
  )
}

export function useDeletePatient() {
  const queryClient = useQueryClient()
  const deleteAssessments = useDeleteAssessments()
  return useMutation(
    {
      mutationFn: async (patient: Saved<Patient>) => {
        await deleteAssessments.mutateAsync(patient.assessments)

        api.patients.delete([patient.id])
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['patients', patient.id],
            refetchType: 'none'
          }),
          queryClient.invalidateQueries({
            queryKey: ['patients', 'all']
          })
        ])
      }
    },
    queryClient
  )
}

function fromStoredPatient(patient: PatientCrudRecord): Saved<Patient> {
  return {
    ...patient,
    age: computePatientAge(patient.birthDate),
    assessments: []
  }
}

function toStoredPatient(patient: Patient): Possible<PatientCrudRecord> {
  const { age, assessments, ...data } = patient
  return data
}
