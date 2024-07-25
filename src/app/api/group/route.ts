import { auth } from "@/lib/auth"
import { connectToDb } from "@/lib/db"
import { ChatModel, UserModel } from "@/lib/models"

// Create a new group chat
export const POST = async (req: Request) => {
    const session = await auth()

    if (session?.user) {
        try {
            await connectToDb()

            const currentUser = await UserModel.findById(session.user._id)

            if (!currentUser) {
                return Response.json({ success: false, message: "User not found! Please login again." }, { status: 403 })
            }

            const { members, groupName } = await req.json()

            if (!members || !groupName) {
                return Response.json({ success: false, message: "Please fill all fields" }, { status: 400 })
            }
            if (members.length < 2) {
                return Response.json({ success: false, message: "More than 2 members are required to create a group" }, { status: 400 })
            }

            const newGroupChat = await ChatModel.create({
                isGroup: true,
                groupAdmin: session.user._id,
                groupName,
                members: [session.user._id, ...members]
            })

            const newGroupChatCreated = await ChatModel.findOne({ _id: newGroupChat._id }).populate("members", "username email avatar.url")

            return Response.json({ success: true, message: "Group created successfully!", chat: newGroupChatCreated }, { status: 200 })

        } catch (error) {
            return Response.json({ success: false, message: "Something went wrong while creating chat!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
}

// Delete a group chat
export const DELETE = async (req: Request) => {
    const session = await auth()

    if (session?.user) {
        try {
            await connectToDb()

            const currentUser = await UserModel.findById(session.user._id)

            if (!currentUser) {
                return Response.json({ success: false, message: "User not found! Please login again." }, { status: 403 })
            }

            const { chatId } = await req.json()

            if (!chatId) {
                return Response.json({ success: false, message: "Group chat id is required" }, { status: 400 })
            }

            const chatToDelete = await ChatModel.findOne({ _id: chatId }).populate("groupAdmin", "username")

            if (!chatToDelete) {
                return Response.json({ success: false, message: "Group chat not found" }, { status: 404 })
            }
            if (chatToDelete.isGroup) {
                if (chatToDelete.groupAdmin._id.toString() !== session.user._id.toString()) {
                    return Response.json({ success: false, message: "You are not the admin of this group chat" }, { status: 401 })
                }
                const chatDeleted = await ChatModel.deleteOne({ _id: chatId })
                if (!chatDeleted) {
                    return Response.json({ success: false, message: "Something went wrong while deleting chat!" }, { status: 500 })
                }
                return Response.json({ success: true, message: "Group chat deleted successfully!" }, { status: 200 })
            }
        } catch (error) {
            return Response.json({ success: false, message: "Something went wrong while deleting group chat!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
}