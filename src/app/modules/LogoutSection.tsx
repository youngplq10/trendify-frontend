"use client"

import { Button, Typography } from '@mui/material'
import React from 'react'
import { logout } from '../scripts/server'

const LogoutSection = () => {
    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    }

    return (
        <div className='col-6 text-center'>
            <Typography variant='h4' color='text.primary'>Are you sure you want to log out?</Typography>
            <Button variant='contained' className='my-3' onClick={handleLogout}>Yes, log out</Button>
        </div>
    )
}

export default LogoutSection
