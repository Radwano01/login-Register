import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:5000/forgot-password', {email})
    .then(res => {
        if(res.data.Status === "Success") {
            navigate('/login')
        }
    }).catch(err => console.log(err))
}
  return (
    <div className='table'>
      <form onSubmit={handleSubmit} className='column'>
        <h2>Forgot Password</h2>
          <input type="email" placeholder='email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
          <button type='submit' className='btn'>Send</button>
      </form>
  </div>
  )
}

export default ForgotPassword