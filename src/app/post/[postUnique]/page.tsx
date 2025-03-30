import Navbar from '@/app/modules/Navbar'
import PostDetails from '@/app/modules/PostDetails'
import React from 'react'

const page = () => {
    return (
        <section className="container-lg">
            <nav className="row">
                <Navbar />
            </nav>
            <section className="row justify-content-center">
                <PostDetails />
            </section>
      </section>
    )
}

export default page
