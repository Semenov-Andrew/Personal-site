/* eslint-disable */
import { NextRequest } from "next/server"
import {
    handleAuth,
    type AuthEndpoints,
} from "@kinde-oss/kinde-auth-nextjs/server"

export function GET(
    request: NextRequest,
    { params }: { params: { kindeAuth: AuthEndpoints } }
): any {
    const endpoint = params.kindeAuth
    return handleAuth(request, endpoint)
}
