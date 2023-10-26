import Image from "next/image"

export const MemeImage = ({ imageSrc }: { imageSrc: string }) => {
    return (
        <div className="flex flex-1 items-center justify-center bg-muted sm:rounded-lg lg:px-4 lg:py-2">
            <div className="relative min-h-[420px] flex-1">
                <Image
                    src={imageSrc}
                    fill
                    alt="meme"
                    className="w-full"
                    style={{ objectFit: "contain" }}
                />
            </div>
        </div>
    )
}
