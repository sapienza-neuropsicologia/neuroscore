import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/assessments')({
  component: RouteComponent
})

function RouteComponent() {
  return null
}
