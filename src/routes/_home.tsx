import {
  createFileRoute,
  useLocation,
  useNavigate
} from '@tanstack/react-router'
import { BriefcaseMedical, Plus, User } from 'lucide-react'
import {
  AssessmentTable,
  useAssessmentTable
} from '#/components/assessments/AssessmentTable'
import { PageContainer } from '#/components/PageContainer'
import { useCreatePatientForm } from '#/components/patients/PatientEditor'
import {
  PatientTable,
  usePatientTable
} from '#/components/patients/PatientTable'
import {
  TableFilter,
  Tabs,
  TabsList,
  TabsTrigger,
  TooltipButton
} from '#/sapneuro-ui/components'

export const Route = createFileRoute('/_home')({
  component: HomeLayout
})

function HomeLayout() {
  const { table: patientsTable, isLoading: patientsAreLoading } =
    usePatientTable()
  const { table: assessmentTable, isLoading: assessmentsAreLoading } =
    useAssessmentTable()

  const { CreatePatientDialog, openCreatePatientDialog } =
    useCreatePatientForm()
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab =
    location.pathname === '/assessments' ? '/assessments' : '/patients'

  return (
    <>
      <CreatePatientDialog />
      <PageContainer
        title={
          <div className="flex items-center gap-2">
            <div>Mostra</div>
            <Tabs
              value={activeTab}
              onValueChange={(newPath) => navigate({ to: newPath })}
              className="mt-0 pt-0"
            >
              <TabsList>
                <TabsTrigger value="/patients">
                  <User />
                  Pazienti
                </TabsTrigger>
                <TabsTrigger value="/assessments">
                  <BriefcaseMedical />
                  Valutazioni
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
        actions={
          <div className="flex">
            {activeTab === '/assessments' ? (
              <TableFilter
                table={assessmentTable}
                field="patient"
                placeholder="Filtra paziente..."
                className="text-sm"
              />
            ) : (
              <TableFilter
                table={patientsTable}
                field="surname"
                placeholder="Filtra per cognome..."
                className="text-sm"
              />
            )}

            <TooltipButton
              onClick={() => openCreatePatientDialog()}
              tooltip="Crea nuovo paziente"
              variant="ghost"
              side="left"
              className="pr-0!"
            >
              <Plus />
            </TooltipButton>
          </div>
        }
        footer={
          activeTab === '/assessments'
            ? 'Per creare una nuova valutazione, vai alla scheda Pazienti e clicca sul paziente o creane uno nuovo'
            : 'Clicca su un paziente per accedere alle sue valutazioni o crearne una nuova'
        }
      >
        {activeTab === '/assessments' ? (
          <AssessmentTable
            table={assessmentTable}
            isLoading={assessmentsAreLoading}
          />
        ) : (
          <PatientTable table={patientsTable} isLoading={patientsAreLoading} />
        )}
      </PageContainer>
    </>
  )
}
