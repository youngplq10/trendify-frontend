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
    bio: string,
    followersCount: number,
    followingCount: number,
}

export interface post {
    imageLink: string,
    content: string,
    unique: string,
    createdAtDate: string,
    user: user,
    replies: reply[],
    likes: user[],
    likeCount: number,
    replyCount: number,
}

export interface reply {
    imageLink: string,
    content: string,
    unique: string,
    createdAtDate: string,
    user: user,
    post: post,
    likes: user[],
    countLikes: number,
}