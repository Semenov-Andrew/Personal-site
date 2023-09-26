import { currentUser } from "@clerk/nextjs"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            // This code runs on your server before upload
            const user = await currentUser()

            // Throw if user isn't signed in
            if (user?.publicMetadata.role !== "admin")
                throw new Error("You must be an admin to upload a picture")

            // Return userId to be used in onUploadComplete
            return { userId: user.id }
        })
        .onUploadComplete(({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId)

            console.log("file url", file.url)
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
