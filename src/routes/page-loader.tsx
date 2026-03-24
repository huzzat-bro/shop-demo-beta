import PageLoader from '@/components/layouts/loader/page-loader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/page-loader')({
    component: RouteComponent,
})

function RouteComponent() {
    return <PageLoader />
}
