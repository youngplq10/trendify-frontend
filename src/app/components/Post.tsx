import { Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const Post = ({ username, profilePicture, imageLink, content, createdAtDate } : { username: string, profilePicture: string | null, imageLink: string | null, content: string, createdAtDate: string }) => {
    return (
        <div className='col-6 border'>
            <div className="row p-2">
                <div className="col-6 d-flex align-items-center gap-2">
                    <Image
                        src={profilePicture || "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"}
                        alt='Profile Picture'
                        width={30}
                        height={30}
                        className='rounded-circle'
                    />
                    <Typography variant='body1'>@{username}</Typography>
                </div>
                <div className="col-6 text-end">
                    <Typography variant='body1'>{createdAtDate}</Typography>
                </div>
            </div>

            <div className="row p-2">
                <div className="col-auto">
                    {content}
                </div>
            </div>

            { imageLink ? (
                <div className="row p-2">
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
        </div>
    )
}

export default Post
