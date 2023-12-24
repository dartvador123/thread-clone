import React, { useEffect, useState,useRef } from 'react'
import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { BiMessageRounded } from "react-icons/bi";
import { RiRepeat2Fill } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import { appwriteConfig, database } from '../appwriteConfig';
import { useAuth } from '../../functions/myFun/src/Context/AuthContext';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Commentdialog from './commentdialog';

const Threads = ({thread, setThread}) => {
const[loading, setLoading] = useState(true);
const[owner, setOwner] = useState({});
const refOne = useRef(null);
const [dialog,setDialog] = useState(false)
const[threadInstance, setThreadInstance]=useState(thread);
const {user} =useAuth();

TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

useEffect(()=>{

getUserInfo();

document.addEventListener("click",handleClickOutside,true)

return (()=>{ document.removeEventListener("click",handleClickOutside,true)})
},[])

if(!dialog){
  {document.body.style.overflow = "scroll"}
}else{
  document.body.style.overflow = "hidden";
}

const handleClickOutside=(e)=>{
  if(!refOne.current.contains(e.target)){
    setDialog(false);
  }else{
    setDialog(true)
   
  }
}

const handleThreadDelete=async()=>{

  database.deleteDocument(appwriteConfig.databaseid,appwriteConfig.collectionid,thread.$id)
  console.log('Thread was deleted');
  
  setThread(previousState => previousState.filter((item)=> item.$id != thread.$id)) //filter out item on base of id from new array 
}

//method to get data profile data of owners who created threads

const getUserInfo=async ()=>{
  try{
  const userData = await database.getDocument(appwriteConfig.databaseid,appwriteConfig.profileCollecionid,thread.owner_id);
  setOwner(userData)
}catch(error){
  console.log(error)
}
setLoading(false)
}

//puropose of this is to add or remove user from post liked array
const toggleLike =async () =>{
  
  const users_Who_Liked=thread.users_Who_Liked;
  

  if(users_Who_Liked.includes(user.$id)){ //if current user is already like the post
    //then remove user from array
    const index = users_Who_Liked.indexOf(user.$id); //get index of current user
    //The splice() function is the only native array function that lets you remove elements from the middle of the array without creating a new array
    users_Who_Liked.splice(index,1); //remove 1 item at index
    
  }else{
    // push() function that lets you add elements to the end of the array
    users_Who_Liked.push(user.$id)
  
  }
  //upload this new change data to appwrite
  const payload={'users_Who_Liked': users_Who_Liked, 'likes':users_Who_Liked.length}
  const response = await database.updateDocument(
    appwriteConfig.databaseid,appwriteConfig.collectionid,thread.$id,payload
  ) 

  setThreadInstance(response)
}


  return (
    <div>
 <div className='flex justify-start p-4 ' >
 <Link to = {`/profile/${owner.username}`}>
        <img className=" h-10 w-10  rounded-full object-cover  " src={owner.profile_pic}></img>
        </Link>
        <div className='w-full x-2 mb-2'>
          {/* Thread head*/}
        <div className='flex justify-between'>
          <strong className="ml-2 ">{owner.username}</strong>
          <div className='flex items-center'>
          <p className='text-[#777777]'> { <ReactTimeAgo date={new Date(thread.$createdAt).getTime()} locale="en-US"/>} </p>
            <MdOutlineMoreHoriz className='mt-1 ml-1' />
            {(user.$id===thread.owner_id)? (<MdDelete size={18} onClick={handleThreadDelete} className=' ml-1 cursor-pointer'/>): (null)}
            </div>
          </div>
          {/* Thread body*/}
          <Link to={`/thread/${thread.$id}`}>
          <p className='p-4 text-white' style={{whiteSpace:'pre-wrap'}}>   {thread.body} </p>
          <div className='p-4'>
          {thread.image && (<img className='mt-2 object-cover rounded-lg border-2 border-gray' src={thread.image}></img>)}
          </div>
          </Link>
          </div>
          </div>
          <div className='flex ml-4 gap-2 '>
            {user? (<FaHeart className='cursor-pointer' onClick={toggleLike} size={22} color={threadInstance.users_Who_Liked.includes(user.$id) ? ('#FF0000'):('#FFFFFF')}/>) : (<FaHeart  aria-disabled size={22} color={('#FFFFFF')}/>)}
            <BiMessageRounded size={22} className='fill-white cursor-pointer' onClick={()=>{setDialog(true)}}/>
            {createPortal(<Commentdialog threadid={thread.$id} ownerprofilepic={owner.profile_pic} body={thread.body} img={thread.image} name={owner.username} threadtime={thread.$createdAt}  trigger={dialog} setTrigger={()=>setDialog(true)} reference={refOne} />,document.getElementById('portalDiv'))}
            <RiRepeat2Fill size={22}/>
            <IoIosSend size={22} />
          </div>
          <div className='flex ml-4 mt-2 gap-4 border-b-2 border-[#777777] '>
            <p className='text-[#777777]'>
              0 Replies
            </p>
            <p className='text-[#777777] mb-2'> . </p>
            <p className='text-[#777777]'>
               {threadInstance.likes + ' Likes'}
            </p>
          </div>
          </div>
  )
}


export default Threads