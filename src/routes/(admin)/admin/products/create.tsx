// create.tsx
import AdminViewHeader from '@/components/layouts/admin/header'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowUp, Loader2, X } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { GeneralInput } from './-components/create/general-input'
import { ImageInput } from './-components/create/image-input'
import { InventoryInput } from './-components/create/inventory-input'
import { PricingInput } from './-components/create/pricing-input'
import { db } from '@/lib/db'
import { id } from '@instantdb/react'

export interface ProductForm {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  tags?: string[];
  status: "active" | "draft" | "archived";
  featured: boolean;
  price?: number;
  costPrice?: number;
  weight?: number;
  sku: string;
  barcode?: string;
  brand?: string;
  stock?: number;
  type: string;
  taxClass?: string;
  metaTitle?: string;
  metaDescription?: string;
  height?: number;
  width?: number;
  length?: number;
  compareAtPrice?: number;
  thumbnail: string; // now an ID, not a URL
  images: string[]; // array of IDs
}

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["active", "draft", "archived"]),
  featured: z.boolean().default(false),

  // Numeric fields: optional numbers, validated with preprocess
  price: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().min(0, "Price must be positive").optional()
  ),
  costPrice: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().min(0, "Cost price must be positive").optional()
  ),
  weight: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().min(0, "Weight must be positive").optional()
  ),
  stock: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().min(0, "Stock cannot be negative").optional()
  ),
  height: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().optional()
  ),
  width: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().optional()
  ),
  length: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().optional()
  ),
  compareAtPrice: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().optional()
  ),

  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  type: z.string().default("simple"),
  taxClass: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),

  // Changed: thumbnail and images are IDs (strings), no URL validation
  thumbnail: z.string().min(1, "Thumbnail is required"),
  images: z.array(z.string()).default([]),
}) satisfies z.ZodType<ProductForm>;

export const Route = createFileRoute('/(admin)/admin/products/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      category: '',
      tags: [],
      status: 'draft',
      featured: false,
      price: undefined,
      costPrice: undefined,
      weight: undefined,
      sku: '',
      barcode: '',
      brand: '',
      stock: undefined,
      type: 'simple',
      taxClass: '',
      metaTitle: '',
      metaDescription: '',
      height: undefined,
      width: undefined,
      length: undefined,
      compareAtPrice: undefined,
      thumbnail: '',
      images: []
    },
  })

  const { isSubmitting } = form.formState

  // Track if slug was manually edited
  let slugEdited = false

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    form.setValue('name', name)

    // Auto-generate slug only if not manually edited
    const autoSlug = name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')

    if (!slugEdited) {
      form.setValue('slug', autoSlug)
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    slugEdited = true
    form.setValue('slug', e.target.value)
  }

  const onSubmit = async (data: ProductForm) => {
    try {
      // Remove undefined properties to avoid sending them to InstantDB
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      )

      await db.transact(
        db.tx.products[id()].update({
          barcode: cleanedData.barcode,
          costPrice: cleanedData.costPrice,
          createdAt: new Date(),
          description: cleanedData.description,
          featured: cleanedData.featured,
          name: cleanedData.name,
          price: cleanedData.price,
          shortDescription: cleanedData.shortDescription,
          sku: cleanedData.sku,
          slug: cleanedData.slug,
          status: cleanedData.status,
          weight: cleanedData.weight,
          brand: cleanedData.brand,
          height: cleanedData.height,
          length: cleanedData.length,
          width: cleanedData.width,
          metaTitle: cleanedData.metaTitle,
          compareAtPrice: cleanedData.compareAtPrice,
          metaDescription: cleanedData.metaDescription,
          stock: cleanedData.stock,
          taxClass: cleanedData.taxClass,
          type: cleanedData.type,
          updatedAt: new Date()
        }).link({
          thumbnail: cleanedData.thumbnail,
          category: cleanedData.category,
          images: cleanedData.images,
          tags: cleanedData.tags
        })
      )

      toast.success('Product created successfully')
      form.reset()
      navigate({ to: '/admin/products' })
    } catch (error) {
      console.error('Product creation failed:', error)
      toast.error('Failed to create product. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50">
      <AdminViewHeader />
      <div className="w-full max-w-7xl mx-auto p-6 pb-24">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <GeneralInput
                  onNameChange={handleNameChange}
                  onSlugChange={handleSlugChange}
                />
                <ImageInput />
              </div>
              <div className="space-y-6">
                <PricingInput />
                <InventoryInput />
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t p-4 shadow-lg z-50">
              <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
                <Button
                  type='button'
                  variant={'ghost'}
                  onClick={() => navigate({ to: '/admin/products' })}
                  disabled={isSubmitting}
                >
                  Cancel
                  <X className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className="min-w-30"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Create Product
                      <ArrowUp className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  )
}