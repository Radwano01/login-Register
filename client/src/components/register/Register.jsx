import axios from 'axios'
import React, { useState } from 'react'
import {BsFillEyeFill} from "react-icons/bs"
import {BsFillEyeSlashFill} from 'react-icons/bs'

const Register = () => {
  const [email, setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [registrationMessage, setRegistrationMessage] = useState("")
  const handleSubmit = (e)=>{
    
    e.preventDefault()
    axios.post("http://localhost:5000/register", {
      email: email,
      password: password
    })
    .then(() => {
      setRegistrationMessage(<>Registration successful. <br /> A verification email has been sent.</>);
    })
    .catch((err) => {
      console.log(err);
    });
}

const toggleShowPassword = ()=>{
  setShowPassword(!showPassword)
}
  return ( 
      <div className='table'>
        <form onSubmit={handleSubmit} className="column">
            <h2>Register</h2>
            <input type="email" placeholder='email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
            <div>
              <input type={showPassword ? 'text' : 'password'} placeholder='password' value={password} onChange={(e)=> setPassword(e.target.value)} style={{marginRight:"12px"}}/>
              {showPassword ? (<BsFillEyeFill onClick={toggleShowPassword}/>) : (<BsFillEyeSlashFill onClick={toggleShowPassword}/>)}
            </div>
            <button type='submit' className='btn'>Register</button>
            <a href="/login">You have an account?</a>{registrationMessage && <p>{registrationMessage}</p>}
        </form>
    </div>
  )
}

export default Register