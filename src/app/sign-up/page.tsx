import React from 'react'
import SignUp from '../modules/SignUp'
import Navbar from '../modules/Navbar'

const page = () => {
    return (
        <section className='container-lg'>
            <div className="row justify-content-center">
                <Navbar />
            </div>
            <div className="row justify-content-center">
                <SignUp />
            </div>
        </section>
    )
}

export default page
