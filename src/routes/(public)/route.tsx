import Footer from '@/components/layouts/public/Footer'
import Header from '@/components/layouts/public/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
