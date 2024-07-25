export const getChat = async (id: string) => {
    const res = await fetch(`/api/chat`, {
        method: "POST",
        body: JSON.stringify({ userId: id })
    })
    const data = await res.json()

    return data
}

export const getMyChats = async () => {
    const res = await fetch(`/api/chat`)
    const data = await res.json()

    return data
}

export const updateProfile = async (username: string, email: string, password: string | null, image: any) => {
    const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            email,
            password,
            image,
        }),
    });

    const data = await res.json()
    return data
}

export const createGroup = async (groupName: string, members: string[]) => {
    const res = await fetch(`/api/group`, {
        method: "POST",
        body: JSON.stringify({ members, groupName })
    })
    const data = await res.json()

    return data
}

export const removeMember = async (chatId: string, memberId: string) => {
    const res = await fetch(`/api/group/removeFromGroup`, {
        method: "DELETE",
        body: JSON.stringify({ chatId, memberId })
    })
    const data = await res.json()

    return data
}

export const addMember = async (chatId: string, memberId: string) => {
    const res = await fetch(`/api/group/addToGroup`, {
        method: "POST",
        body: JSON.stringify({ chatId, memberId })
    })
    const data = await res.json()

    return data
}

export const deleteGroupChat = async (chatId: string) => {
    const res = await fetch(`/api/group`, {
        method: "DELETE",
        body: JSON.stringify({ chatId })
    })
    const data = await res.json()

    return data
}

export const getMessages = async (chatId: string) => {
    const res = await fetch(`/api/message/${chatId}`)
    const data = await res.json()

    return data
}

export const sendMessage = async (chatId: string, message: string) => {
    const res = await fetch(`/api/message`, {
        method: "POST",
        body: JSON.stringify({ chatId, message })
    })
    const data = await res.json()

    return data
}