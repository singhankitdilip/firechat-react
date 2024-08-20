import React from 'react'
import Userlist from '../list/Userlist'
import Chatlist from '../list/Chatlist'

const List = () => {
  return (
    <div className='flex flex-1 flex-col border-gray-500 border-r'>
      <Userlist/>
      <Chatlist/>
    
    </div>
  )
}

export default List