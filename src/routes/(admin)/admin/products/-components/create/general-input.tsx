import { useFormContext, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { ProductForm } from '@/routes/(admin)/admin/products/create'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { db } from '@/lib/db'
import { id } from '@instantdb/react'

interface Props {
    onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSlugChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function GeneralInput({ onNameChange, onSlugChange }: Props) {
    const { data } = db.useQuery({ categories: {} })
    const { control, register, formState: { errors }, watch, setValue } = useFormContext<ProductForm>()
    const tags = watch('tags') || []

    const addTag = (tag: string) => {
        if (tag && !tags.includes(tag)) {
            const tagId = id();
            db.transact(
                db.tx.tags[tagId].create({ name: tag })
            )
            setValue('tags', [...tags, tagId])
        }
    }

    const removeTag = (tagToRemove: string) => {
        setValue('tags', tags.filter(t => t !== tagToRemove))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            onChange={onNameChange}
                            placeholder="e.g. Vintage Leather Jacket"
                            aria-invalid={errors.name ? 'true' : 'false'}
                        />
                        {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            {...register('slug')}
                            onChange={onSlugChange}
                            placeholder="vintage-leather-jacket"
                            aria-invalid={errors.slug ? 'true' : 'false'}
                        />
                        {errors.slug && <span className="text-sm text-red-500">{errors.slug.message}</span>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                        id="shortDescription"
                        {...register('shortDescription')}
                        rows={2}
                        placeholder="Brief summary for listing pages"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                        id="description"
                        {...register('description')}
                        rows={6}
                        placeholder="Detailed product information..."
                    />
                </div>

                <div className="space-y-2">
                    <Field orientation={'responsive'}>
                        <FieldContent>
                            <FieldLabel htmlFor='category'>Category</FieldLabel>
                        </FieldContent>
                        <Select
                            {...register('category')}
                            onValueChange={(value) => setValue('category', value)}
                            value={watch('category')}
                        >
                            <SelectTrigger id='category'>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent position='item-aligned'>
                                {
                                    data?.categories.map((cat) => (
                                        <SelectItem value={cat.id}>{cat.name}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </Field>

                </div>

                <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <div key={tag} className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                                {tag}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0"
                                    onClick={() => removeTag(tag)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a tag"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                    e.preventDefault()
                                    addTag(e.currentTarget.value)
                                    e.currentTarget.value = ''
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Controller
                            name="featured"
                            control={control}
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} id="featured" />
                            )}
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}