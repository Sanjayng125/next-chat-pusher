import { type NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/sign-in"
    },
    providers: [],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token._id = user._id;
                token.username = user.username;
                token.avatar = user.avatar;
            }
            if (trigger === "update") {
                return { ...token, ...session.user }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.avatar = token.avatar;
            }
            return session;
        },
        authorized({ auth, request }) {
            const user = auth?.user

            const isOnProfilePage = request.nextUrl?.pathname?.startsWith("/profile");
            const isOnSignInPage = request.nextUrl?.pathname?.startsWith("/sign-in");
            const isOnSignUpPage = request.nextUrl?.pathname?.startsWith("/sign-up");

            // ONLY AUTHENTICATED USERS CAN REACH PROFILE PAGE
            if ((isOnProfilePage) && !user) {
                return false;
            }

            // ONLY UNAUTHENTICATED USERS CAN REACH LOGIN PAGE
            if ((isOnSignInPage || isOnSignUpPage) && user) {
                return Response.redirect(new URL("/", request.nextUrl));
            }

            return true;
        },
    },
    secret: process.env.AUTH_SECRET as string,
}