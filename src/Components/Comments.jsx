import React, { useEffect, useState } from 'react'
import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { BiMessageRounded } from "react-icons/bi";
import { RiRepeat2Fill } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import { useAuth } from '../../functions/myFun/src/Context/AuthContext';
import { appwriteConfig, database } from '../appwriteConfig';


const Comments = ({comment,setComments}) => {
  const {user} = useAuth();
  const[commentInstance, setCommentInstance] = useState(comment);


  TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)



const handleCommentDelete=()=>{
  database.deleteDocument(appwriteConfig.databaseid,appwriteConfig.commentCollectionid,comment.$id)
  setComments(previousState => previousState.filter((item)=> item.$id != comment.$id)) //filter out item on base of id from new array 
  console.log('comment_data', comment)
}

const toggleLike =async () =>{
  
  const users_Who_Liked=comment.users_Who_Liked;
  
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
    appwriteConfig.databaseid,appwriteConfig.commentCollectionid,comment.$id,payload
  ) 

  setCommentInstance(response)
  console.log('payload',response)
}
 
  return (
    <div>
    <div className='flex justify-start p-4 ' >
        <img className=" h-10 w-10  rounded-full object-cover  " src={comment.owner_img }></img>
        <div className='w-full x-2 mb-2'>
          {/* Thread head*/}
        <div className='flex justify-between'>
          <strong className="ml-2 ">{comment.owner_name}</strong>
          <div className='flex items-center'>
          <p className='text-[#777777]'> { <ReactTimeAgo date={new Date(comment.$createdAt).getTime()} locale="en-US"/>} </p>
            <MdOutlineMoreHoriz className='mt-1 ml-1' />
            {(user.$id===comment.owner_id)? (<MdDelete size={18} onClick={handleCommentDelete} className=' ml-1 cursor-pointer'/>):(null)}
            </div>
          </div>
          {/* Thread body*/}
          
          <p className='p-1 text-white' style={{whiteSpace:'pre-wrap'}}>   {comment.body} </p>
          <div className='p-1'>
          {comment.image && (<img className='mt-2 object-cover rounded-lg border-2 border-gray' src={comment.image}></img>)}
          </div>
          </div>
          </div>
          <div className='flex ml-4 gap-2 '>
            {user? (<FaHeart className='cursor-pointer' onClick={toggleLike} size={22} color={commentInstance.users_Who_Liked.includes(user.$id) ? ('#FF0000'):('#FFFFFF')}/>) : (<FaHeart  aria-disabled size={22} color={('#FFFFFF')}/>)}
            <BiMessageRounded size={22} className='fill-white'/>
            <RiRepeat2Fill size={22}/>
            <IoIosSend size={22} />
          </div>
          <div className='flex ml-4 mt-2 gap-4 border-b-2 border-[#777777] '>
            <p className='text-[#777777]'>
              4 Replies
            </p>
            <p className='text-[#777777] mb-2'> . </p>
            <p className='text-[#777777]'>
               {commentInstance.likes + ' Likes'}
            </p>
          </div>  
    </div>
  )
}

export default Comments