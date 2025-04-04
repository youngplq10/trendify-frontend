"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { user } from '../scripts/interfaces';
import { getUserByUsername, getUserData } from '../scripts/apicalls';
import ProfileCard from '../components/ProfileCard';
import { Alert, Snackbar } from '@mui/material';
import { getIsAuthenticated } from '../scripts/server';

const Profile = () => {
    const params = useParams();
    const username = params.username;

    const [isLogged, setIsLogged] = useState(false);

    const [targetUser, setTargetUser] = useState<user>();
    const [userData, setUserData] = useState<user>();

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | "info">();

    useEffect(() => {
        const fetchTargetData = async () => {
            if (typeof username === "string") {
                const resTargetUser = await getUserByUsername(username);

                if (typeof resTargetUser === "string") {
                    setAlertSeverity("error");
                    setAlertState(true);
                    setAlertMessage(resTargetUser);
                } else {
                    setTargetUser(resTargetUser);
                }
            } else {
                setAlertSeverity("error");
                setAlertState(true);
                setAlertMessage("Failed to get user data. Please refresh page.");
            }
        }

        const fetchUserData = async () => {
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
        }

        fetchUserData();
        fetchTargetData();
    }, []);

    return (
        <>
            <section className='row justify-content-center'>
                <section className='col-12 col-sm-10 col-md-8 col-xl-6 border'>
                    {
                        targetUser ? (
                            <ProfileCard 
                                isAlreadyFollowing={
                                    userData ? (
                                        userData.following ? (
                                            userData.following.some(userFollowingUsers => userFollowingUsers.username === targetUser.username)
                                        ) : false
                                    ) : false
                                }
                                isLogged={isLogged}
                                targetUser={targetUser} 
                            />
                        ) : (
                            <></>
                        )
                    }
                </section>
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

export default Profile
