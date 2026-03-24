import AdminViewHeader from '@/components/layouts/admin/header'
import { DataTable } from '@/components/ui/data-table'
import { createFileRoute } from '@tanstack/react-router'
import { ordersColumns } from './-components/table/columns'
import { db } from '@/lib/db'
import { Loader2 } from 'lucide-react'


export const Route = createFileRoute('/(admin)/admin/orders/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = db.useQuery({ orders: { $: { order: { serverCreatedAt: "desc" } } } });

  return (
    <main>
      <AdminViewHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        </div>
        <div className="min-h-screen flex-1 md:min-h-min">
          {
            isLoading ? (
              <div className="flex items-center justify-center w-full">
                <Loader2 className='animate-spin' />
              </div>
            )
              : (
                <DataTable
                  columns={ordersColumns}
                  data={data?.orders!}
                  enableColumnVisibility
                  enableFiltering
                  enablePagination
                  enableRowSelection
                  enableSorting
                />
              )
          }
        </div>
      </div>
    </main>
  )
}
