"use client"

import { Button, Link, Typography } from '@mui/material'
import React, { useState } from 'react'
import { validateNewUser } from '../scripts/validation';

const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const handleSubmit = () => {
        const validation = validateNewUser(username, email, password, repassword);
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
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)} 
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
                {thumbnail ? thumbnail.name : "Upload Profile Picture"}
            </label>

            <Button variant='contained' className='px-4 mb-2' onClick={handleSubmit}>Create account</Button>

            <Typography variant='body1' color='text.primary'>
                You already have an account? <Link href="/sign-in">Sign in now!</Link>
            </Typography>
        </form>
    )
}

export default SignUpForm;
