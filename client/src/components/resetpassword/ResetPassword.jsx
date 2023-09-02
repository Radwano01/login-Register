import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {BsFillEyeFill} from "react-icons/bs"
import {BsFillEyeSlashFill} from 'react-icons/bs'

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleSubmit =async (e) => {
    e.preventDefault();
    axios.post(`http://localhost:5000/reset-password/${id}/${token}`, {
      password: password
    })
    .then(res => {
      if (res.data.Status === "Success") {
        navigate('/login');
      }
    })
    .catch(err => console.log(err));
  };

  const toggleShowPassword = ()=>{
    setShowPassword(!showPassword)
  }

  return (
    <div className='table'>
      <form onSubmit={handleSubmit} className='column'>
        <h2>new password</h2>
        <div>
          <input type={showPassword ? 'text' : 'password'} placeholder='password' value={password} onChange={(e)=> setPassword(e.target.password)} style={{marginRight:"12px"}}/>
          {showPassword ? (<BsFillEyeFill onClick={toggleShowPassword}/>) : (<BsFillEyeSlashFill onClick={toggleShowPassword}/>)}
        </div>
        <button type='submit' className='btn'>Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
