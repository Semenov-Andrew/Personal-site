"use client"

import { useState } from "react"
import Image from "next/image"

import { UploadDropzone } from "@/lib/uploadthing"
import { buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"
import { trpc } from "@/app/_trpc/client"

const DashboardPage = () => {
    const mutation = trpc.memes.create.useMutation()
    const [uploadedImgSrc, setUploadedImgSrc] = useState("")
    const { toast } = useToast()

    if (mutation.isError) toast({ title: "Error while uploading images" })

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
                    onClientUploadComplete={(res) => {
                        toast({
                            title: "Upload Completed",
                            description: `Files: ${res
                                ?.map((file) => file.name)
                                .join(", ")}`,
                        })
                        if (res) {
                            mutation.mutate({ imageSrc: res[0].url })
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
                <div className="relative flex min-h-[200px] items-center justify-center rounded-md bg-muted lg:min-h-[300px]">
                    {mutation.isLoading ? (
                        <Spinner />
                    ) : (
                        mutation.isSuccess &&
                        uploadedImgSrc !== "" && (
                            <Image
                                height={256}
                                width={256}
                                src={uploadedImgSrc}
                                alt="uploaded img"
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
