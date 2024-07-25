import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        public_id: { type: String, default: "null" },
        url: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" }
    },
}, { timestamps: true })

const chatSchema = new mongoose.Schema({
    isGroup: {
        type: Boolean,
        default: false
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    groupName: {
        type: String,
        trim: true,
    },
    groupImg: {
        public_id: { type: String, default: "null" },
        url: { type: String, default: "https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_1280.png" }
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}, { timestamps: true });

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
        },
    },
    { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema)
export const ChatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema)
export const MessageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)