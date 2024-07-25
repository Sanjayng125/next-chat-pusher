import 'next-auth'
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt" // can remove this.

// Declaring Next auth session to add extra fields id and username for typescript.
declare module "next-auth" {
    interface User {
        _id: string
        username: string
        email: string,
        avatar: {
            public_id: string | null
            url: string
        }
    }
    interface Session {
        user: {
            _id: string
            username: string
            email: string,
            avatar: {
                public_id: string | null
                url: string
            }
        } & DefaultSession["user"]
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id: string
        username: string
        email: string,
        avatar: {
            public_id: string | null
            url: string
        }
    }
}