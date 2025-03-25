"use client"

import { Button, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import Link from 'next/link';

const Post = 
    ({ username, profilePicture, imageLink, content, createdAtDate, countLikes, countReplies }
     : 
    { username: string, profilePicture: string | null, imageLink: string | null, content: string, createdAtDate: string, countLikes: number, countReplies: number }) => {
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
                        <Typography variant='body1' color='text.primary'>{createdAtDate}</Typography>
                    </section>
                </section>

                <section className="row p-2">
                    <article className="col-auto">
                        <Typography variant='body1' color='text.primary'>{content}</Typography>
                    </article>
                </section>

                { imageLink ? (
                    <section className="row px-2 pb-2">
                        <article className="col-auto">
                            <Image
                                src={imageLink}
                                alt='Image of post'
                                width={100}
                                height={100}
                                className='img-fluid rounded'
                            />
                        </article>
                    </section>
                ) : (
                    <></>
                ) }

                <section className="row p-2">
                    <section className="col-auto ms-auto">
                        <Button variant='outlined' size='small' className='me-1'><ThumbUpIcon /> <Typography variant='subtitle1' className='ms-1'>{countLikes}</Typography></Button>
                        <Button variant='outlined' size='small' className='ms-1'><ModeCommentIcon /> <Typography variant='subtitle1' className='ms-1'>{countReplies}</Typography></Button>
                    </section>
                </section>
            </section>
        )
}

export default Post
