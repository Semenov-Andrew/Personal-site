import { $api } from "@/http/api";
import { Meme } from "@prisma/client";
import { AxiosResponse } from "axios";


export class MemeService{
    static async uploadMemeMetadata(url: string, title?: string):Promise<AxiosResponse<Meme>>{
        return $api.post<Meme>("memes", {imageSrc: url, title})
    }
}