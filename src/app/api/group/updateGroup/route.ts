import { auth } from "@/lib/auth"
import { connectToDb } from "@/lib/db"
import { ChatModel, UserModel } from "@/lib/models"
import { UserProps } from "@/types"
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Update group chat name
export const PATCH = async (req: Request) => {
    const session = await auth()

    if (session?.user) {
        try {
            await connectToDb()

            const currentUser = await UserModel.findById(session.user._id)

            if (!currentUser) {
                return Response.json({ success: false, message: "User not found! Please login again." }, { status: 403 })
            }

            const { chatId, groupName, groupImg } = await req.json()

            const updates: { groupName: string, groupImg?: { public_id: string, url: string } } = { groupName }

            if (!chatId || (!groupName && !groupImg)) {
                return Response.json({ success: false, message: "Please fill all fields" }, { status: 400 })
            }

            const currentGroupChat = await ChatModel.findById(chatId)

            if (groupName.length < 3) {
                return Response.json({ success: false, message: "Group name should be atleast 2 characters long" }, { status: 400 })
            }

            if (groupImg) {
                const res = await cloudinary.uploader.upload(groupImg, {
                    folder: `next-chat-app/groups/${chatId.toString()}${groupName}/avatar`
                });

                if (res?.secure_url) {
                    updates.groupImg = {
                        public_id: res.public_id,
                        url: res.secure_url
                    };

                    // Destroy the previous image after a successful upload
                    if (currentGroupChat.groupImg.public_id !== "null" || currentGroupChat.groupImg.public_id) {
                        await cloudinary.uploader.destroy(currentGroupChat.groupImg.public_id);
                    }
                } else {
                    return Response.json({ success: false, message: "Error uploading group photo" }, { status: 500 });
                }
            }

            await ChatModel.findOneAndUpdate({ _id: chatId }, { ...updates }).populate("members", "username email avatar.url")
            const updatedGroupChat = await ChatModel.findById(chatId).populate("members", "username email avatar.url").populate("groupAdmin", "username email avatar.url")
            if (updatedGroupChat) {
                updatedGroupChat.members = updatedGroupChat.members.filter((member: UserProps) => member._id.toString() !== session.user._id.toString())
            }

            return Response.json({ success: true, message: "Group updated successfully!", chat: updatedGroupChat }, { status: 200 })
        } catch (error) {
            return Response.json({ success: false, message: "Something went wrong while updating chat!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
}