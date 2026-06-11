import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Home, Pencil, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { AssessmentListItem } from '#/components/AssessmentListItem'
import { Card } from '#/components/Card'
import { Loader } from '#/components/Loader'
import {
  useCreateAssessment,
  useDeletePatient,
  usePatient,
  usePatientAssessments
} from '#/model'
import { formatDate } from '#/utils'

export const Route = createFileRoute('/patients/$patientId/')({
  component: PatientDetailPage
})

function PatientDetailPage() {
  const { patientId } = Route.useParams()
  const { patient, isLoading, isError } = usePatient(patientId, {
    populate: true
  })
  const { data: assessments, isLoading: assessmentsAreLoading } =
    usePatientAssessments(patient)
  const { mutateAsync: createAssessment } = useCreateAssessment()
  const { mutateAsync: deletePatient } = useDeletePatient()
  const navigate = useNavigate()

  useEffect(() => {
    if (isError || (!isLoading && !patient)) navigate({ to: '/' })
  }, [patient, isLoading, isError, navigate])

  const handleDelete = useCallback(() => {
    if (patient) {
      if (window.confirm('Eliminare definitivamente questo paziente?')) {
        deletePatient(patient)
        navigate({ to: '/' })
      }
    }
  }, [patient, deletePatient, navigate])

  if (!patient) return <Loader />
  return (
    <Card
      title={`${patient.surname} ${patient.name}`}
      subtitle={`nat${patient.sex === 'M' ? 'o' : 'a'} il ${formatDate(patient.birthDate)}`}
      hideHeaderInPrint
      actions={[
        {
          icon: Home,
          label: 'Home',
          tooltip: 'Torna alla pagina iniziale',
          onClick: () => navigate({ to: '/' })
        },
        {
          icon: Plus,
          label: 'Crea valutazione',
          tooltip: 'Crea una sessione di valutazione per questo paziente',
          onClick: () => {
            createAssessment(patient).then(({ id }) =>
              navigate({
                to: '/assessments/$assessmentId',
                params: { assessmentId: id }
              })
            )
          }
        },
        {
          icon: Pencil,
          label: 'Modifica paziente',
          tooltip: 'Modifica i dati del paziente',
          onClick: () =>
            navigate({ to: '/patients/$patientId/edit', params: { patientId } })
        },
        {
          icon: Trash2,
          label: 'Cancella paziente',
          tooltip: 'Cancella paziente',
          onClick: handleDelete
        }
      ]}
    >
      <div>
        {assessmentsAreLoading ? (
          <Loader />
        ) : !assessments || assessments.length === 0 ? (
          <div className="rounded-lg border border-[#e8d8cc] bg-[#fffaf7] px-4 py-3 text-sm text-[#6f5a4f]">
            Nessuna valutazione disponibile
          </div>
        ) : (
          <div className="space-y-2">
            {assessments.map((assessment) => (
              <AssessmentListItem
                key={assessment.id}
                assessment={assessment}
                title={`Valutazione del ${formatDate(assessment.date)}`}
                subtitle=""
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
