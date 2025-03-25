import { Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <nav className='my-3'>
            <div className="row">
                <nav className='col-auto'>
                    <Link href="/" className='text-decoration-none'><Typography variant='h4' color='text.primary'>Trendify</Typography></Link>
                </nav>
                <nav className="col-auto ms-auto d-flex align-items-center gap-3">
                    <Link href="/sign-in" className="text-decoration-none">
                        <Typography variant="h4" color="text.primary">Sign in</Typography>
                    </Link>
                </nav>
            </div>
        </nav>
    )
}

export default Navbar
