"use client"

import { UploadButton } from "@/lib/uploadthing"
import { buttonVariants } from "@/components/ui/button"

const DashboardPage = () => {
    return (
        <div>
            <UploadButton
                appearance={{
                    button: buttonVariants({ variant: "default" }),
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
        </div>
    )
}

export default DashboardPage
