import { connectToDb } from "@/lib/db";
import { UserModel } from "@/lib/models";
import { encPassword } from "@/lib/lib";

export const POST = async (req: Request) => {
    try {
        await connectToDb()

        const { username, email, password } = await req.json()

        if (!username || !email || !password) {
            return Response.json({ success: false, message: "All fields are required!" }, { status: 400 })
        }

        const userExists = await UserModel.findOne({ email })

        if (userExists) {
            return Response.json({ success: false, message: "Email already taken!" }, { status: 200 })
        }

        const hashedPassword = await encPassword(password);

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword
        })

        const saveUser = await newUser.save()

        if (!saveUser) {
            return Response.json({ success: false, message: "Something went wrong while register!" }, { status: 500 })
        }

        return Response.json({ success: true, message: "User Registered" }, { status: 201 })
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Something went wrong while register!" }, { status: 500 })
    }
}