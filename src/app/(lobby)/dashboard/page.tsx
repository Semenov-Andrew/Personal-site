"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import { buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const DashboardPage = () => {
    const { toast } = useToast()
    return (
        <div>
            <h2>Memes</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <UploadDropzone
                    appearance={{
                        uploadIcon: "w-12 h-12",
                        button: buttonVariants({ variant: "default" }),
                        container:
                            "border-dashed p-6 min-h-[300px] mt-0 border-2",
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
                    }}
                    onUploadError={(error: Error) => {
                        toast({
                            variant: "destructive",
                            title: "Error",
                            description: error.message,
                        })
                    }}
                />
                <div className="rounded-md bg-muted">
                    {/* <Button
                        onClick={() => {
                            toast({
                                title: "Scheduled: Catch up",
                                description:
                                    "Friday, February 10, 2023 at 5:57 PM",
                            })
                        }}
                    >
                        Show toast
                    </Button> */}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
