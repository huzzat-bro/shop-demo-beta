import PageLoader from '@/components/layouts/loader/page-loader';
import { db } from '@/lib/db';
import { createFileRoute, useParams } from '@tanstack/react-router';
import ProductDetails from './-components/product-details';

export const Route = createFileRoute('/(public)/products/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = useParams({ from: "/(public)/products/$slug" })

  const { data, error, isLoading } = db.useQuery({
    products: {
      $: {
        where: { slug: slug }
      },
      images: {},
      tags: {},
      category: {},
      thumbnail: {}
    }
  });
  if (isLoading) return <PageLoader />
  if (error) return <div>Error: {error.message}</div>
  const product = data?.products?.[0]
  if (!product) return <div>Product not found</div>
  // @ts-ignore
  return <ProductDetails product={product} />
}
