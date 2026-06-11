import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PatientForm } from '#/components/PatientForm'

export const Route = createFileRoute('/patients/create')({
  component: PatientCreate
})

function PatientCreate() {
  const navigate = useNavigate()
  return (
    <PatientForm
      title="Crea paziente"
      onSave={({ id }) =>
        navigate({ to: '/patients/$patientId', params: { patientId: id } })
      }
      onCancel={() => navigate({ to: '/' })}
    />
  )
}
