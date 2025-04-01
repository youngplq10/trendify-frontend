"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Alert, Button, Dialog, DialogActions, DialogTitle, Snackbar, Typography } from '@mui/material'
import { beautifyTime } from '../scripts/scripts'
import { deletePost, getUserData, likePost, unlikePost } from '../scripts/apicalls'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ReplyForm from './ReplyForm'
import { reply, user } from '../scripts/interfaces'
import ReplyCard from './ReplyCard'
import Loading from './Loading'
import DeleteIcon from '@mui/icons-material/Delete';

const Post = (
    { username, profilePicture, imageLink, content, createdAtDate, countLikes, countReplies, isAlreadyLiked, unique, isUserLogged, topReply, replies } 
    :
    { username: string, replies: reply[], profilePicture: string | null, imageLink: string | null, topReply: reply | undefined, unique: string, isUserLogged: boolean, content: string, createdAtDate: string, countLikes: number, countReplies: number, isAlreadyLiked: boolean } ) => {

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [loading, setLoading] = useState(true);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [liked, setLiked] = useState(isAlreadyLiked);
    const [likes, setLikes] = useState(countLikes);

    const [user, setUser] = useState<user>();

    useEffect(() => {
        const fetchData = async () => {
            const resUserData = await getUserData();

            if (typeof resUserData === "string") {
                //err
                setLoading(false);
            } else {
                setUser(resUserData);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleLike = async () => {
        if (isUserLogged) {
            if (liked) {
                setLikes(likes - 1);
                setLiked(false);
                const unlikeRes = await unlikePost(unique);
                setAlertMessage(unlikeRes);
                setAlertState(true);
            } else {
                setLiked(true);
                setLikes(likes + 1)
                const likeRes = await likePost(unique);
                setAlertMessage(likeRes);
                setAlertState(true);
            }
        } else {
            setAlertMessage("You need to log in.");
            setAlertState(true);
        }
    }

    const handleDeletePost = async () => {
        const res = await deletePost(unique);

        if (typeof res === "string") {
            setAlertMessage(res);
            setAlertState(true);
        } else {
            window.location.href = "/";
        }
    }

    if (loading) return <Loading />
    
    return (
        <section>
            <section className="row p-2">
                <section className="col-6 d-flex align-items-center gap-2">
                    <Image
                        src={profilePicture || "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"}
                        alt='Profile Picture'
                        width={30}
                        height={30}
                        className='rounded-circle'
                    />
                    <Link href={"/profile/" + username} className='text-decoration-none'><Typography variant='body1' color='text.primary'>@{username}</Typography></Link>
                </section>
                <section className="col-6 text-end">
                    <Typography variant='body1' color='text.primary'>{beautifyTime(createdAtDate)}</Typography>
                </section>
            </section>

            <section className="row p-2">
                <article className="col-auto">
                    <Typography variant='body1' color='text.primary'>{content}</Typography>
                </article>
            </section>

            { imageLink ? (
                <section className="row px-2 pb-2">
                    <article className="col-12">
                        <Image
                            src={imageLink}
                            alt='Image of post'
                            width={0}
                            height={0}
                            sizes="100vw"
                            className='img-custom'
                            style={{ width: "100%", height: "auto", cursor: 'pointer', maxHeight: "600px" }}
                            onClick={() => window.location.href = "/post/" + unique}
                        />
                    </article>
                </section>
            ) : (
                <></>
            ) }

            <section className="row p-2">
                <section className="col-auto ms-auto">
                    <Button variant='outlined' size='small' className='me-1' onClick={handleLike}><ThumbUpIcon /> <Typography variant='subtitle1' className='ms-1'>{likes}</Typography></Button>
                    <Button variant='outlined' size='small' className='ms-1' onClick={() => window.location.href = "/post/" + unique}><ModeCommentIcon /> <Typography variant='subtitle1' className='ms-1'>{countReplies}</Typography></Button>
                    {
                        user?.username === username ? (
                            <Button variant='outlined' size='small' className='ms-1' onClick={() => setDeleteDialogOpen(true)}><DeleteIcon /> <Typography variant='subtitle1' className='ms-1'>Delete</Typography></Button>
                        ) : (
                            <></>
                        )
                    }
                </section>
            </section>

            {
                isUserLogged ? (
                    <section className='row p-2'>
                        <section className='col-12'>
                            <ReplyForm postUnique={unique} />
                        </section>
                    </section>
                ) : (
                    <></>
                )
            }

            {
                topReply ? (
                    <section className='row p-2'>
                        <ReplyCard
                            user={topReply.user}
                            imageLink={topReply.imageLink}
                            content={topReply.content}
                            unique={topReply.unique}
                            createdAtDate={topReply.createdAtDate}
                            countLikes={topReply.countLikes}
                            isUserLogged={isUserLogged}
                            isAlreadyLiked={user ? (
                                user.likedReplies ? (
                                    user.likedReplies.some(userLikedReplies => userLikedReplies.unique === topReply.unique)
                                ) : false
                            ) : false
                            }
                        />
                    </section>
                ) : (
                    <></>
                )
            }

            {
                replies.map((reply, index) => (
                    
                    <section className='row p-2' key={index}>
                        <ReplyCard
                            user={reply.user}
                            imageLink={reply.imageLink}
                            content={reply.content}
                            unique={reply.unique}
                            createdAtDate={reply.createdAtDate}
                            countLikes={reply.countLikes}
                            isUserLogged={isUserLogged}
                            isAlreadyLiked={user ? (
                                user.likedReplies ? (
                                    user.likedReplies.some(userLikedReplies => userLikedReplies.unique === reply.unique)
                                ) : false
                            ) : false
                        }
                        />
                    </section>
                ))
            }

            <Snackbar open={alertState} autoHideDuration={6000} onClose={() => setAlertState(false)}>
                <Alert
                    onClose={() => setAlertState(false)}
                    severity="info"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle><Typography variant='h5'>Are you sure you want delete it?</Typography></DialogTitle>
                <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>Disagree</Button>
                <Button onClick={handleDeletePost}>Agree</Button>
                </DialogActions>
            </Dialog>
        </section>
    )
}

export default Post
