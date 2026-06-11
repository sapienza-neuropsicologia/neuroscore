import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Card } from '#/components/Card'
import { Loader } from '#/components/Loader'
import { PatientListItem } from '#/components/PatientListItem'
import { usePatientList } from '#/model'

export function PatientList({
  className,
  scrollable = false
}: {
  className?: string
  scrollable?: boolean
} = {}) {
  const navigate = useNavigate()
  const { data: patients, isLoading } = usePatientList()

  return (
    <Card
      title="Elenco per paziente"
      hideHeaderInPrint
      actions={[
        {
          icon: Plus,
          label: 'Nuovo paziente',
          tooltip: 'Nuovo paziente',
          onClick: () => navigate({ to: '/patients/create' })
        }
      ]}
      bottomLine="center"
      scrollable={scrollable}
      className={className}
    >
      <div className="print:hidden">
        {isLoading ? (
          <Loader />
        ) : !patients || patients.length === 0 ? (
          <div className="rounded-lg border border-[#e8d8cc] bg-[#fffaf7] px-4 py-3 text-sm text-[#6f5a4f]">
            Nessun paziente disponibile
          </div>
        ) : (
          <div className="space-y-2">
            {patients.map((patient) => (
              <PatientListItem key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
