import React,{useEffect, useState,useCallback} from 'react'
import Followers from './Followers'
import { Query } from 'appwrite'
import { appwriteConfig,database } from '../appwriteConfig'




const FollowersDialog = (props) => {
  const[follower, setFollower]=useState(true)
  const[f_data,setf_data]= useState([])
  const[fwing_data,setfwing_data]= useState([])
  
 
useEffect(() => {
  getfollowers();
  getfollowing();
},[])


const getfollowers=useCallback(async () => {
  let followers_data=[];
 let follower_Ids=props.owner_data.followers;
 console.log('hi',props.owner_data.followers)
  for(let i=0; i < props.owner_data.followers.length; i++ ){
    const  follower_data= await database.listDocuments(appwriteConfig.databaseid,appwriteConfig.profileCollecionid,[Query.equal('userid',follower_Ids[i])])
    followers_data = [...followers_data,...follower_data.documents]
  }
  setf_data(followers_data)
},[])

const getfollowing=useCallback(async () => {
  let followings_data=[];
 let following_Ids=props.owner_data.following;
 console.log('hi',props.owner_data.following)
  for(let i=0; i < props.owner_data.following.length; i++ ){
    const  following_data= await database.listDocuments(appwriteConfig.databaseid,appwriteConfig.profileCollecionid,[Query.equal('userid',following_Ids[i])])
    followings_data = [...followings_data,...following_data.documents]
  }
  setfwing_data(followings_data)
},[])

  return  ( (props.trigger)? (
    
    <div className='fixed mt-12 items-center z-10 h-200 w-full m-auto inset-x-0 inset-y-0 p-4rounded-sm'>
    <div className='container mx-auto  max-w-[500px] h-[700px] w-1/2 rounded-lg border-4 p2 bg-black text-black scroll-y-none'  ref={props.reference}>
      <div className='flex justify-between' >
        <div className='flex flex-col   mt-1 border-b-1  border-transparent hover:border-white mx-auto p-1 border-2 w-1/2 bg-black  text-white font-bold'>
        <button onClick={()=>{setFollower(true)}}>Follower</button>
        <h2 className='flex justify-center'> {props.owner_data.follower_count} </h2>
        </div>
        <div className='flex flex-col  mt-1 border-b-1  border-transparent hover:border-white mx-auto p-1 border-2 w-1/2 bg-black  text-white font-bold'>
        <button onClick={()=>{setFollower(false)}}>Following</button>
        <h2 className='flex justify-center'> {props.owner_data.following_count} </h2>
        </div>
        </div>
        <hr className="mt-1 h-px bg-gray-200 border-1 dark:bg-white"></hr>
         {follower? (<div>{f_data.map (data => (
      <Followers  clicked={follower} key={data.$id} data={data} /> ))} </div>) : (<div>{fwing_data.map (data => (
        <Followers  clicked={follower} key={data.$id} data={data} /> ))} </div>)}
</div>
</div>

  ):(null))
}
export default FollowersDialog;