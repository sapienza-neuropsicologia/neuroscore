import { Trash2 } from 'lucide-react'
import {
  type Patient,
  type Saved,
  useDeletePatient as useDeletePatientOrig
} from '#/model'
import { TooltipButton, useConfirmDelete } from '#/sapneuro-ui/components'

export function useDeletePatientDialog({
  afterDelete
}: {
  afterDelete?: () => void
} = {}) {
  const { isPending, mutateAsync: deletePatient } = useDeletePatientOrig()
  const { DeleteDialog, openDialog } = useConfirmDelete({
    title: 'Elmina paziente',
    description:
      'Questa operazione eliminerà definitivamente questo paziente e tutte le sue valutazioni.',
    cancel: 'Annulla',
    confirm: 'Conferma',
    isPending,
    onConfirm: deletePatient,
    afterDelete
  })
  return {
    DeletePatientDialog: DeleteDialog,
    openDeletePatientDialog: openDialog
  }
}

export const PatientDeleteButton = ({
  openDeletePatientDialog,
  patient,
  className
}: {
  patient: Saved<Patient>
  openDeletePatientDialog: (patient: Saved<Patient>) => void
  className?: string
}) => {
  return (
    <TooltipButton
      tooltip="Elimina paziente"
      side="left"
      onClick={(e) => {
        e.stopPropagation()
        openDeletePatientDialog(patient)
      }}
      variant="ghost"
      className={className}
    >
      <Trash2 />
    </TooltipButton>
  )
}
