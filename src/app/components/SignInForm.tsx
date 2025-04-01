"use client"

import { Alert, Button, Snackbar, Typography } from '@mui/material'
import Link from 'next/link'
import React, { useState } from 'react'
import { validateExistingUser } from '../scripts/validation';
import { loginUser } from '../scripts/apicalls';

const SignInForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [errorState, setErrorState] = useState(false);

    const handleSubmit = async () => {
        const validation = validateExistingUser(username, password);

        if (validation !== "Success") {
            setErrorState(true);
            setErrorMessage(validation);
        } else {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);

            const res = await loginUser(formData);

            if (res) {
                setErrorMessage(res);
                setErrorState(true);
            } else {
                setErrorState(false);
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

            <Snackbar open={errorState} autoHideDuration={6000} onClose={() => setErrorState(false)}>
                <Alert
                    onClose={() => setErrorState(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </form>
    )
}

export default SignInForm
