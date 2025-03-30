"use client"

import React, { useEffect, useState } from 'react'
import NewPostForm from '../components/NewPostForm'
import Post from '../components/Post'
import { post, user } from '../scripts/interfaces'
import { getAllPosts, getUserData } from '../scripts/apicalls'
import { getIsAuthenticated } from '../scripts/server'
import { Alert, Snackbar } from '@mui/material'
import { useSearchParams } from 'next/navigation'

const PostsListing = () => {
    const [posts, setPosts] = useState<post[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<user>();
    const [isLogged, setIsLogged] = useState<boolean>(false);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | "info">();

    const searchParams = useSearchParams();
    const topPost = searchParams.get("topPost");

    const [newestPost, setNewestPost] = useState<post>();

    useEffect(() => {
        const fetchData = async () => {
            const isAuth = await getIsAuthenticated();
            setIsLogged(isAuth);

            if (isAuth) {
                const resUserData = await getUserData();

                if (typeof resUserData === "string") {
                    setAlertSeverity("error");
                    setAlertMessage(resUserData);
                    setAlertState(true);
                } else {
                    setUserData(resUserData);
                }
            }

            const res = await getAllPosts();
            if (typeof res !== "string") {
                if (topPost) {
                    const filteredPosts = res.filter(post => post.unique !== topPost);
                    setNewestPost(res.find(post => post.unique === topPost));
                    setPosts(filteredPosts);
                } else {
                    setPosts(res);
                }
            }
        }
        fetchData();
    }, []);

    return (
        <>    
            <section className="row justify-content-center my-3">
                <NewPostForm />
            </section>
            {
                newestPost ? (
                    <section className="row justify-content-center my-2">
                        <Post 
                            isAlreadyLiked={
                                userData ? (
                                    userData.likedPosts ? (
                                        userData.likedPosts.some(userLikedPosts => userLikedPosts.unique === topPost)
                                    ) : false
                                ) : false
                            }
                            isUserLogged={isLogged}
                            username={newestPost?.user.username}
                            unique={newestPost?.unique}
                            profilePicture={newestPost?.user.profilePicture}
                            createdAtDate={newestPost?.createdAtDate}
                            imageLink={newestPost?.imageLink}
                            content={newestPost?.content}
                            countLikes={newestPost?.likeCount}
                            countReplies={newestPost?.replyCount}
                        />
                    </section>
                ) : (
                    <></>
                )
                
            }
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
                                isUserLogged={isLogged}
                                username={post.user.username} 
                                unique={post.unique}
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

            <Snackbar open={alertState} autoHideDuration={6000} onClose={() => setAlertState(false)}>
                <Alert
                    onClose={() => setAlertState(false)}
                    severity={alertSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default PostsListing
