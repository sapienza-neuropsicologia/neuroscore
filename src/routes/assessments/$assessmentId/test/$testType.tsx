import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { CircleX, RotateCcw, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { AssessmentSummary } from '#/components/AssessmentSummary'
import { Card } from '#/components/Card'
import { Loader } from '#/components/Loader'
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
import { TEST_REGISTRY } from '#/tests'

export const Route = createFileRoute(
  '/assessments/$assessmentId/test/$testType'
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

  if (!test || !assessment) return <Loader />
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
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    navigate({
      to: '/assessments/$assessmentId',
      params: { assessmentId: assessment.id }
    })
  }, [navigate, assessment.id])

  const { Form, title, subtitle, links } = test
  return (
    <Card
      title={title}
      subtitle={subtitle}
      links={links}
      actions={[
        {
          icon: CircleX,
          label: 'Torna alla valutazione',
          tooltip: 'Annulla inserimento e torna alla valutazione',
          onClick: () => {
            goBack()
          }
        },
        {
          icon: Trash2,
          label: 'Elimina',
          tooltip: 'Elimina questo test dalla valutazione',
          onClick: async () => {
            if (results.id) await deleteTests([results.id])
            goBack()
          }
        },
        {
          icon: RotateCcw,
          label: 'Azzera',
          tooltip: "Azzera il modulo e ricomincia l'inserimento",
          onClick: () => {
            setResults(initialValue)
          }
        },
        {
          icon: Save,
          label: 'Salva',
          tooltip: 'Salva i risultati del test',
          onClick: async () => {
            await saveResults(results)
            goBack()
          }
        }
      ]}
    >
      <AssessmentSummary patient={assessment.patient} assessment={assessment} />
      <TestContext value={{ assessment, results, setResults }}>
        <Form />
      </TestContext>
    </Card>
  )
}
