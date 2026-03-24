import AdminViewHeader from '@/components/layouts/admin/header'
import { db } from '@/lib/db'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Loader2, Plus } from 'lucide-react'
import { productColumns } from './-components/table/columns'
import { Button } from '@/components/ui/button'
import { DataTable } from './-components/table/data-table'

export const Route = createFileRoute('/(admin)/admin/products/')({
  component: RouteComponent,
})




function RouteComponent() {
  const { data, isLoading } = db.useQuery({
    products: {
      $: {
        order: { serverCreatedAt: "desc" }
      },
      thumbnail: {}
    }
  });
  return (
    <main>
      <AdminViewHeader rightItem={
        <div>
          <Link to='/admin/products/create'>
            <Button><Plus /> Add Product</Button>
          </Link>
        </div>
      } />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        </div>
        <div className="min-h-screen flex-1 rounded-xl md:min-h-min">
          {
            isLoading ? (
              <div className="flex items-center justify-center w-full">
                <Loader2 className='animate-spin' />
              </div>
            )
              : (
                <DataTable
                  columns={productColumns}
                  // @ts-ignore
                  data={data?.products!}
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
