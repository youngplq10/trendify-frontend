import React from 'react'
import Navbar from '../modules/Navbar'
import SignIn from '../modules/SignIn'

const page = () => {
    return (
        <section className='container-lg'>
            <div className="row justify-content-center">
                <Navbar />
            </div>
            <div className="row justify-content-center">
                <SignIn />
            </div>
        </section>
    )
}

export default page
