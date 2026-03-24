import GalleryView from "@/components/media-gallery"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import type { File } from "@/types"
import { Image, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import type { ProductForm } from "@/routes/(admin)/admin/products/create"

export function ImageInput() {
    const [productGallery, setProductGallery] = useState<File[]>([])
    const [productThumbnail, setProductThumbnail] = useState<File[]>([])
    const { setValue, trigger } = useFormContext<ProductForm>()

    // Update Form: Thumbnail
    useEffect(() => {
        if (productThumbnail.length > 0) {
            setValue("thumbnail", productThumbnail[0].id, { shouldValidate: true })
        } else {
            setValue("thumbnail", "", { shouldValidate: true })
        }
    }, [productThumbnail, setValue])

    // Update Form: Gallery Images
    useEffect(() => {
        const imageIds = productGallery.map((file) => file.id)
        setValue("images", imageIds, { shouldValidate: true })
    }, [productGallery, setValue])

    const handleRemoveGalleryImage = useCallback(
        (fileId: string) => {
            setProductGallery((prev) => prev.filter((f) => f.id !== fileId))
        },
        []
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Thumbnail</CardTitle>
                    <CardDescription>Select your product thumbnail.</CardDescription>
                </CardHeader>
                <CardContent>
                    {productThumbnail.length > 0 ? (
                        <img
                            src={productThumbnail[0].url}
                            alt={productThumbnail[0].id}
                            className="w-full h-full object-cover rounded-md"
                        />
                    ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500 rounded-md">
                            No thumbnail selected
                        </div>
                    )}
                </CardContent>
                <CardFooter className="justify-end">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button type="button">
                                <Image className="mr-2 h-4 w-4" />
                                Open Gallery
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <GalleryView
                                selectedtype="single"
                                selectedFile={productThumbnail}
                                setSelectedFile={setProductThumbnail}
                            />
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Product Gallery</CardTitle>
                    <CardDescription>Select your product gallery images</CardDescription>
                </CardHeader>
                <CardContent>
                    {productGallery.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {productGallery.map((file) => (
                                <div className="relative" key={file.id}>
                                    <img
                                        src={file.url}
                                        alt={file.id}
                                        className="aspect-square w-full object-cover rounded-md"
                                    />
                                    <Button
                                        onClick={() => handleRemoveGalleryImage(file.id)}
                                        type="button"
                                        variant="destructive"
                                        size="icon-sm"
                                        className="absolute top-1 right-1 cursor-pointer h-6 w-6 p-0"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-500 rounded-md">
                            No images selected
                        </div>
                    )}
                </CardContent>
                <CardFooter className="justify-end">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button type="button">
                                <Image className="mr-2 h-4 w-4" />
                                Open Gallery
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <GalleryView
                                selectedtype="multiple"
                                selectedFile={productGallery}
                                setSelectedFile={setProductGallery}
                            />
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </div>
    )
}