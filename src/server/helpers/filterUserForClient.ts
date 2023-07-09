import {User} from "@clerk/backend";

export type FilteredUser = {
    id: string,
    username: string | null,
    firstName: string | null,
    profileImageUrl: string
}

export const filterUserForClient = (user: User):FilteredUser => {
    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        profileImageUrl: user.profileImageUrl,
    };
}