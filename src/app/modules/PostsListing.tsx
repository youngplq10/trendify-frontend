import React from 'react'
import NewPostForm from '../components/NewPostForm'
import Post from '../components/Post'

const PostsListing = () => {
    const example = [
        {
            username: "starzynski.dev",
            profilePicture: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
            createdAtDate: "2025-01-01 | 11:56",
            imageLink: null,
            content: "Hello, this is my first post",
        },
        {
            username: "starzynski.dev",
            profilePicture: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
            createdAtDate: "2025-01-01 | 11:56",
            imageLink: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
            content: "Hello, this is my second post",
        },
        {
            username: "gabi",
            profilePicture: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
            createdAtDate: "2025-01-01 | 11:56",
            imageLink: null,
            content: "Good morning :))))",
        },
    ]

    return (
        <>
            <div className="row border">
                <NewPostForm />
            </div>
            
            {
                example.map((post, index) => {
                    return (
                        <div className="row" key={index}>
                            <Post username={post.username} profilePicture={post.profilePicture} createdAtDate={post.createdAtDate} imageLink={post.imageLink} content={post.content} />
                        </div>    
                    )
                })
            }
        </>
    )
}

export default PostsListing
