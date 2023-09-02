import { Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/register/Register';
import Login from './components/login/Login';
import ResetPassword from './components/resetpassword/ResetPassword';
import ForgotPassword from './components/forgotpassword/ForgotPassword';
import SignOut from './components/signout/SignOut';
import VerifyPage from './components/verifypage/VerifyPage';

function App() {

  const checkSignIn = ()=>{
    return window.localStorage.getItem("userID")
  }

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<div style={{height:"100vh",display: "flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
          <h1>HomePage</h1>{checkSignIn() ? (<SignOut/>) : (<><a href='/login'>Login</a><a href='/register'>Register</a></>)}</div>}
        />
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/verify/:email/:verificationToken' element={<VerifyPage/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/reset_password/:id/:token' element={<ResetPassword/>}/>
      </Routes>
    </div>
  );
}

export default App;
