import { Trash2 } from 'lucide-react'
import { useCallback } from 'react'
import { type Assessment, type Saved, useDeleteAssessments } from '#/model'
import { TooltipButton, useConfirmDelete } from '#/sapneuro-ui/components'

export function useDeleteAssesmentDialog({
  afterDelete
}: {
  afterDelete?: () => void
} = {}) {
  const { isPending, mutateAsync } = useDeleteAssessments()
  const deleteAssessment = useCallback(
    (assessment: Saved<Assessment>) => mutateAsync([assessment]),
    [mutateAsync]
  )
  const { DeleteDialog, openDialog } = useConfirmDelete({
    title: 'Elmina valutazione',
    description:
      'Questa operazione eliminerà definitivamente questa valutazione.',
    cancel: 'Annulla',
    confirm: 'Conferma',
    isPending,
    onConfirm: deleteAssessment,
    afterDelete
  })
  return {
    DeleteAssessmentDialog: DeleteDialog,
    openDeleteAssessmentDialog: openDialog
  }
}

export const AssessmentDeleteButton = ({
  openDeleteAssessmentDialog,
  assessment,
  className
}: {
  assessment: Saved<Assessment>
  openDeleteAssessmentDialog: (patient: Saved<Assessment>) => void
  className?: string
}) => {
  return (
    <TooltipButton
      tooltip="Elimina valutazione"
      side="left"
      onClick={(e) => {
        e.stopPropagation()
        openDeleteAssessmentDialog(assessment)
      }}
      variant="ghost"
      className={className}
    >
      <Trash2 />
    </TooltipButton>
  )
}
