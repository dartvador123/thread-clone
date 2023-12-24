import React,{useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../../functions/myFun/src/Context/AuthContext';
import logo from '../Media/logo.png'


const Login = () => {

  const  loginForm = useRef(null);
  const {loginUser,user} = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
  if(user){
    navigate('/')
  }
  },[])

//get  values from login form and pass it to method loginUser in auth context
const handleSubmit=async(e)=>{
e.preventDefault();
const email= loginForm.current.email.value;
const password= loginForm.current.password.value;
loginUser({email,password});
}


  return (

    <div className='flex items-center justify-center h-screen' >
      <div >
      <img src={logo} ></img>
      <form className="mx-auto p-4 border-4 max-w-[400px] border-white mb-60" onSubmit={handleSubmit} ref={loginForm}>
        <div className='py-2'> 
          <label>Email: </label>
          <input type='email' 
          required
          className='w-full text-black p-2 rounded-sm'
          placeholder='Email Address'
          name='email'></input>
        </div>
        <div className='py-2'>
          <label>Password: </label>
          <input type='password' 
          required
          className='w-full text-black p-2 rounded-sm'
          placeholder='Password'
          name='password'></input>
        </div>
        <div className=' mt-2 mx-auto border-2 w-1/2 hover:bg-white hover:text-black  text-white font-bold py-2 px-4 rounded-sm flex justify-center'>
          <input  type='submit' name='login'></input>
        </div>
        <div className='flex justify-center py-4'>
        <p>Don't have an account? <Link to='signup'>SignUp</Link></p>
        </div>
       
      </form>
      </div>
    </div>
  )
}
export default Login