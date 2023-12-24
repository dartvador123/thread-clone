import React, { useEffect } from 'react'
import { useAuth } from '../../functions/myFun/src/Context/AuthContext'
import { useState } from 'react';
import { BsPersonFill } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { LuFileSignature } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { TfiMore } from "react-icons/tfi";
import logo from '../Media/logo.png'
import Search from './Search';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
 const {user,logOutUser} = useAuth();
 const[imgload,setimgload] = useState(false);
 const navigate = useNavigate();
 const [loading,setLoading] = useState(true);

 useEffect(()=>{
if(user === undefined || null){
window.location.reload(true)
}
if(user){
setLoading(false)
}else{
setLoading(true)
}
 },[])
 
 const handleLogOut=()=>{
  logOutUser();

 }
  return (<div>{!loading? (<div className='container mx-auto mt-4 max-w-[700px]'>
  {user? (
    <div>
      <div className='flex justify-evenly p-4'>
      <Link to = {`/profile/${user.profile.username}`}>
        <BsPersonFill size={24} className='fill-white hover:scale-125' />
        </Link>
        <Link to = {'/'}>
        <GoHome size={24} className='fill-white  hover:scale-125'/>
        </Link>
        <FaSearch size={24} className='fill-white hover:scale-125' onClick={()=> navigate(<Search/>)}/>
        <LuFileSignature size={24} className='fill-white hover:scale-125'/>
        <FaHeart size={24} className='fill-white hover:scale-125'/>
        <div className='flex justify-end'>
      <TfiMore size={24} className='hover:scale-125'/>
      </div>
      </div>
      
      <div  className="flex justify-between">
      <div className='flex justify-start'>
    <img src={logo} className='h-20 w-32 ' onClick={()=> window.location.reload(true)} />
  </div>
  <div className='flex justify-normal gap-10'>
    <div className='flex justify-self-end '>
      <img onLoad={()=> setimgload(true)}  className=" h-10 w-10  rounded-full object-cover mr-5" src={user.profile.profile_pic}/>
  <strong>
  Hello {user.name}
  </strong>
  </div>
  <div className=' ml-5 text-right'>
  <button className=' border-2 w-20  hover:bg-white hover:text-black  text-white font-bold ' onClick={handleLogOut}> Logout </button>
  </div>
  </div>
  </div>
  </div>
 ):(<div  className='text-center'>
    <button className='mt-2 mx-auto border-2 w-1/2  hover:bg-white hover:text-black  text-white font-bold' onClick={navigate('/login')}   ref={props.reference}>Login</button>
    </div>
  )}
  <hr className="mt-4 h-px bg-gray border-1 dark:bg-gray-700"></hr>
  </div>): (null)} </div>
    

  )
}

export default Header 