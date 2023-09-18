"use client"

import { UploadButton, UploadDropzone } from "@/lib/uploadthing"
import { buttonVariants } from "@/components/ui/button"

const DashboardPage = () => {
    return (
        <div>
            <h2>Memes</h2>
            <div className="grid grid-cols-2">
                <UploadDropzone
                    appearance={{
                        uploadIcon: "w-12 h-12",
                        button: buttonVariants({ variant: "default" }),
                        container: "border-dashed p-6 min-h-[300px]",
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
                        // Do something with the response
                        console.log("Files: ", res)
                        alert("Upload Completed")
                    }}
                    onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`)
                    }}
                />
                <div></div>
            </div>
        </div>
    )
}

export default DashboardPage
