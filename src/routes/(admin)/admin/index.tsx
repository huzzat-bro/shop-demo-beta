import AdminViewHeader from '@/components/layouts/admin/header'
import { createFileRoute } from '@tanstack/react-router'
import { Visitor } from './-components/charts/visitor'
import { Revenue } from './-components/charts/revenue'

export const Route = createFileRoute('/(admin)/admin/')({
  component: RouteComponent,
})


function RouteComponent() {
  return (
    <div className="">
      <AdminViewHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Visitor />
        <Revenue />
      </div>
    </div>
  )
}
