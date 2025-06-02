"use client"

import React, { useEffect, useState } from 'react'
import NewPostForm from '../components/NewPostForm'
import PostCard from '../components/PostCard'
import { post, user } from '../scripts/interfaces'
import { getAllPosts, getUserData } from '../scripts/apicalls'
import { getIsAuthenticated } from '../scripts/server'
import { Alert, Snackbar } from '@mui/material'
import Loading from '../components/Loading'

const PostsListing = ({ topPost } : { topPost: string | null }) => {
    const [posts, setPosts] = useState<post[]>([]);
    const [userData, setUserData] = useState<user>();
    const [isLogged, setIsLogged] = useState<boolean>(false);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | "info">();

    const [loading, setLoading] = useState(true);

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
                    setLoading(false);
                } else {
                    setPosts(res);
                    setLoading(false);
                }
            } else {
                setAlertMessage(res);
                setAlertSeverity("error");
                setAlertState(true);
                setLoading(false);
            }
        }
        fetchData();
    }, [topPost]);

    if (loading) return <Loading />

    return (
        <>    
            <section className="row justify-content-center my-3">
                <NewPostForm />
            </section>
            {
                newestPost ? (
                    <section className="row justify-content-center my-2">
                        <PostCard 
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
                            <PostCard 
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
