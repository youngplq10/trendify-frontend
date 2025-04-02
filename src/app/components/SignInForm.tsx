"use client"

import { Alert, Button, Snackbar, Typography } from '@mui/material'
import Link from 'next/link'
import React, { useState } from 'react'
import { validateExistingUser } from '../scripts/validation';
import { loginUser } from '../scripts/apicalls';

const SignInForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "info">("error");

    const handleSubmit = async () => {
        const validation = validateExistingUser(username, password);

        if (validation !== "Success") {
            setAlertState(true);
            setAlertMessage(validation);
            setAlertSeverity("error");
        } else {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);

            setAlertMessage("Logging in...");
            setAlertSeverity("info");
            setAlertState(true);

            const res = await loginUser(formData);

            if (res) {
                setAlertMessage(res);
                setAlertState(true);
                setAlertSeverity("error");
            } else {
                setAlertState(false);
                window.location.href = "/";
            }
        }
    }

    return (
        <form>
            <input type='text' className='form-control custom-input py-2 my-3' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} style={{
                minHeight: "3rem",
                backgroundColor: "#05040c",
                color: "#e8e6f5",
                border: "1px solid #e8e6f5",
            }} />

            <input type='password' className='form-control custom-input py-2 my-3' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} style={{
                minHeight: "3rem",
                backgroundColor: "#05040c",
                color: "#e8e6f5",
                border: "1px solid #e8e6f5",
            }} />

            <Button variant='contained' className='px-4 mb-2' onClick={handleSubmit}>Log in</Button>
            <Typography variant='body1' color='text.primary'>You dont have an account? <Link href="/sign-up">Create one now!</Link></Typography>

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
        </form>
    )
}

export default SignInForm
