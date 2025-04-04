"use client"

import React, { useState } from 'react'
import { user } from '../scripts/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import { Alert, Button, Snackbar, Typography } from '@mui/material'
import { beautifyTime } from '../scripts/scripts'
import { followUser, unfollowUser } from '../scripts/apicalls'

const ProfileCard = ({ targetUser, isAlreadyFollowing, isLogged } : { targetUser: user, isAlreadyFollowing: boolean, isLogged: boolean }) => {
    const [isFollowing, setIsFollowing] = useState(isAlreadyFollowing);

    const [followers, setFollowers] = useState(targetUser.followersCount);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | "info">();

    const handleFollow = async () => {
        if (!isLogged) {
            setAlertMessage("You need to log in to follow user.");
            setAlertSeverity("info");
            setAlertState(true);
        } else {
            if (isFollowing) {
                const res = await unfollowUser(targetUser.username);

                setFollowers(followers - 1);
                setIsFollowing(false);
                setAlertMessage(res);
                setAlertSeverity("info");
                setAlertState(true);
            } else {
                const res = await followUser(targetUser.username);

                setFollowers(followers + 1);
                setIsFollowing(true);
                setAlertMessage(res);
                setAlertSeverity("info");
                setAlertState(true);
            }
        }
    }

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

            <section className='row p-2'>
                <section className='col-auto'>
                    <Typography variant='body1' color='text.primary'>
                        { followers + " Followers" }
                    </Typography>
                </section>

                <section className='col-auto'>
                    <Typography variant='body1' color='text.primary'>
                        { targetUser.followingCount + " Following" }
                    </Typography>
                </section>
            </section>

            <section className='row p-2'>
                {
                    isFollowing ? (
                        <Button variant='outlined' onClick={handleFollow}>Unfollow</Button>
                    ) : (
                        <Button variant='contained' onClick={handleFollow}>Follow</Button>
                    )
                }
            </section>

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
        </>
    )
}

export default ProfileCard
