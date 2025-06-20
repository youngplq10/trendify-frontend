"use client"

import { Alert, Button, Link, Snackbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import { validateNewUser } from '../scripts/validation';
import { createUser } from '../scripts/apicalls';

const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const [alertMessage, setAlertMessage] = useState("");
    const [alertState, setAlertState] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "info">("error");

    const handleSubmit = async () => {
        const validation = validateNewUser(username, email, password, repassword);

        if (validation === "Success") {
            const formData = new FormData();

            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            
            if (profilePicture) {
                formData.append("picture", profilePicture, profilePicture?.name);
            }

            setAlertMessage("Creating account...");
            setAlertState(true);
            setAlertSeverity("info");
            
            const res = await createUser(formData);

            if (res) {
                setAlertMessage(res);
                setAlertState(true);
                setAlertSeverity("error");
            } else {
                setAlertState(false);
                window.location.href = "/";
            }
        } else {
            setAlertMessage(validation);
            setAlertState(true);
            setAlertSeverity("error");
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

            <input type='text' className='form-control custom-input py-2 my-3' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} style={{
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

            <input type='password' className='form-control custom-input py-2 my-3' placeholder='Confirm Password' value={repassword} onChange={(e) => setRepassword(e.target.value)} style={{
                minHeight: "3rem",
                backgroundColor: "#05040c",
                color: "#e8e6f5",
                border: "1px solid #e8e6f5",
            }} />

            <input 
                type="file" 
                accept="image/*" 
                id="file-upload"
                className="d-none"
                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} 
            />

            <label 
                htmlFor="file-upload" 
                className="form-control py-3 my-3 text-center" 
                style={{
                    minHeight: "3rem",
                    backgroundColor: "#05040c",
                    color: "#e8e6f5",
                    border: "1px solid #e8e6f5",
                    cursor: "pointer",
                }}
            >
                {profilePicture ? profilePicture.name : "Upload Profile Picture"}
            </label>

            <Button variant='contained' className='px-4 mb-2' onClick={handleSubmit}>Create account</Button>

            <Typography variant='body1' color='text.primary'>
                You already have an account? <Link href="/sign-in">Sign in now!</Link>
            </Typography>

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

export default SignUpForm;