import axios from 'axios'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const VerifyPage = () => {
    const {email, verificationToken} = useParams()

    const handleVerify = ()=>{
        axios.get(`http://localhost:5000/verify/${email}/${verificationToken}`)
    }
    useEffect(()=>{
        handleVerify()
    },[])
  return (
    <div>
        <p>Account Verified</p>
        <button><a href="/login">Login Page</a></button>
    </div>
  )
}

export default VerifyPage