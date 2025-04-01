"use client"

import React, { useState } from 'react'
import { user } from '../scripts/interfaces'
import { deleteReply, likeReply, unlikeReply } from '../scripts/apicalls'
import Image from 'next/image'
import Link from 'next/link'
import { Alert, Button, Dialog, DialogActions, DialogTitle, Snackbar, Typography } from '@mui/material'
import { beautifyTime } from '../scripts/scripts'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';

const ReplyCard = (
    { imageLink, content, unique, createdAtDate, user, countLikes, isUserLogged, isAlreadyLiked, userData, postUnique }
    :
    { imageLink: string, content: string, unique: string, createdAtDate: string, postUnique: string, userData: user | undefined, user: user, countLikes: number, isUserLogged: boolean, isAlreadyLiked: boolean }
) => {

    const [liked, setLiked] = useState(isAlreadyLiked);
    const [likes, setLikes] = useState(countLikes);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

    const handleDeleteReply = async () => {
        const res = await deleteReply(unique);

        if (typeof res === "string") {
            setAlertMessage(res);
            setAlertState(true);
        } else {
            window.location.href = "/post/" + postUnique;
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
                    {
                        userData?.username === user.username ? (
                            <Button variant='outlined' size='small' className='ms-1' onClick={() => setDeleteDialogOpen(true)}><DeleteIcon /> <Typography variant='subtitle1' className='ms-1'>Delete</Typography></Button>
                        ) : (
                            <></>
                        )
                    }
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
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle><Typography variant='h5'>Are you sure you want delete it?</Typography></DialogTitle>
                <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>Disagree</Button>
                <Button onClick={handleDeleteReply}>Agree</Button>
                </DialogActions>
            </Dialog>
        </section>
    )
}

export default ReplyCard
