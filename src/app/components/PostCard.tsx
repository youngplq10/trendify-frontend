"use client"

import { Alert, Button, Snackbar, Typography } from '@mui/material'
import Image from 'next/image'
import React, { useState } from 'react'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import Link from 'next/link';
import { likePost, unlikePost } from '../scripts/apicalls';
import { beautifyTime } from '../scripts/scripts';

const PostCard = 
    ({ username, profilePicture, imageLink, content, createdAtDate, countLikes, countReplies, isAlreadyLiked, unique, isUserLogged }
     : 
    { username: string, profilePicture: string | null, imageLink: string | null, unique: string, isUserLogged: boolean, content: string, createdAtDate: string, countLikes: number, countReplies: number, isAlreadyLiked: boolean }) => {
    
    const [liked, setLiked] = useState(isAlreadyLiked);
    const [likes, setLikes] = useState(countLikes);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);

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
        
    return (
        <section className='col-12 col-sm-10 col-md-8 col-xl-6 border'>
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
                    <article className="col-fluid">
                        <Image
                            src={imageLink}
                            alt='Image of post'
                            width={100}
                            height={100}
                            className='img-fluid rounded'
                            style={{ cursor: 'pointer', maxHeight: "300px" }}
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
                </section>
            </section>

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
        </section>
    )
}

export default PostCard
