"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { user } from '../scripts/interfaces';
import { getUserByUsername } from '../scripts/apicalls';
import ProfileCard from '../components/ProfileCard';
import { Alert, Snackbar } from '@mui/material';

const Profile = () => {
    const params = useParams();
    const username = params.username;

    const [targetUser, setTargetUser] = useState<user>();

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | "info">();

    useEffect(() => {
        const fetchData = async () => {
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
        fetchData();
    }, []);

    return (
        <>
            <section className='row justify-content-center'>
                <section className='col-12 col-sm-10 col-md-8 col-xl-6 border'>
                    {
                        targetUser ? (
                            <ProfileCard targetUser={targetUser} />
                        ) : (
                            <></>
                        )
                    }
                </section>
            </section>

            <section className='row justify-content-center'>
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
            </section>
        </>
    )
}

export default Profile
