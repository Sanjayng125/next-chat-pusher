import { auth } from "@/lib/auth"
import { connectToDb } from "@/lib/db"
import { ChatModel, UserModel } from "@/lib/models"

export const DELETE = async (req: Request) => {
    const session = await auth()
    if (session?.user) {
        try {
            await connectToDb()

            const currentUser = await UserModel.findById(session.user._id)

            if (!currentUser) {
                return Response.json({ success: false, message: "User not found! Please login again." }, { status: 403 })
            }

            const { memberId, chatId } = await req.json()

            if (!memberId || !chatId) {
                return Response.json({ success: false, message: "Please fill all fields" }, { status: 400 })
            }

            await ChatModel.findByIdAndUpdate(chatId, { $pull: { members: memberId } })
            const updatedGroupChat = await ChatModel.findById(chatId).populate("members", "username email avatar.url").populate("groupAdmin", "username email avatar.url")
            if (updatedGroupChat) {
                updatedGroupChat.members = updatedGroupChat.members.filter((member: any) => member._id.toString() !== session.user._id.toString())
            }

            return Response.json({ success: true, message: "User removed!", chat: updatedGroupChat }, { status: 200 })

        } catch (error) {
            return Response.json({ success: false, message: "Something went wrong while adding user to group!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
}