import React from 'react'

const Following = ({data}) => {

  console.log('followers',data)

  return (
    <div>
    <div className='text-white flex justify-evenly gap-20'>
      <div className='flex justify-start p-4 '>
      <img className=" h-10 w-10  rounded-full object-cover" src={data.profile_pic}></img>
      <h2 className="ml-2 ">{data.username}</h2>
      </div>
      <button className=' p-1 mr-10 mb-2 border-b-2 border-transparent hover:border-white'> Follow </button>
    </div>
    <hr className="mt-1 h-px bg-gray-200 border-1 dark:bg-gray-700"></hr>
    </div>
  )
}

export default Following