"use client"

import React, { useState } from 'react'
import { post, user } from '../scripts/interfaces'
import { likePost, likeReply, unlikePost, unlikeReply } from '../scripts/apicalls'
import Image from 'next/image'
import Link from 'next/link'
import { Alert, Button, Snackbar, Typography } from '@mui/material'
import { beautifyTime } from '../scripts/scripts'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const ReplyCard = (
    { imageLink, content, unique, createdAtDate, user, post, countLikes, isUserLogged, isAlreadyLiked }
    :
    { imageLink: string, content: string, unique: string, createdAtDate: string, user: user, post: post, countLikes: number, isUserLogged: boolean, isAlreadyLiked: boolean }
) => {

    const [liked, setLiked] = useState(isAlreadyLiked);
    const [likes, setLikes] = useState(countLikes);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);

    console.log(unique, liked)

    const handleLike = async () => {
        if (isUserLogged) {
            if (liked) {
                setLikes(likes - 1);
                setLiked(false);
                const unlikeRes = await unlikeReply(unique);
                setAlertMessage(unlikeRes);
                setAlertState(true);
            } else {
                setLiked(true);
                setLikes(likes + 1)
                const likeRes = await likeReply(unique);
                setAlertMessage(likeRes);
                setAlertState(true);
            }
        } else {
            setAlertMessage("You need to log in.");
            setAlertState(true);
        }
    }
        
    return (
        <section className='col-12 border'>
            <section className="row p-2">
                <section className="col-6 d-flex align-items-center gap-2">
                    <Image
                        src={user.profilePicture || "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"}
                        alt='Profile Picture'
                        width={30}
                        height={30}
                        className='rounded-circle'
                    />
                    <Link href={"/profile/" + user.username} className='text-decoration-none'><Typography variant='body1' color='text.primary'>@{user.username}</Typography></Link>
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
                            width={0}
                            height={0}
                            sizes="100vw"
                            className='img-custom'
                            style={{ width: "100%", height: "auto", cursor: 'pointer', maxHeight: "300px" }}
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

export default ReplyCard
