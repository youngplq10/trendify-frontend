import { Button, Link, Typography } from '@mui/material'
import React from 'react'

const SignUpForm = () => {
    return (
        <form>
            <input type='text' className='form-control custom-input py-2 my-3' placeholder='Username' style={{
                minHeight: "3rem",
                backgroundColor: "#05040c",
                color: "#e8e6f5",
                border: "1px solid #e8e6f5",
            }} />

            <input type='text' className='form-control custom-input py-2 my-3' placeholder='Password' style={{
                minHeight: "3rem",
                backgroundColor: "#05040c",
                color: "#e8e6f5",
                border: "1px solid #e8e6f5",
            }} />

            <Button variant='contained' className='px-4 mb-2'>Create account</Button>
            <Typography variant='body1' color='text.primary'>You already have an account? <Link href="/sign-in">Sign in now!</Link></Typography>
        </form>
    )
}

export default SignUpForm
