import { auth } from "@/lib/auth"
import { connectToDb } from "@/lib/db"
import { ChatModel, MessageModel, UserModel } from "@/lib/models"
import { pusherServer } from "@/lib/pusher"

export const POST = async (req: Request) => {
    const session = await auth()

    if (session?.user) {
        try {
            await connectToDb()

            const currentUser = await UserModel.findById(session.user._id)

            if (!currentUser) {
                return Response.json({ success: false, message: "User not found! Please login again." }, { status: 403 })
            }

            const { chatId, message } = await req.json()

            if (!chatId || !message) {
                return Response.json({ success: false, message: "Please fill all fields" }, { status: 400 })
            }

            const chat = await ChatModel.findOne({ _id: chatId, members: { $elemMatch: { $eq: session.user._id } } }).populate("members", "username")

            if (!chat) {
                return Response.json({ success: false, message: "Chat not found!" }, { status: 404 })
            }

            const newMessage = new MessageModel({
                chatId,
                sender: session.user._id,
                content: message,
            })

            await newMessage.save()

            if (newMessage) {
                const fullMessage = await MessageModel.findOne({ _id: newMessage._id }).populate("sender", "username avatar.url")

                const finalMessage = {
                    ...fullMessage.toObject(),
                    users: chat.members
                }

                await pusherServer.trigger(`newMessage-${chatId}`, "incoming-message", finalMessage)
                await pusherServer.trigger(`notification`, "newMessage", finalMessage)

                return Response.json({ success: true, message: "Sent", newMessage: finalMessage }, { status: 200 })
            }

            return Response.json({ success: false, message: "Something went wrong while sending message!" }, { status: 500 })
        } catch (error) {
            return Response.json({ success: false, message: "Something went wrong while sending message!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
}