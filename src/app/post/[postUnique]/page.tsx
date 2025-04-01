"use client"

import Navbar from '@/app/modules/Navbar'
import PostDetails from '@/app/modules/PostDetails'
import { useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const searchParams = useSearchParams();
    const topReply = searchParams.get("topReply");

    return (
        <section className="container-lg">
            <nav className="row">
                <Navbar />
            </nav>
            <section className="row justify-content-center">
                <PostDetails topReply={topReply} />
            </section>
      </section>
    )
}

export default page
