import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Home, Pencil, Plus } from 'lucide-react'
import { useEffect } from 'react'
import { AssessmentSummary } from '#/components/assessments/AssessmentSummary'
import { useDeleteAssesmentDialog } from '#/components/assessments/DeleteAssessment'
import { PageContainer } from '#/components/PageContainer'
import {
  PatientDeleteButton,
  useDeletePatientDialog
} from '#/components/patients/DeletePatient'
import { useEditPatientForm } from '#/components/patients/PatientEditor'
import { useCreateAssessment, usePatient, usePatientAssessments } from '#/model'
import { ItemGroup, Loading, TooltipButton } from '#/sapneuro-ui/components'
import { formatDate } from '#/utils'

export const Route = createFileRoute('/patients/$patientId')({
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
  const { EditPatientDialog, openEditPatientDialog } = useEditPatientForm()
  const { DeletePatientDialog, openDeletePatientDialog } =
    useDeletePatientDialog({
      afterDelete: () => navigate({ to: '/' })
    })
  const { DeleteAssessmentDialog, openDeleteAssessmentDialog } =
    useDeleteAssesmentDialog()
  const navigate = useNavigate()

  useEffect(() => {
    if (isError || (!isLoading && !patient)) navigate({ to: '/' })
  }, [patient, isLoading, isError, navigate])

  if (!patient) return <Loading />

  return (
    <>
      <EditPatientDialog />
      <DeletePatientDialog />
      <DeleteAssessmentDialog />
      <PageContainer
        title={`${patient.surname} ${patient.name}`}
        description={`nat${patient.sex === 'M' ? 'o' : 'a'} il ${formatDate(patient.birthDate)}, scolarità ${patient.literacy} anni`}
        scrollable={true}
        actions={
          <div className="flex">
            <TooltipButton
              onClick={() => navigate({ to: '/' })}
              tooltip="Torna alla lista dei pazienti"
              variant="ghost"
              side="left"
              className="pr-0!"
            >
              <Home />
            </TooltipButton>
            <TooltipButton
              tooltip="Crea una sessione di valutazione per questo paziente"
              onClick={() => {
                createAssessment(patient).then(({ id }) =>
                  navigate({
                    to: '/assessments/$assessmentId',
                    params: { assessmentId: id }
                  })
                )
              }}
              variant="ghost"
              side="left"
              className="pr-0!"
            >
              <Plus />
            </TooltipButton>
            <TooltipButton
              onClick={() => openEditPatientDialog(patient)}
              tooltip="Modifica dati anagrafici"
              variant="ghost"
              side="left"
              className="pr-0!"
            >
              <Pencil />
            </TooltipButton>
            <PatientDeleteButton
              patient={patient}
              openDeletePatientDialog={openDeletePatientDialog}
            />
          </div>
        }
        footer=""
      >
        <div>
          {assessmentsAreLoading ? (
            <Loading />
          ) : !assessments || assessments.length === 0 ? (
            <div className="py-3 text-sm text-muted-foreground text-center">
              Nessuna valutazione disponibile
            </div>
          ) : (
            <div>
              <div className="py-2 text-sm text-muted-foreground">
                Lista delle valutazioni effettuate:
              </div>
              <ItemGroup className="gap-2">
                {assessments.map((assessment) => (
                  <AssessmentSummary
                    key={assessment.id}
                    assessment={assessment}
                    openDeleteAssessmentDialog={openDeleteAssessmentDialog}
                  />
                ))}
              </ItemGroup>
            </div>
          )}
        </div>
      </PageContainer>
    </>
  )
}
