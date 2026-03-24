import AdminViewHeader from '@/components/layouts/admin/header'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/(admin)/admin/promotional-banners/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = db.useInfiniteQuery({ promotionalBanners: {} })
    return (
        <main>
            <AdminViewHeader rightItem={
                <div>
                    <Link to='/admin/promotional-banners/create'>
                        <Button><Plus /> Add New</Button>
                    </Link>
                </div>
            } />
            <div className=""></div>
        </main>
    )
}
