import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Threads from '../Components/Threads';
import { appwriteConfig, database, storage } from '../appwriteConfig';
import { Query,ID } from 'appwrite';
import { FaRegImage } from "react-icons/fa";
import Header from '../Components/Header'
import { useNavigate } from 'react-router-dom';
import Popup from '../Components/Popup';
import { useAuth } from '../../functions/myFun/src/Context/AuthContext';
import { createPortal } from 'react-dom';


const Feed = () => {

  const[thread, setThread]= useState([]); //array of all posts
  const[threadbody,setThreadbody]=useState(''); //post body
  const[threadimg, setThreadimg]=useState(null); //post image
  const fileRef = useRef(null) //to get reference of uploaded image 
  const navigate = useNavigate();
  const [dialog,setDialog] = useState(false)
  const {user} = useAuth();
  
  
  //get threads from all user, from appwrite
  const getThread=async()=>{
    // get ids of users following by user
    const following_IDs= user.profile.following
    console.log(following_IDs);
    let feed_Posts=[];
 ///add user own post to feed
    const  user_recent_posts= await database.listDocuments(appwriteConfig.databaseid,appwriteConfig.collectionid,[Query.orderDesc('$createdAt'),Query.equal('owner_id', user.profile.$id),Query.limit(1)]);

    feed_Posts=[...feed_Posts, ...user_recent_posts.documents];
    
    for(let i=0; i < following_IDs.length ; i++){

      console.log(following_IDs[i])

   // add post of user which we are following in our feed
    const  user_following_posts= await database.listDocuments(appwriteConfig.databaseid,appwriteConfig.collectionid,[Query.orderDesc('$createdAt'),Query.equal('owner_id', following_IDs[i]),Query.limit(1)]);
    
    
    
    //use spread operator to add array of data in recent data
    feed_Posts=[...feed_Posts, ...user_following_posts.documents]
  }

  setThread(feed_Posts); //will save document in threads  
  
  }

  
  useEffect(()=>{
    if(user === undefined || null){
      window.location.reload(true)
      }
    if(user){
      getThread();
    }else{
      navigate('/login')
    }
    window
  }, [])


  const handleThreadSubmit=async(e)=>{
    e.preventDefault();
    const payload= {"owner_id":user.$id ,"body":threadbody,"image":threadimg}
    //appwrite create document
    const response = await database.createDocument(
      appwriteConfig.databaseid, appwriteConfig.collectionid,ID.unique(),payload
    )
    setThread(previousState =>[response,...previousState]) //it will add new thread in list of previous threads
    setThreadbody(""); //set thread body empty for new threads
    setThreadimg(null);

  }

//this function will only handle click to upload file  from local device by clicking on image
  const handleClick=async(e)=>{
    fileRef.current.click();
  }

  const handleFileChange=async(e)=>{

    const fileObj = e.target.files && e.target.files[0]; //create file object which will have value of file we uploaded
    //now send this file to bucket in appwrite
    if(!fileObj){ //if file is empty retun nothing
      return
    }
         //IMAGE UPLOAD to bucket in appwrite
    const response = await storage.createFile(appwriteConfig.bucketid,ID.unique(),fileObj);
        //image link set in document of user in appwrite
        const imagePreview = storage.getFilePreview(appwriteConfig.bucketid,response.$id)
        setThreadimg(imagePreview.href);
  }


  return (
    <div>
      <div>
      <Header/>
      </div>
      <div className='flex justify-center mt-10'>
      {createPortal(<Popup  trigger={dialog} setTrigger={setDialog}></Popup>,document.getElementById('portalDiv'))}
        </div>
    <div className='container mx-auto max-w-[600px]'> 
    <div className='p-4'>
      <form onSubmit={handleThreadSubmit}>
        <textarea className="bg-gray-200 p-4 w-full h-24 rounded-lg text-black  rounde-lg focus:text-black"
        required
        name='body'
        placeholder='Say something...'
        value={threadbody}
        onChange={(e)=>{setThreadbody(e.target.value)}}>
        </textarea>
      
        <img src={threadimg}/>

        <input type='file' ref={fileRef} onChange={handleFileChange} style={{display:'none'} }/>
        

        <div className='flex justify-between items-center'>
        <FaRegImage onClick={handleClick} className='cursor-pointer' size={24}/>
          
            <input type='submit' value={'post'}  className="bg-white text-sm text-black px-4 py-2 rounded hover:bg-gray-200 ">
          </input>
        </div>
      </form>
      <div className='class="flex-grow border-t border-gray-400 mt-2'></div>
    </div>
     {thread.map(thread => (
      <Threads key={thread.$id} thread={thread} setThread={setThread} />
))}
        </div>
        </div>
     
  )
}
export default Feed