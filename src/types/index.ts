export interface UserProps {
    _id: string
    username: string
    email?: string
    avatar: ImageProps
}

export interface ImageProps {
    public_id?: string
    url: string
}

export interface ChatProps {
    _id: string
    isGroup?: boolean
    groupAdmin?: UserProps
    groupName?: string
    groupImg?: ImageProps
    members: UserProps[]
}

export interface MessageProps {
    _id: string
    chatId: string
    sender: UserProps
    receiverId?: string
    content: string
    readBy?: string[]
    createdAt: string
}

export interface APIResponseProps {
    success: boolean
    message?: string
}