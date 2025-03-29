"use client"

import React, { useEffect, useState } from 'react'
import NewPostForm from '../components/NewPostForm'
import Post from '../components/Post'
import { post, user } from '../scripts/interfaces'
import { getAllPosts, getUserData } from '../scripts/apicalls'
import { getIsAuthenticated } from '../scripts/server'

const PostsListing = () => {
    const [posts, setPosts] = useState<post[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<user>();
    const [isLogged, setIsLogged] = useState<boolean>();

    useEffect(() => {
        const fetchIsAuth = async () => {
            const isAuth = await getIsAuthenticated();
            setIsLogged(isAuth);

            if (isAuth) {
                const resUserData = await getUserData();

                if (typeof resUserData === "string") {
                    //error handler
                } else {
                    setUserData(resUserData);
                }
            }

            const res = await getAllPosts();
            if (typeof res !== "string") {

                setPosts(res);
            }
        }
        fetchIsAuth();
    }, []);

    return (
        <>    
            <section className="row justify-content-center my-3">
                <NewPostForm />
            </section>
            {
                posts.map((post, index) => {
                    return (
                        <section className="row justify-content-center my-2" key={index}>
                            <Post 
                                isAlreadyLiked={
                                    userData ? (
                                        userData.likedPosts ? (
                                            userData.likedPosts.some(userLikedPosts => userLikedPosts.unique === post.unique)
                                        ) : false
                                    ) : false
                                }
                                username={post.user.username} 
                                profilePicture={post.user.profilePicture} 
                                createdAtDate={post.createdAtDate} 
                                imageLink={post.imageLink} 
                                content={post.content} 
                                countLikes={post.likeCount}
                                countReplies={post.replyCount}
                            />
                        </section>    
                    )
                })
            }
        </>
    )
}

export default PostsListing
