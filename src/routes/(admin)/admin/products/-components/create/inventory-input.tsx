import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProductForm } from '@/routes/(admin)/admin/products/create'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function InventoryInput() {
    const { register, formState: { errors } } = useFormContext<ProductForm>()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                            id="sku"
                            {...register('sku')}
                            aria-invalid={errors.sku ? 'true' : 'false'}
                        />
                        {errors.sku && <span className="text-sm text-red-500">{errors.sku.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="barcode">Barcode (ISBN, UPC, etc.)</Label>
                        <Input id="barcode" {...register('barcode')} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Quantity in Stock</Label>
                    <Input
                        id="stock"
                        type="number"
                        {...register('stock')}
                        aria-invalid={errors.stock ? 'true' : 'false'}
                    />
                    {errors.stock && <span className="text-sm text-red-500">{errors.stock.message}</span>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input id="weight" type="number" step="0.01" {...register('weight')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="length">Length (cm)</Label>
                        <Input id="length" type="number" step="0.1" {...register('length')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (cm)</Label>
                        <Input id="width" type="number" step="0.1" {...register('width')} />
                    </div>
                </div>
                <div className="space-y-2">
                    {/* <div className="flex items-center">
                        <div className="space-y-2">
                            <Label htmlFor='inventory-name'>Inventory Name</Label>
                            <Input id='inventory-name' placeholder='Name' />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor='value'>Inventory Value</Label>
                            <Input id='value' placeholder='Value' />
                        </div>
                    </div> */}
                    <Button disabled type='button'><Plus />Add New Inventory</Button>
                </div>
            </CardContent>
        </Card>
    )
}