"use client"

import Image from "next/image"
import { $api } from "@/http/api"
import { Meme } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"

import { UploadDropzone } from "@/lib/uploadthing"
import { buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

const DashboardPage = () => {
    const mutation = useMutation({
        mutationFn: ({url, title}: {url: string, title?: string}) => {
            return $api.post<Meme>("memes", {imageSrc: url, title})
        }
    })
    const [uploadedImgSrc, setUploadedImgSrc] = useState("")
    const { toast } = useToast()
    if(mutation.isError) toast({title: "Error while uploading images"})

    return (
        <div>
            <h2>Memes</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <UploadDropzone
                    appearance={{
                        uploadIcon: "w-12 h-12",
                        button: buttonVariants({ variant: "default" }),
                        container:
                            "border-dashed p-6 lg:min-h-[300px] min-h-[200px] mt-0 border-2",
                    }}
                    content={{
                        button({ ready, isUploading }) {
                            if (isUploading) return <div>Uploading...</div>
                            if (ready) return <div>Upload stuff</div>
                            return "Getting ready..."
                        },
                    }}
                    endpoint="imageUploader"
                    onClientUploadComplete={async (res) => {
                        toast({
                            title: "Upload Completed",
                            description: `Files: ${res
                                ?.map((file) => file.name)
                                .join(", ")}`,
                        })
                        if(res){
                            await mutation.mutateAsync({url: res[0].url})
                            setUploadedImgSrc(res[0].url)
                        } 
                    }}
                    onUploadError={(error: Error) => {
                        toast({
                            variant: "destructive",
                            title: "Error",
                            description: error.message,
                        })
                    }}
                />
                <div className="relative flex items-center justify-center rounded-md bg-muted lg:min-h-[300px] min-h-[200px]">
                    {mutation.isLoading
                        ? <Spinner/>
                        : mutation.isSuccess && uploadedImgSrc !== "" && <Image height={256} width={256} src={uploadedImgSrc} alt="uploaded img"/>
                    }
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
