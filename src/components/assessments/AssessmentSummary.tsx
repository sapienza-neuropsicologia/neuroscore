import { useNavigate } from '@tanstack/react-router'
import { ChevronDown, ChevronRight, SquareArrowRightEnter } from 'lucide-react'
import { useState } from 'react'
import { type Assessment, type Saved, useAssessment } from '#/model'
import {
  Collapsible,
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
  Loading,
  TooltipButton
} from '#/sapneuro-ui/components'
import { TEST_REGISTRY } from '#/tests'
import { formatDate } from '#/utils'
import { TestScoreTable } from '../tests/TestScoreTable'
import { AssessmentDeleteButton } from './DeleteAssessment'

export function AssessmentSummary({
  assessment,
  openDeleteAssessmentDialog
}: {
  assessment: Saved<Assessment>
  openDeleteAssessmentDialog?: (assessment: Saved<Assessment>) => void
}) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <Collapsible key={assessment.id} open={open} onOpenChange={setOpen}>
      <Item
        size="sm"
        variant="outline"
        className="py-1 cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((open) => !open)
        }}
      >
        <ItemMedia variant="icon" className="border-0 bg-card">
          {open ? <ChevronDown /> : <ChevronRight />}
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{`Valutazione del ${formatDate(assessment.date)}`}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <TooltipButton
            tooltip="Apri scheda valutazione"
            onClick={() =>
              navigate({
                to: '/assessments/$assessmentId',
                params: { assessmentId: assessment.id }
              })
            }
            variant="ghost"
            className="pr-0!"
          >
            <SquareArrowRightEnter />
          </TooltipButton>
          {openDeleteAssessmentDialog && (
            <AssessmentDeleteButton
              assessment={assessment}
              openDeleteAssessmentDialog={openDeleteAssessmentDialog}
            />
          )}
        </ItemActions>
        {open && <AssessmentTestScores assessmentId={assessment.id} />}
      </Item>
    </Collapsible>
  )
}

function AssessmentTestScores({ assessmentId }: { assessmentId: string }) {
  const { assessment } = useAssessment(assessmentId)

  if (!assessment) return <Loading />
  if (assessment.results.length === 0)
    return (
      <div className="w-full text-sm">Nessun test in questa valutazione</div>
    )

  return <TestScoreTable registry={TEST_REGISTRY} assessment={assessment} />
}
