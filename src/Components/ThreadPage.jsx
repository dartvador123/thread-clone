import React,{useEffect,useState} from 'react'
import Threads from './Threads';
import { useParams, useNavigate } from 'react-router-dom'
import { appwriteConfig, database } from '../appwriteConfig';
import { BsPersonFill } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { LuFileSignature } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAuth } from '../../functions/myFun/src/Context/AuthContext';
import { IoMdArrowRoundBack } from "react-icons/io";
import {ID, Query} from 'appwrite'
import Comments from './Comments';



const ThreadPage = () => {
  const {id} = useParams('');
const [loading,setLoading]= useState(true);
  const [thread, setThread] = useState(null);
  const {user} = useAuth();
  const navigate = useNavigate();
  const[commentbody,setCommentBody]=useState(''); //comment body
  const [comment_data,setComment_Data]= useState('');
  const [comments,setComments]= useState([]);
  //const[commentimg,setCommentImg]=useState(''); //comment image



   useEffect( () => {
    if(user){
    getThreadpage();
    getComments();
    }else{
      navigate('./login')
    }
   },[])
  
  const getThreadpage=async () => {
    const data = await database.getDocument(appwriteConfig.databaseid,appwriteConfig.collectionid,id);
    setThread(data);
    setLoading(false);
  }

  const handleCommentSubmit=async(e)=>{
    e.preventDefault();
    const payload= {"owner_id":user.$id,'thread_id':id ,"body":commentbody, 'owner_img':user.profile.profile_pic, 'owner_name':user.profile.username}  //,"image":commentimg}
    //appwrite create document
    const response = await database.createDocument(
      appwriteConfig.databaseid, appwriteConfig.commentCollectionid,ID.unique(),payload
    )
    console.log('commentdata',response)
    setComment_Data(response.$id)
   setComments(previousState =>[response,...previousState]) //it will add new thread in list of previous threads
    setCommentBody(""); //set thread body empty for new threads
   // setCommentImg(null);
  }
console.log('ownerdata',comments)
  //get all comments of same document-id 
  const getComments=async ()=>{
    const response  = await database.listDocuments(appwriteConfig.databaseid,appwriteConfig.commentCollectionid,[Query.orderDesc('$createdAt'), Query.equal('thread_id',id)]);
   
    setComments(response.documents);
    console.log('comments',response.documents)
  }

  return (
    
    <div>
      {loading? (<p> Loading </p>): (   <div  className='container mx-auto max-w-[1000px] p-4 '>  <div className='flex justify-evenly p-4'>
      <IoMdArrowRoundBack size={24} className='fill-white  hover:scale-125' onClick={() => navigate(-1)} />
      <Link to = {'/'}>
            <GoHome size={24} className='fill-white  hover:scale-125'/>
            </Link>
            <FaSearch size={24} className='fill-white hover:scale-125' onClick={()=> navigate('/search')}/>
            <LuFileSignature size={24} className='fill-white hover:scale-125'/>
            <FaHeart size={24} className='fill-white hover:scale-125'/>
            <Link to = {`/profile/${user.profile.username}`}>
            <BsPersonFill size={24} className='fill-white hover:scale-125' />
            </Link>
    </div>
    <hr className="mt-4 h-px bg-gray border-1 dark:bg-gray-700"></hr>
    <div className='flex justify-center'>
       <Threads thread={thread} />
       </div> 
       <div className='container mx-auto max-w-[500px] p-2 '>
    <form onSubmit={handleCommentSubmit}>
        {user? (<textarea className="bg-gray-200 p-4 w-full h-24 rounded-lg text-black  rounde-lg focus:text-black"
        required
        name='body'
        placeholder='Say something...'
        value={commentbody}
        onChange={(e)=>{setCommentBody(e.target.value)}}>
        </textarea>): (null)}
        <input type='submit' value={'post'}  className="bg-white text-sm text-black px-4 py-2 rounded hover:bg-gray-200 ">
          </input>
        </form>
        <hr className="mt-4 h-px bg-gray border-1 dark:bg-gray-700"></hr> 
    </div>
    <div className='container mx-auto max-w-[500px]'>
          {comments.map(comment => (
      <Comments key={comment.$id} comment={comment} setComments={setComments}  />
))}
    </div>
      </div>)}
    </div>
  )
}

export default ThreadPage