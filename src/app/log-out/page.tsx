import React from 'react'
import Navbar from '../modules/Navbar'
import LogoutSection from '../modules/LogoutSection'

const page = () => {
    return (
    <section className="container-lg">
        <nav className="row">
          <Navbar />
        </nav>
        <section className="row justify-content-center my-4">
          <LogoutSection />
        </section>
    </section>
    )
}

export default page
