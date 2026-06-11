import { createFileRoute } from '@tanstack/react-router'
import { AssessmentList } from '#/components/AssessmentList'
import { PatientList } from '#/components/PatientList'

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {
  return (
    <div className="h-full min-h-0 overflow-hidden">
      <div className="flex h-full min-h-0 flex-col gap-4 md:grid md:grid-cols-2">
        <div className="min-h-0 flex-1 md:h-full">
          <AssessmentList className="h-full" scrollable />
        </div>
        <div className="min-h-0 flex-1 md:h-full">
          <PatientList className="h-full" scrollable />
        </div>
      </div>
    </div>
  )
}
