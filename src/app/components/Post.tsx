import React from 'react'

const Post = (
    { username, profilePicture, imageLink, content, createdAtDate, countLikes, countReplies, isAlreadyLiked, unique, isUserLogged } 
    :
    { username: string, profilePicture: string | null, imageLink: string | null, unique: string, isUserLogged: boolean, content: string, createdAtDate: string, countLikes: number, countReplies: number, isAlreadyLiked: boolean } ) => {
    
    return (
        <div>
            {username}
        </div>
    )
}

export default Post
