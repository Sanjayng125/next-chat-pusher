import { auth } from "@/lib/auth"
import { connectToDb } from "@/lib/db"
import { ChatModel, UserModel } from "@/lib/models"
import { UserProps } from "@/types"

export const POST = async (req: Request) => {
    const session = await auth()

    if (session?.user) {
        try {
            await connectToDb()

            const currentUser = await UserModel.findById(session.user._id)

            if (!currentUser) {
                return Response.json({ success: false, message: "User not found! Please login again." }, { status: 403 })
            }

            const { userId } = await req.json()

            if (!userId) {
                return Response.json({ success: false, message: "User ID is required" }, { status: 400 })
            }

            //check if chat exists with same members
            let chatExists = await ChatModel.find({
                isGroup: false,
                $and: [
                    { members: { $elemMatch: { $eq: session.user._id } } },
                    { members: { $elemMatch: { $eq: userId } } }
                ]
            }).populate("members", "username email avatar.url")

            if (chatExists.length > 0) {
                // const filteredChat =
                chatExists[0].members = chatExists[0].members.filter((member: UserProps) => member._id.toString() !== session.user._id.toString())
                return Response.json({ success: true, message: "", chat: chatExists[0] }, { status: 200 })
            }

            const newChat = await ChatModel.create({
                members: [session.user._id, userId]
            })

            let newChatCreated = await ChatModel.findOne({ _id: newChat._id }).populate("members", "username email avatar.url")

            if (newChatCreated) {
                // const filteredChat = 
                newChatCreated.members = newChatCreated.members.filter((member: UserProps) => member._id.toString() !== session.user._id.toString())
                return Response.json({ success: true, message: "", chat: newChatCreated }, { status: 200 })
            }
            return Response.json({ success: true, message: "", chat: newChatCreated }, { status: 200 })

        } catch (error) {
            return Response.json({ success: false, message: "Something went wrong while creating chat!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
}

export const GET = async () => {
    const session = await auth()

    if (session?.user) {
        try {
            await connectToDb()

            const currentUser = await UserModel.findById(session.user._id)

            if (!currentUser) {
                return Response.json({ success: false, message: "User not found! Please login again." }, { status: 403 })
            }

            const chats = await ChatModel.find({
                members: { $elemMatch: { $eq: session.user._id } }
            }).populate("members", "username email avatar.url").populate("groupAdmin", "username email avatar.url").sort({ updatedAt: -1 })

            if (chats.length > 0) {
                const filteredChats = chats.map(chat => {
                    const filteredMembers = chat.members.filter((member: UserProps) => member._id.toString() !== session.user._id.toString());
                    return {
                        ...chat.toObject(),
                        members: filteredMembers
                    }
                });

                return Response.json({ success: true, message: "", chats: filteredChats }, { status: 200 })
            }

            return Response.json({ success: true, message: "", chats: [] }, { status: 200 })
        } catch (error) {
            return Response.json({ success: false, message: "Something went wrong while fetching chats!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
}