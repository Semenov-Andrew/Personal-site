import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/server"

import { Button } from "./ui/button"

export const LoginButton = () => {
    return (
        <LoginLink>
            <Button>Sign-in</Button>
        </LoginLink>
    )
}
