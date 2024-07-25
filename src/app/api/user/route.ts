import { auth } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import { UserModel } from "@/lib/models";
import { NextRequest } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { encPassword } from "@/lib/lib";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Search users
export const GET = async (req: NextRequest) => {
    const session = await auth()

    if (session?.user) {
        try {
            await connectToDb()

            const currentUser = await UserModel.findById(session.user._id)

            if (!currentUser) {
                return Response.json({ success: false, message: "User not found! Please login again." }, { status: 401 })
            }

            const queryParams = req.nextUrl.searchParams
            const searchQuery = queryParams.get("search") || ""

            if (searchQuery === "") {
                const users = await UserModel.find({ _id: { $ne: session.user._id }, }).select("username avatar.url")
                return Response.json({ success: true, message: "", users }, { status: 200 })
            }

            const users = await UserModel.find({
                _id: { $ne: session.user._id },
                $or: [
                    { username: { $regex: searchQuery, $options: 'i' } },
                    { email: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
                ]
            }).select("username avatar.url")

            return Response.json({ success: true, message: "", users }, { status: 200 })
        } catch (error) {
            return Response.json({ success: false, message: "Something went wrong while searching users!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
}

// Update user profile
export const PATCH = async (req: Request) => {
    const session = await auth();

    if (!session?.user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { username, email, password, image } = await req.json();

    try {
        await connectToDb();

        const currentUser = await UserModel.findById(session.user._id);

        if (!currentUser) {
            return Response.json({ success: false, message: "User not found! Please login again." }, { status: 403 });
        }

        const updates: { username?: string, email?: string, password?: string, avatar?: { public_id: string, url: string } } = { username, email };

        // password update
        if (password) {
            updates.password = await encPassword(password);
        }

        // avatar update
        if (image) {
            const res = await cloudinary.uploader.upload(image, {
                folder: `next-chat-app/${session.user.email}/avatar`
            });

            if (res?.secure_url) {
                updates.avatar = {
                    public_id: res.public_id,
                    url: res.secure_url
                };

                // Destroy the previous image after a successful upload
                if (currentUser.avatar.public_id !== "null" || currentUser.avatar.public_id) {
                    await cloudinary.uploader.destroy(currentUser.avatar.public_id);
                }
            } else {
                return Response.json({ success: false, message: "Error uploading profile photo" }, { status: 500 });
            }
        }

        await UserModel.findByIdAndUpdate(session.user._id, updates);

        const updatedUser = await UserModel.findById(session.user._id).select("username email avatar");
        return Response.json({ success: true, message: "Profile updated", user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Something went wrong!" }, { status: 500 });
    }
};
