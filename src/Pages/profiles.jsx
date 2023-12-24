import { Query } from 'appwrite';
import React, { useState, useEffect,useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { appwriteConfig, database } from '../appwriteConfig';
import Threads from '../Components/Threads';
import FollowersDialog from '../Components/FollowersDialog';
import { createPortal } from 'react-dom';
import Header from '../Components/Header';
import { useAuth } from '../../functions/myFun/src/Context/AuthContext';


const Profiles = () => {
  const [thread,setThread] = useState([]);
  const [profile,setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const {username} = useParams('');
  const [dialog,setDialog] = useState(false)
  const refOne = useRef(null);
  const {user}= useAuth();
  const navigate = useNavigate();
  const refButton = useRef(null);
  
  
  useEffect(()=>{
    if(user){
    getProfile();
    }else{
      navigate('/login')
    }
    document.addEventListener("click",handleClickOutside,true)

return (()=>{ document.removeEventListener("click",handleClickOutside,true)})
    
  },[])
  
  //get threads of individual user from appwrite
  const getThread=async(owner_id)=>{
    //appwrite get document by descending order with matching owner id to place it in profile 
    const  response= await database.listDocuments(appwriteConfig.databaseid,appwriteConfig.collectionid,[Query.equal('owner_id', owner_id), Query.orderDesc('$createdAt')])
    setThread(response.documents); //will save document in threads
   
  }

const getProfile = async ()=>{
  const  response= await database.listDocuments(appwriteConfig.databaseid,appwriteConfig.profileCollecionid,[Query.equal('username',username),Query.limit(1)])
  console.log(response.documents[0])
  getThread(response.documents[0].$id);
  setProfile(response.documents[0]);

  setLoading(false);

}

if(!dialog){
  {document.body.style.overflow = "scroll"}
}else{
  document.body.style.overflow = "hidden";
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
});
}

const handleClickOutside=(e)=>{
  if(!refOne.current.contains(e.target)){
    setDialog(false);
  }else{
    setDialog(true)
   
  }
}
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
    <>
    <Header/>
    <div> 
     {!loading? (<div className='container mx-auto max-w-[600px]'>
      <div>
        <div className='flex justify-between'>
        <h1 className='mt-2'> {profile.username} </h1>
        <img className='mt-4  mr-4 h-24 w-24 border-2 border-white  rounded-full object-cover'  src={profile.profile_pic}/>
        </div>
        <h2 className='text-left'> {profile.bio} </h2>
        <div className='flex justify-evenly gap-20 mt-4'>
        
        <button onClick={()=>{setDialog(true)}}>
    <h3 className=' font-light text-white/50'> {profile.follower_count} followers</h3></button>
        {createPortal(<FollowersDialog  owner_data={profile}  trigger={dialog} setTrigger={()=>setDialog(true)} reference={refOne} />,document.getElementById('portalDiv'))}
        <a href={profile.link} className=' mt-1 font-light text-white/50'>{profile.link}</a>
        <div className='flex flex-col gap-2' >

          {(user.$id === profile.$id)? (null) : ( <button className='flex justify-center rounded-lg border-b-1  border-transparent hover:border-white  p-1 border-2 w-[4] bg-black  text-white font-bold' onClick={toggleFollow} ref={refButton} > {user.profile.following.includes(profile.$id)? (<h2>Unfollow</h2>):(<h2>Follow</h2>)} </button>)}

        </div >
        </div>
        <hr className="mt-4 h-px bg-gray-200 border-2 dark:bg-gray-700"></hr>
        <div className='flex justify-center gap-40 p-1 item-center'>
      <button className='hover:border-b-2'> Thread</button>
      <button className='hover:border-b-2'> Replies</button>
      <button className='hover:border-b-2'> Reposts</button>
      </div>
      <hr className="mt-4 h-px bg-gray-200 border-1 dark:bg-gray-700"></hr>
        </div>
        <div className='flex justify-center mt-10'>
        </div>
        
      {thread.map(thread => (
      <Threads key={thread.$id} thread={thread} setThread={setThread} />
))}
      </div>
      ):(<p> Loading </p>)}     

      </div>   
      </>
      
  )
  
}
export default Profiles