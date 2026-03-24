import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)/admin/orders/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(admin)/orders/$id"!</div>
}
