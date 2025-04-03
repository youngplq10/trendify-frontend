"use client"

import Navbar from '@/app/modules/Navbar';
import Profile from '@/app/modules/Profile';
import React from 'react'

const page = () => {

    return (
        <section className="container-lg">
            <nav className="row">
                <Navbar />
            </nav>
            <section className="row justify-content-center">
                <Profile />
            </section>
      </section>
    )
}

export default page
