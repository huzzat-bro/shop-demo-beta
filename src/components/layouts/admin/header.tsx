import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentPath } from "@/lib/helper";
import { Link } from "@tanstack/react-router";
import type React from "react";



function formatSegment(segment: string) {
    return segment.replace(/-/g, '').replace(/\b\w/g, c => c.toUpperCase())
}


export default function AdminViewHeader({ rightItem }: { rightItem?: React.ReactNode }) {

    const pathname = useCurrentPath();
    const segments = pathname.pathname.split('/').filter(Boolean);
    let path = ''

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink asChild>
                                <Link to='/admin'>
                                    Admin
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {
                            segments.slice(1).map((segment, index) => {
                                path += `/${segment}`
                                const isLast = index === segments.length - 2
                                return (
                                    <div className="flex items-center" key={path}>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        {isLast ? (
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        ) : (
                                            <BreadcrumbItem>
                                                <BreadcrumbLink asChild>
                                                    {/* @ts-ignore */}
                                                    <Link to={`admin/${path}`}>{formatSegment(segment)}</Link>
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                        )}
                                    </div>

                                )
                            })
                        }


                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            {
                rightItem && rightItem
            }
        </header>

    )
}