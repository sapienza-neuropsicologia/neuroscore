import { AssessmentListItem } from '#/components/AssessmentListItem'
import { Card } from '#/components/Card'
import { Loader } from '#/components/Loader'
import { useAssessmentList } from '#/model'
import { formatDate } from '#/utils'

export function AssessmentList({
  className,
  scrollable = false
}: {
  className?: string
  scrollable?: boolean
} = {}) {
  const { assessments, isLoading } = useAssessmentList()

  return (
    <Card
      title="Valutazioni"
      hideHeaderInPrint
      bottomLine="center"
      scrollable={scrollable}
      className={className}
    >
      <div className="print:hidden">
        {isLoading ? (
          <Loader />
        ) : !assessments || assessments.length === 0 ? (
          <div className="rounded-lg border border-[#e8d8cc] bg-[#fffaf7] px-4 py-3 text-sm text-[#6f5a4f]">
            Nessuna valutazione disponibile
          </div>
        ) : (
          <div className="space-y-2">
            {assessments.map((assessment) => (
              <AssessmentListItem
                key={assessment.id}
                assessment={assessment}
                title={`${assessment.patient.surname} ${assessment.patient.name}`}
                subtitle={`Data valutazione: ${formatDate(assessment.date)}`}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
