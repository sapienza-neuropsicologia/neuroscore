import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/patients')({
  component: RouteComponent
})

function RouteComponent() {
  return null
}
