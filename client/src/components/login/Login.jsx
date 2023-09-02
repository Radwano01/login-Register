import React, { useState } from 'react'
import axios from 'axios'
import {BsFillEyeFill} from "react-icons/bs"
import {BsFillEyeSlashFill} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useCookies } from "react-cookie"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(true)
    const [error, setError] = useState(false)
    const [cookies , setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

    const handleSubmit = async(e)=>{
      e.preventDefault()
      try{
        const response = await axios.post("http://localhost:5000/login", {email, password})
        if (response.data.token && response.data.id) {
          setCookies("access_token", response.data.token);
          window.localStorage.setItem("userID", response.data.id);
          navigate("/");
        } else {
          setError(true);
        }
      }catch{
        setError(true)
      }
    }
  

    const toggleShowPassword = ()=>{
      setShowPassword(!showPassword)
    }

  return (
    <div className='table'>
        <form onSubmit={handleSubmit} className='column'>
            <h2>Login</h2>
              <input type="email" placeholder='email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
            <div>
              <input type={showPassword ? 'text' : 'password'} placeholder='password' value={password} onChange={(e)=> setPassword(e.target.value)} style={{marginRight: "12px"}}/>
              {showPassword ? (<BsFillEyeFill onClick={toggleShowPassword}/>) : (<BsFillEyeSlashFill onClick={toggleShowPassword}/>)}
            </div>
              <button type='Submit' className='btn'>Login</button>
              <a href="/register">You don't have an account?</a>
              <br />
              <a href="/forgot-password">Forgot Password?</a>
              {error && (<>The Email or password you entered not valid</>)}
        </form>
    </div>
  )
}

export default Login