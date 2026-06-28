import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/')({
  component: RouteComponent
})

function RouteComponent() {
  return null
}
