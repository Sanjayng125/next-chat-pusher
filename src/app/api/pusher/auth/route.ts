import { auth } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher"

export const POST = async (req: Request) => {
    const session = await auth()

    if (!session?.user.email) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 })
    }

    const body = await req.text();

    const [socketId, channelName] = body
        .split("&")
        .map((str) => str.split("=")[1]);
    const data = {
        user_id: session.user.email,
    }

    const authResponse = await pusherServer.authorizeChannel(socketId, channelName, data)

    return new Response(JSON.stringify(authResponse));
}