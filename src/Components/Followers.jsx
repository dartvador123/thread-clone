import React, { useEffect } from 'react'
import { useAuth } from '../../functions/myFun/src/Context/AuthContext'

const Followers = ({data}) => {
  const {user} = useAuth();

  console.log('follower',data)



  //////////////////////////Follow Unfollow Code Snipet////////////start/////
const toggleFollow=async()=>{

  const following = user.profile.following
  const followers= profile.followers

  refButton.current.disabled = true;
  //increase or decrease following of user
  if(following.includes(profile.$id)){ //if current user is already following the post
    //then remove user from array
    const index = following.indexOf(profile.$id); //get index of current user
    //The splice() function is the only native array function that lets you remove elements from the middle of the array without creating a new array
    following.splice(index,1); //remove 1 item at index
    
  }else{
    // push() function that lets you add elements to the end of the array
    following.push(profile.$id);
    
  }

  //increase or decrease follower of profile, user is going to follow
  if(followers.includes(user.$id)){ //if current user is already following the post
    //then remove user from array
    const index = followers.indexOf(user.$id); //get index of current user
    //The splice() function is the only native array function that lets you remove elements from the middle of the array without creating a new array
    followers.splice(index,1); //remove 1 item at index
    
    
  }else{
    // push() function that lets you add elements to the end of the array
    followers.push(user.$id)
    
  }

  //update both users

  const payload1 ={
    'following': following,
    'following_count': following.length
  }

  const payload2 ={
    'followers': followers,
    'follower_count': followers.length
  }
/////user is going to follow or unfollow profile
  const response1 = await database.updateDocument(
    appwriteConfig.databaseid,appwriteConfig.profileCollecionid,user.$id,payload1
  )
  
  //profile is going to follow or unfollow from user
  const response2 = await database.updateDocument(
    appwriteConfig.databaseid,appwriteConfig.profileCollecionid,profile.$id,payload2
  ) 
  setProfile(response2)

  refButton.current.disabled = false;
}

//////////////////////////Follow Unfollow Code Snipet//////////////end///

  return (
    
    <div>
     <div> <div className='text-white flex justify-evenly gap-20'>
      <div className='flex justify-start p-4 '>
      <img className=" h-10 w-10  rounded-full object-cover  " src={data.profile_pic}></img>
      <h2 className="ml-2 ">{data.username}</h2>
      </div>
      <button className=' p-1 mr-10 mb-2 border-b-2 border-transparent hover:border-white' onClick={toggleFollow}> Follow </button>
    </div>
    <hr className="mt-1 h-px bg-gray-200 border-1 dark:bg-gray-700"></hr></div>
    </div>
  )
  }
export default Followers