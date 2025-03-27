export interface user {
    username: string,
    email: string,
    profilePicture: string,
    unique: string,
    newsletter: boolean,
    createdAtDate: string,
    followers: user[],
    following: user[],
    likedPosts: post[],
    likedReplies: reply[],
    replies: reply[],
}

export interface post {
    imageLink: string,
    content: string,
    unique: string,
    createdAtDate: string,
    user: user,
    replies: reply[],
    likes: user[],
}

export interface reply {
    imageLink: string,
    content: string,
    unique: string,
    createdAtDate: string,
    user: user,
    post: post,
    likes: user[],
}