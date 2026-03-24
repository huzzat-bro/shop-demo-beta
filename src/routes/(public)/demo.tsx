import PageLoader from '@/components/layouts/loader/page-loader';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/demo')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data, canLoadNextPage, loadNextPage, isLoading, error } =
        db.useInfiniteQuery({

        });

    if (isLoading) {
        return <PageLoader />;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-2 gap-4  md:grid-cols-4">
            </div>
            {canLoadNextPage && (
                <Button onClick={loadNextPage} className='w-full mt-6'>Load More</Button>
            )}



        </div>
    );
}

