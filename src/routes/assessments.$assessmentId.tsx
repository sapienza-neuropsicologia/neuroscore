import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Undo2 } from 'lucide-react'
import { useEffect } from 'react'
import { AssessmentHeader } from '#/components/assessments/AssessmentHeader'
import {
  AssessmentDeleteButton,
  useDeleteAssesmentDialog
} from '#/components/assessments/DeleteAssessment'
import { PageContainer } from '#/components/PageContainer'
import { useEditPatientForm } from '#/components/patients/PatientEditor'
import { AvailableTests } from '#/components/tests/AvailableTests'
import { TestScoreTable } from '#/components/tests/TestScoreTable'
import { useAssessment } from '#/model'
import { Loading, TooltipButton } from '#/sapneuro-ui/components'
import { TEST_REGISTRY } from '#/tests'
import { formatDate } from '#/utils'

export const Route = createFileRoute('/assessments/$assessmentId')({
  component: AssessmentDetailPage
})

function AssessmentDetailPage() {
  const { assessmentId } = Route.useParams()
  const { assessment, isLoading, isError } = useAssessment(assessmentId)
  const { EditPatientDialog, openEditPatientDialog } = useEditPatientForm()
  const { DeleteAssessmentDialog, openDeleteAssessmentDialog } =
    useDeleteAssesmentDialog()
  const navigate = useNavigate()

  useEffect(() => {
    if (isError || (!isLoading && !assessment)) navigate({ to: '/' })
  }, [assessment, isLoading, isError, navigate])

  if (!assessment) return <Loading />

  return (
    <>
      <EditPatientDialog />
      <DeleteAssessmentDialog />
      <PageContainer
        title="Scheda valutazione neuropsicologica"
        description={`Data valutazione: ${formatDate(assessment.date)}`}
        scrollable={true}
        actions={
          <div className="flex">
            <TooltipButton
              onClick={() =>
                navigate({
                  to: '/patients/$patientId',
                  params: { patientId: assessment.patient.id! }
                })
              }
              tooltip="Torna alla scheda del paziente"
              variant="ghost"
              side="left"
              className="pr-0!"
            >
              <Undo2 />
            </TooltipButton>
            <AssessmentDeleteButton
              assessment={assessment}
              openDeleteAssessmentDialog={openDeleteAssessmentDialog}
            />{' '}
          </div>
        }
      >
        <AssessmentHeader
          assessment={assessment}
          openEditPatientDialog={openEditPatientDialog}
        />
        <TestScoreTable registry={TEST_REGISTRY} assessment={assessment} />
        <div className="print:hidden">
          <AvailableTests
            assessmentId={assessment.id}
            registry={TEST_REGISTRY}
            results={assessment.results}
          />
        </div>
      </PageContainer>
    </>
  )
}
