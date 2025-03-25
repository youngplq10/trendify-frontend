"use client"

import { Button, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ModeCommentIcon from '@mui/icons-material/ModeComment';

const Post = 
    ({ username, profilePicture, imageLink, content, createdAtDate, countLikes, countReplies }
     : 
    { username: string, profilePicture: string | null, imageLink: string | null, content: string, createdAtDate: string, countLikes: number, countReplies: number }) => {
        return (
            <div className='col-12 col-sm-10 col-md-8 col-xl-6 border'>
                <div className="row p-2">
                    <div className="col-6 d-flex align-items-center gap-2">
                        <Image
                            src={profilePicture || "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"}
                            alt='Profile Picture'
                            width={30}
                            height={30}
                            className='rounded-circle'
                        />
                        <Typography variant='body1' color='text.primary'>@{username}</Typography>
                    </div>
                    <div className="col-6 text-end">
                        <Typography variant='body1' color='text.primary'>{createdAtDate}</Typography>
                    </div>
                </div>

                <div className="row p-2">
                    <div className="col-auto">
                        <Typography variant='body1' color='text.primary'>{content}</Typography>
                    </div>
                </div>

                { imageLink ? (
                    <div className="row px-2 pb-2">
                        <div className="col-auto">
                            <Image
                                src={imageLink}
                                alt='Profile Picture'
                                width={100}
                                height={100}
                                className='img-fluid rounded'
                            />
                        </div>
                    </div>
                ) : (
                    <></>
                ) }

                <div className="row p-2">
                    <div className="col-auto ms-auto">
                        <Button variant='outlined' size='small' className='me-1'><ThumbUpIcon /> <Typography variant='subtitle1' className='ms-1'>{countLikes}</Typography></Button>
                        <Button variant='outlined' size='small' className='ms-1'><ModeCommentIcon /> <Typography variant='subtitle1' className='ms-1'>{countLikes}</Typography></Button>
                    </div>
                </div>
            </div>
        )
}

export default Post
