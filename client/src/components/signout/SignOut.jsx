import React from 'react'

const SignOut = () => {

    const handleSignOut = ()=>{
        window.localStorage.removeItem("userID", "")
        window.location.reload(false)
    }
  return <button onClick={handleSignOut}>
    SignOut
  </button>
}

export default SignOut