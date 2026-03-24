import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)/admin/products/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(admin)/products/$id/edit"!</div>
}
