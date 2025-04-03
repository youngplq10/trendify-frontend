import React from 'react'
import { user } from '../scripts/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@mui/material'
import { beautifyTime } from '../scripts/scripts'

const ProfileCard = ({ targetUser } : { targetUser: user }) => {
    return (
        <>
            <section className='row p-2'>
                <section className="col-6 d-flex align-items-center gap-2">
                    <Image
                        src={targetUser.profilePicture || "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"}
                        alt='Profile Picture'
                        width={30}
                        height={30}
                        className='rounded-circle'
                    />
                    <Link href={"/profile/" + targetUser.username} className='text-decoration-none'><Typography variant='body1' color='text.primary'>@{targetUser.username}</Typography></Link>
                </section>
                <section className="col-6 text-end">
                    <Typography variant='body1' color='text.primary'>{beautifyTime(targetUser.createdAtDate)}</Typography>
                </section>
            </section>
            <section className='row p-2'>
                <section className='col-6'>
                    <Typography variant='body1' color='text.primary'>{targetUser.bio}</Typography>
                </section>
            </section>
        </>
    )
}

export default ProfileCard
