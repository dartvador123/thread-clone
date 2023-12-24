import React from 'react'

const Popup = (props) => {
  return ((props.trigger)? (
    <div className='fixed mt-12 items-center z-20 h-20 w-full m-auto inset-x-0 inset-y-0 p-4rounded-sm'>
    <div className='container mx-auto  max-w-[400px] h-[150px] w-1/2 rounded-lg border-4 p2  bg-white text-black scroll-y-none'>
      <div className='text-center'>
      <h1 className='mt-2'>ALert</h1>
      <p className='mt-2'> Please login Yourself to enjoy Thread completely</p>
      <button className='border-2 mb-2 border-black px-2 mt-4' onClick={()=>props.setTrigger(false)}> Okay 
      </button>
      </div>
    </div>
    </div>) : ('') 
  )
}

export default Popup