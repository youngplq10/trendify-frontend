import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
    return (
        <section className='row justify-content-center my-5 py-5'>
            <CircularProgress size={100} />
        </section>
    )
}

export default Loading
