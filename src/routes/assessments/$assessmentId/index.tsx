import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Home, Pencil, Trash2 } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { AssessmentSummary } from '#/components/AssessmentSummary'
import { AvailableTests } from '#/components/AvailableTests'
import { Button } from '#/components/Button'
import { Card } from '#/components/Card'
import { Loader } from '#/components/Loader'
import { TestScoreTable } from '#/components/TestScoreTable'
import { useAssessment, useDeleteAssessments } from '#/model'
import { TEST_REGISTRY } from '#/tests'
import { formatDate } from '#/utils'

export const Route = createFileRoute('/assessments/$assessmentId/')({
  component: AssessmentDetailPage
})

function AssessmentDetailPage() {
  const { assessmentId } = Route.useParams()
  const { assessment, isLoading, isError } = useAssessment(assessmentId)
  const { mutateAsync: deleteAssessments } = useDeleteAssessments()
  const navigate = useNavigate()

  useEffect(() => {
    if (isError || (!isLoading && !assessment)) navigate({ to: '/' })
  }, [assessment, isLoading, isError, navigate])

  const handleDelete = useCallback(() => {
    if (assessment) {
      if (window.confirm('Eliminare definitivamente questa valutazione?')) {
        deleteAssessments([assessment])
        navigate({ to: '/' })
      }
    }
  }, [assessment, deleteAssessments, navigate])

  if (!assessment) return <Loader />
  return (
    <Card
      title="Scheda valutazione neuropsicologica"
      subtitle={`Data valutazione: ${formatDate(assessment.date)}`}
      hideHeaderInPrint
      actions={[
        {
          icon: Home,
          label: 'Home',
          tooltip: 'Torna alla pagina iniziale',
          onClick: () => navigate({ to: '/' })
        },
        {
          icon: Trash2,
          label: 'Cancella valutazione',
          tooltip: 'Cancella valutazione',
          onClick: handleDelete
        }
      ]}
    >
      <AssessmentSummary patient={assessment.patient} assessment={assessment}>
        <Button
          tooltip="Modifica i dati del paziente"
          icon={Pencil}
          iconSize={18}
          onClick={() =>
            navigate({
              to: '/patients/$patientId/edit',
              params: { patientId: assessment.patient.id! }
            })
          }
        />
      </AssessmentSummary>
      <TestScoreTable registry={TEST_REGISTRY} assessment={assessment} />
      <div className="print:hidden">
        <AvailableTests
          assessmentId={assessment.id}
          registry={TEST_REGISTRY}
          results={assessment.results}
        />
      </div>
    </Card>
  )
}
