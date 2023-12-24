import React,{useState} from 'react'
import { useAuth } from '../../functions/myFun/src/Context/AuthContext';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import { appwriteConfig, database } from '../appwriteConfig';
import {ID} from 'appwrite'


const Commentdialog = ({ownerprofilepic, body,img, name, threadtime,trigger,reference,threadid}) => {
  const[commentbody,setCommentBody]=useState(''); //comment body
  const {user} = useAuth();

  TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)


const handleCommentSubmit=async(e)=>{
  e.preventDefault();
  const payload= {"owner_id":user.$id,'thread_id':threadid ,"body":commentbody, 'owner_img':user.profile.profile_pic, 'owner_name':user.profile.username}  //,"image":commentimg}
  //appwrite create document
  const response = await database.createDocument(
    appwriteConfig.databaseid, appwriteConfig.commentCollectionid,ID.unique(),payload
  )
  console.log(response)
  setCommentBody('')
}

  return ( (trigger)? (
    <div className='fixed mt-12 items-center z-2 w-[800px] h-[200px]  m-auto inset-x-0 inset-y-0 p-4rounded-sm'>
  <div  ref={reference} className='container mx-auto  max-w-auto max-h-[700px] w-1/2 rounded-lg border-4 p2 bg-black text-white scroll-y-none'>
    <div className='container mx-auto'>
    <div className='object-contain h-auto w-auto mr-10'>
      <div className='flex justify-start p-4 ' >
        <img className=" h-10 w-10  rounded-full object-cover  " src={ownerprofilepic}></img>
        <div className='w-full x-2 mb-2'>
          {/* Thread head*/}
        <div className='flex justify-between'>
          <strong className="ml-2 ">{name}</strong>
          <div className='flex items-center'>
          <p className='text-[#777777]'> { <ReactTimeAgo date={new Date(threadtime).getTime()} locale="en-US"/>} </p>
            </div>
          </div>
          {/* Thread body*/}
          <p className='p-2 mb-10 mr-10 text-white ' style={{whiteSpace:'pre-wrap'}}>   {body} </p>
          <div className='p-4'>
          {img && (<img className=' object-cover rounded-lg border-2 border-gray' src={img}></img>)}
          </div>
          </div>
          </div>
      </div>
    </div>
      
     <div className='container mx-auto max-w-[500px] p-2 '>
  <form onSubmit={handleCommentSubmit}>
      {user? (<textarea className="bg-gray-200 p-4 w-full h-24 rounded-lg text-black  rounde-lg focus:text-black"
      required
      name='body'
      placeholder={`Reply to ${name} . . .`}
      value={commentbody}
      onChange={(e)=>{setCommentBody(e.target.value)}}>
      </textarea>): (null)}
      <input type='submit' value={'post'}  className="bg-white text-sm text-black px-4 py-2 rounded hover:bg-gray-200 ">
        </input>
      </form>
      </div>
  </div>
  </div>
  ) : (null)
  )
}
export default Commentdialog