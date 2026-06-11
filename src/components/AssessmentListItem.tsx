import { Trash2 } from 'lucide-react'
import { type Assessment, type Saved, useDeleteAssessments } from '#/model'
import { Button } from './Button'
import { LinkBadge } from './LinkBadge'

export function AssessmentListItem({
  assessment,
  title,
  subtitle
}: {
  assessment: Saved<Assessment>
  title: string
  subtitle: string
}) {
  const { isPending, mutateAsync: deleteAssessment } = useDeleteAssessments()
  return (
    <LinkBadge
      title={title}
      subtitle={subtitle}
      to="/assessments/$assessmentId"
      params={{ assessmentId: assessment.id }}
    >
      <Button
        tooltip="Elimina valutazione"
        onClick={() => {
          if (window.confirm('Eliminare definitivamente questa valutazione?')) {
            deleteAssessment([assessment])
          }
        }}
        icon={Trash2}
        iconSize={18}
        border={false}
        disabled={isPending}
      />
    </LinkBadge>
  )
}
