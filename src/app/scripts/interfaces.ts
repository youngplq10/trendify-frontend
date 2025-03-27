export interface user {
    username: string,
    email: string,
    profilePicture: string,
    unique: string,
    newsletter: boolean,
    createdAtDate: Date,
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
    createdAtDate: Date,
    user: user,
    replies: reply[],
    likes: user[],
}

export interface reply {
    imageLink: string,
    content: string,
    unique: string,
    createdAtDate: Date,
    user: user,
    post: post,
    likes: user[],
}