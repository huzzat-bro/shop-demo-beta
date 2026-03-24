import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/db'
import type { File as FileType } from '@/types'
import { Check, CheckSquare2, ImageUp, Loader, Loader2, UploadCloud, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'

type GalleryViewProps = {
    selectedFile: FileType[];
    setSelectedFile: React.Dispatch<React.SetStateAction<FileType[]>>;
    selectedtype: 'single' | 'multiple'
}

export default function GalleryView({ selectedFile, setSelectedFile, selectedtype }: GalleryViewProps) {
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false);
    const { data, error, isLoading } = db.useQuery({ $files: { $: { order: { serverCreatedAt: "desc" } } } });
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploadProgress, setUploadProgress] = useState<{ total: number, completed: number }>({ total: 0, completed: 0 })

    const handleUpload = async () => {
        if (!files.length) return;
        setLoading(true);
        setUploadProgress({ total: files.length, completed: 0 });
        for (let i = 0; i < files.length; i++) {
            await db.storage.uploadFile(`products/${Date.now()}-${files[i].name}`, files[i]);
            setUploadProgress((prev) => ({ ...prev, completed: prev.completed + 1 }));
        }
        setLoading(false);
        setFiles([]);
        setUploadProgress({ total: 0, completed: 0 });
        toast.success("Files uploaded successfully");
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFiles(Array.from(e.target.files));
    }

    const removeFile = (name: string) => {
        setFiles((prev) => prev.filter((file) => file.name !== name))
    }

    if (error) {
        console.log(error);
        return;
    }
    return (
        <DialogContent className='min-w-[calc(100%-4rem)] min-h-[calc(100%-4rem)] flex-1 flex flex-col'>
            <DialogHeader>
                <DialogTitle>Media Upload</DialogTitle>
            </DialogHeader>

            <main
                className='-mx-4 grow no-scrollbar max-h-screen overflow-y-auto px-4'
            >

                <Tabs defaultValue='gallery'>
                    <TabsList>
                        <TabsTrigger value='gallery'>Gallery</TabsTrigger>
                        <TabsTrigger value='upload'>Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value='gallery'>
                        {
                            isLoading ? (
                                <Loader2 className='animate-spin' />
                            )
                                : (
                                    <div className="grid max-h-128 md:max-h-96 grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-2 overflow-y-auto">
                                        {
                                            data?.$files.map((file) => (
                                                <div
                                                    key={file.id}
                                                    onClick={() => {
                                                        const current = selectedFile;
                                                        const multiple = selectedtype === "multiple";
                                                        if (multiple) {
                                                            if (current.some(f => f.id === file.id)) {
                                                                setSelectedFile(current.filter(f => f.id !== file.id))
                                                            } else {
                                                                setSelectedFile(prev => ([...prev, file]));
                                                            }
                                                        } else {
                                                            setSelectedFile([file]);
                                                        }
                                                    }}
                                                    className={`relative cursor-pointer border-2 aspect-square object-cover ${selectedFile.some(f => f.id === file.id) ? 'border-green-700' : 'border-none'}`}
                                                >
                                                    {selectedFile.some(f => f.id === file.id) && <CheckSquare2 className='text-blue-600 absolute top-0 right-0' />}
                                                    <img src={file.url} className='w-full h-full object-cover' alt={file.id} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                        }
                    </TabsContent>
                    <TabsContent value='upload'>
                        <Input ref={inputRef} onChange={handleFileChange} id='file-upload' hidden multiple accept='image/*' type='file' placeholder='Select files' />
                        <Label
                            className='border p-6 text-center border-dashed flex items-center justify-center cursor-pointer'
                            htmlFor='file-upload'>
                            <ImageUp />
                            Upload
                        </Label>

                        {
                            files && (
                                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 md:max-h-64 max-h-96 overflow-auto gap-3 mt-3">
                                    {
                                        Array.from(files).map((file) => (
                                            <div className="relative" key={file.name}>
                                                <img src={URL.createObjectURL(file)} className='aspect-square object-cover' alt="Image" />
                                                <Button onClick={() => removeFile(file.name)} variant={'destructive'} size={'icon-sm'} className='absolute top-0 right-0'><X /></Button>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }


                    </TabsContent>
                </Tabs>


            </main>
            <DialogFooter className='md:flex-row md:items-center md:justify-between gap-6'>
                {
                    uploadProgress.total !== 0 && (
                        <div className="max-w-md">
                            <Label htmlFor='progress' className='pb-2'>Upload Progress ({uploadProgress.completed}/{uploadProgress.total})</Label>
                            <Progress id='progress' value={Math.round((uploadProgress.completed / uploadProgress.total) * 100)} />
                        </div>
                    )
                }



                <div className="flex items-center">
                    {
                        files.length > 0 && (
                            <Button
                                disabled={loading}
                                onClick={handleUpload}
                            >
                                {loading ? <> Uploading.. <Loader className='animate-spin' /></> : <> Upload <UploadCloud /></>}
                            </Button>

                        )
                    }
                    <DialogClose asChild>
                        <Button type='button' variant={'secondary'}>Close <X /></Button>
                    </DialogClose>
                    {
                        selectedFile.length > 0 && (
                            <DialogClose asChild>
                                <Button type='button' variant={'default'}>OK <Check /></Button>
                            </DialogClose>
                        )
                    }
                </div>
            </DialogFooter>
        </DialogContent>
    )
}
