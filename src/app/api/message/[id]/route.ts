import { auth } from "@/lib/auth"
import { connectToDb } from "@/lib/db"
import { ChatModel, MessageModel, UserModel } from "@/lib/models"

export const GET = async (_req: Request, { params }: { params: { id: string } }) => {
    const session = await auth()

    if (session?.user) {
        try {
            await connectToDb()

            const currentUser = await UserModel.findById(session.user._id)

            if (!currentUser) {
                return Response.json({ success: false, message: "User not found! Please login again." }, { status: 403 })
            }

            const chatId = params.id

            const chat = await ChatModel.findOne({ _id: chatId, members: { $elemMatch: { $eq: session.user._id } } })

            if (!chat) {
                return Response.json({ success: false, message: "Chat not found!" }, { status: 404 })
            }

            const messages = (await MessageModel.find({ chatId }).sort({ createdAt: 1 }).populate("sender", "username avatar.url"))

            return Response.json({ success: true, message: "", messages }, { status: 200 })
        } catch (error) {
            return Response.json({ success: false, message: "Something went wrong while fetching messages!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
}