"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { post, user } from '../scripts/interfaces';
import { getPost, getUserData } from '../scripts/apicalls';
import Post from '../components/Post';
import { getIsAuthenticated } from '../scripts/server';
import { Alert, Snackbar } from '@mui/material';

const PostDetails = () => {
    const params = useParams();
    const uniqueValue = params.postUnique;

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | "info">();

    const [userData, setUserData] = useState<user>();
    const [isLogged, setIsLogged] = useState<boolean>(false);

    const [post, setPost] = useState<post>();

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
                } else {
                    setPost(postData);
                }
            }
        }
        fetchPost();
    }, []);

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
