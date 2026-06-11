import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Loader } from '#/components/Loader'
import { PatientForm } from '#/components/PatientForm'
import { usePatient } from '#/model'

export const Route = createFileRoute('/patients/$patientId/edit')({
  component: PatientEdit
})

function PatientEdit() {
  const { patientId } = Route.useParams()
  const { patient, isLoading, isError } = usePatient(patientId, {
    populate: false
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (isError || (!isLoading && !patient)) navigate({ to: '/' })
  }, [patient, isLoading, isError, navigate])
  if (!patient) return <Loader />

  return (
    <PatientForm
      title="Aggiorna dati paziente"
      patient={patient}
      onSave={() =>
        navigate({ to: '/patients/$patientId', params: { patientId } })
      }
      onCancel={() =>
        navigate({ to: '/patients/$patientId', params: { patientId } })
      }
    />
  )
}
