import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { RotateCcw, Save, Trash2, Undo2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AssessmentHeader } from '#/components/assessments/AssessmentHeader'
import { PageContainer } from '#/components/PageContainer'
import { useEditPatientForm } from '#/components/patients/PatientEditor'
import { ScoreTable } from '#/components/tests/ScoreTable'
import {
  type Assessment,
  type Saved,
  TestContext,
  type TestDefinition,
  type TestResults,
  type TestType,
  useAssessment,
  useDeleteTests,
  useSaveResults,
  useTestResults
} from '#/model'
import { Loading, TooltipButton } from '#/sapneuro-ui/components'
import { TEST_REGISTRY } from '#/tests'

export const Route = createFileRoute(
  '/assessments/$assessmentId_/test/$testType'
)({
  component: TestPage
})

function TestPage() {
  const { assessmentId, testType } = Route.useParams()
  if (!(testType in TEST_REGISTRY))
    return (
      <Navigate to={'/assessments/$assessmentId'} params={{ assessmentId }} />
    )
  return (
    <TestPageComponent
      assessmentId={assessmentId}
      testType={testType as TestType}
    />
  )
}

function TestPageComponent({
  assessmentId,
  testType
}: {
  assessmentId: string
  testType: TestType
}) {
  const { test, isLoading, isError } = useTestResults(assessmentId, testType)
  const {
    assessment,
    isLoading: isAssessmentLoading,
    isError: isAssessmentError
  } = useAssessment(assessmentId)
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    navigate({ to: '/assessments/$assessmentId', params: { assessmentId } })
  }, [navigate, assessmentId])

  useEffect(() => {
    if (
      isError ||
      isAssessmentError ||
      (!isLoading && !test) ||
      (!isAssessmentLoading && !assessment)
    )
      goBack()
  }, [
    test,
    isLoading,
    isError,
    assessment,
    isAssessmentLoading,
    isAssessmentError,
    goBack
  ])

  if (!test || !assessment) return <Loading />
  return (
    <TestComponent
      assessment={assessment}
      test={TEST_REGISTRY[testType]}
      initialValue={test}
    />
  )
}

function TestComponent({
  assessment,
  test,
  initialValue
}: {
  assessment: Saved<Assessment>
  test: TestDefinition<any>
  initialValue: TestResults
}) {
  const [results, setResults] = useState(() => initialValue)
  const { mutateAsync: saveResults } = useSaveResults()
  const { mutateAsync: deleteTests } = useDeleteTests()
  const { EditPatientDialog, openEditPatientDialog } = useEditPatientForm()
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    navigate({
      to: '/assessments/$assessmentId',
      params: { assessmentId: assessment.id }
    })
  }, [navigate, assessment.id])

  const { Form, title, description, links } = test
  const resultsTable = useMemo(
    () => test.formatResults?.(results) ?? [],
    [test.formatResults, results]
  )

  return (
    <>
      <EditPatientDialog />
      <PageContainer
        title={title}
        description={description}
        scrollable={true}
        links={links}
        actions={
          <div className="flex">
            <TooltipButton
              onClick={() => goBack()}
              tooltip="Torna alla scheda della valutazione"
              variant="ghost"
              side="left"
              className="pr-0!"
            >
              <Undo2 />
            </TooltipButton>
            <TooltipButton
              onClick={async () => {
                if (results.id) await deleteTests([results.id])
                goBack()
              }}
              tooltip="Cancella il test"
              variant="ghost"
              side="left"
              className="pr-0!"
            >
              <Trash2 />
            </TooltipButton>
            <TooltipButton
              onClick={() => setResults(initialValue)}
              tooltip="Azzera il modulo e ricomincia l'inserimento"
              variant="ghost"
              side="left"
              className="pr-0!"
            >
              <RotateCcw />
            </TooltipButton>
            <TooltipButton
              onClick={async () => {
                await saveResults(results)
                goBack()
              }}
              tooltip="Salva i risultati del test"
              variant="ghost"
              side="left"
              className="pr-0!"
            >
              <Save />
            </TooltipButton>
          </div>
        }
        footer={<ScoreTable results={resultsTable} />}
      >
        <AssessmentHeader
          assessment={assessment}
          openEditPatientDialog={openEditPatientDialog}
        />
        <TestContext value={{ assessment, results, setResults }}>
          <Form />
        </TestContext>
      </PageContainer>
    </>
  )
}
