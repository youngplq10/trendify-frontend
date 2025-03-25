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
            countLikes: 1,
            countReplies: 70,
        },
        {
            username: "starzynski.dev",
            profilePicture: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
            createdAtDate: "2025-01-01 | 11:56",
            imageLink: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
            content: "Hello, this is my second post",
            countLikes: 250,
            countReplies: 55,
        },
        {
            username: "gabi",
            profilePicture: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
            createdAtDate: "2025-01-01 | 11:56",
            imageLink: null,
            content: "Good morning :))))",
            countLikes: 20,
            countReplies: 5,
        },
    ]

    return (
        <>    
            <section className="row justify-content-center my-2">
                <NewPostForm />
            </section>
            {
                example.map((post, index) => {
                    return (
                        <section className="row justify-content-center my-2" key={index}>
                            <Post 
                                username={post.username} 
                                profilePicture={post.profilePicture} 
                                createdAtDate={post.createdAtDate} 
                                imageLink={post.imageLink} 
                                content={post.content} 
                                countLikes={post.countLikes}
                                countReplies={post.countReplies}
                            />
                        </section>    
                    )
                })
            }
        </>
    )
}

export default PostsListing
