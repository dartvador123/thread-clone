import React,{useRef, useState} from 'react'
import { useAuth } from '../../functions/myFun/src/Context/AuthContext';
import logo from '../Media/logo.png'
const Signup = ()=>{
  const signupForm = useRef();
  const {signupUser}=useAuth();
  const [password,setPassword] = useState('');
  const [email, setEmail]=useState("")
 

 const [email_error, setEmail_error]=useState("");
 const [password_error, setPassword_error]=useState("");

 const [show_progress, setshow_progress]=useState(false);

  
  const handlepasswordChaange=(e)=>{
  
      setPassword(e.target.value);
      setPassword_error("");
  }

  const handleEmailChange=(e)=>{
    setEmail(e.target.value)
    setEmail_error( "");
  }
  

  
  //get  values from login form and pass it to method loginUser in auth context
const handleSubmit=async(e)=>{
  e.preventDefault();

  const username= signupForm.current.username.value;
  signupUser({email,password,username});
  console.log('password',password)
  }
  return (
    <div>
      <div className='flex items-center justify-center h-screen' >
      <div >
      <img src={logo} className='h-auto w-auto mt-24' ></img>
      <form className="mx-auto p-4 border-4 max-w-[400px] border-white mb-60" onSubmit={handleSubmit}   ref={signupForm}>
      <div className='py-2'> 
          <label>UserName: </label>
          <input type='name' 
          required
          className='w-full text-black p-2 rounded-sm'
          placeholder='UserName'
          name='username'></input>
        </div>
        <div className='py-2'> 
          <label>Email: </label>
          <input type='email' 
          required
          onChange={handleEmailChange}
          className='w-full text-black p-2 rounded-sm'
          placeholder='Email Address'
          name='email'></input>
        </div>
        <div className='py-2'>
          <label>Password: </label>
          <input type='password' 
          required
          onChange={handlepasswordChaange}
          className='w-full text-black p-2 rounded-sm'
          placeholder='Password'
          name='password'></input>
        </div>
        <div className='py-2'>
          <label>Confirm Password: </label>
          <input type='password' 
          required
          className='w-full text-black p-2 rounded-sm'
          placeholder='Password'
          name='password'></input>
        </div>
        <div className=' mt-2 mx-auto border-2 w-1/2 hover:bg-white hover:text-black  text-white font-bold py-2 px-4 rounded-sm flex justify-center'>
          <input  type='submit' name='submit'></input>
        </div>       
      </form>
      </div>
    </div>
    </div>
  )
}

export default Signup