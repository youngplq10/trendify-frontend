"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { post, reply, user } from '../scripts/interfaces';
import { getPost, getUserData } from '../scripts/apicalls';
import Post from '../components/Post';
import { getIsAuthenticated } from '../scripts/server';
import { Alert, Snackbar } from '@mui/material';
import Loading from '../components/Loading';
import ReplyCard from '../components/ReplyCard';

const PostDetails = ({ topReply } : { topReply: string | null }) => {
    const params = useParams();
    const uniqueValue = params.postUnique;

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | "info">();

    const [userData, setUserData] = useState<user>();
    const [isLogged, setIsLogged] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);

    const [replies, setReplies] = useState<reply[]>([]);

    const [post, setPost] = useState<post>();
    const [newestReply, setNewestReply] = useState<reply>();

    useEffect(() => {
        const fetchPost = async () => {
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
            
            if (typeof uniqueValue === "string") {
                const postData = await getPost(uniqueValue);

                if (typeof postData === "string") {
                    setAlertSeverity("error");
                    setAlertMessage(postData);
                    setAlertState(true);
                    setLoading(false);
                } else {
                    setPost(postData);
                    setLoading(false);
                }

                if (typeof topReply === "string" && typeof postData !== "string") {
                    const filteredReplies = postData.replies.filter(reply => reply.unique !== topReply);
                    setNewestReply(postData.replies.find(reply => reply.unique === topReply));
                    setReplies(filteredReplies);
                } else if (typeof topReply !== "string" && typeof postData !== "string") {
                    setReplies(postData.replies)
                }
            }
        }
        fetchPost();
    }, [topReply, uniqueValue]);

    if (loading) return <Loading />

    return (
        <section className='col-12 col-sm-10 col-md-8 col-xl-6'>
            {
                post ? (
                    <Post
                        isAlreadyLiked={
                            userData ? (
                                userData.likedPosts ? (
                                    userData.likedPosts.some(userLikedPosts => userLikedPosts.unique === post.unique)
                                ) : false
                            ) : false
                        }
                        replies={replies}
                        topReply={newestReply}
                        isUserLogged={isLogged}
                        username={post?.user.username}
                        unique={post?.unique}
                        profilePicture={post?.user.profilePicture}
                        createdAtDate={post?.createdAtDate}
                        imageLink={post?.imageLink}
                        content={post?.content}
                        countLikes={post?.likeCount}
                        countReplies={post?.replyCount}
                    />
                ) : (
                    <></>
                )
            }

            {
                post ? (
                    newestReply ? (
                        <section className='row p-2'>
                            <ReplyCard
                                userData={userData}
                                postUnique={post.unique}
                                user={newestReply.user}
                                imageLink={newestReply.imageLink}
                                content={newestReply.content}
                                unique={newestReply.unique}
                                createdAtDate={newestReply.createdAtDate}
                                countLikes={newestReply.countLikes}
                                isUserLogged={isLogged}
                                isAlreadyLiked={newestReply.user ? (
                                    newestReply.user.likedReplies ? (
                                        newestReply.user.likedReplies.some(userLikedReplies => userLikedReplies.unique === newestReply.unique)
                                    ) : false
                                ) : false
                                }
                            />
                        </section>
                    ) : (
                        <></>
                    )
                ) : (
                    <></>
                )
            }

            {
                post ? (
                    replies.map((reply, index) => (
                        
                        <section className='row p-2' key={index}>
                            <ReplyCard
                                user={reply.user}
                                userData={userData}
                                postUnique={post.unique}
                                imageLink={reply.imageLink}
                                content={reply.content}
                                unique={reply.unique}
                                createdAtDate={reply.createdAtDate}
                                countLikes={reply.countLikes}
                                isUserLogged={isLogged}
                                isAlreadyLiked={reply.user ? (
                                    reply.user.likedReplies ? (
                                        reply.user.likedReplies.some(userLikedReplies => userLikedReplies.unique === reply.unique)
                                    ) : false
                                ) : false
                            }
                            />
                        </section>
                    ))
                ) : (
                    <></>
                )
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
        </section>
    )
}

export default PostDetails
