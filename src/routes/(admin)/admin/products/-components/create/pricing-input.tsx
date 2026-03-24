import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProductForm } from '@/routes/(admin)/admin/products/create'

export function PricingInput() {
    const { register, formState: { errors } } = useFormContext<ProductForm>()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register('price')}
                            aria-invalid={errors.price ? 'true' : 'false'}
                        />
                        {errors.price && <span className="text-sm text-red-500">{errors.price.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                        <Input id="compareAtPrice" type="number" step="0.01" {...register('compareAtPrice')} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price ($)</Label>
                    <Input
                        id="costPrice"
                        type="number"
                        step="0.01"
                        {...register('costPrice')}
                        aria-invalid={errors.costPrice ? 'true' : 'false'}
                    />
                    {errors.costPrice && <span className="text-sm text-red-500">{errors.costPrice.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="taxClass">Tax Class</Label>
                    <Input id="taxClass" {...register('taxClass')} placeholder="Standard" />
                </div>
            </CardContent>
        </Card>
    )
}