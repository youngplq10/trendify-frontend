"use client"

import { Typography } from '@mui/material'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getIsAuthenticated } from '../scripts/server'
import Image from 'next/image'
import Logo from "@/app/assets/trendify-logo.png"

const Navbar = () => {
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const fetchIsAuth = async () => {
            const isAuth = await getIsAuthenticated();
            setIsLogged(isAuth);
        }
        fetchIsAuth();
    }, []);

    return (
        <nav className='my-3'>
            <div className="row">
                <nav className='col-auto'>
                    <Link href="/" className='text-decoration-none'>
                        <Image
                            src={Logo}
                            width={100}
                            height={100}
                            className='img-fluid'
                            alt='Trendify'
                        />
                    </Link>
                </nav>
                <nav className="col-auto ms-auto d-flex align-items-center gap-3">
                    {
                        isLogged ? (
                            <Link href="/log-out" className="text-decoration-none">
                                <Typography variant="h4" color="text.primary">Logout</Typography>
                            </Link>
                        ) : (
                            <Link href="/sign-in" className="text-decoration-none">
                                <Typography variant="h4" color="text.primary">Sign in</Typography>
                            </Link>
                        )
                    }
                </nav>
            </div>
        </nav>
    )
}

export default Navbar
