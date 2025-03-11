import React, { useState, useEffect } from 'react';
import { FaXmark, FaPenToSquare, FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Timestamp } from "firebase/firestore"; 
import { firestore } from '../../config/firebase';

const db = firestore;

function Modal({onClose}) {
  // State management
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const modalRef = React.useRef();

  // Firebase refs
  const messageRef = db.collection('user-info');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [users] = useCollectionData(query, { idField: 'id' });
  const channelsRef = db.collection('channels');

  // Search and filter users
  useEffect(() => {
    if (users) {
      if (search !== "") {
        const filteredUsers = users.filter(user => 
          user.username.toLowerCase().includes(search.toLowerCase())
        );
        setSearchData(filteredUsers);
      } else {
        setSearchData(users);
      }
    }
  }, [search, users]);

  // Event handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (membersList.length > 0) {
      await channelsRef.add({
        name: channel,
        createdAt: Timestamp.now(),
        members: membersList,
      });
    }
    onClose();
  };

  const toggleMember = (username) => {
    setMembersList(prevMembers => 
      prevMembers.includes(username)
        ? prevMembers.filter(member => member !== username)
        : [...prevMembers, username]
    );
  };

  return (
    <div ref={modalRef} className='modal'>
      <div className='flex flex-col items-center justify-center gap-5 text-white bg-gray-600 rounded-xl px-10 pt-5 pb-10 mx-4'>
        <button onClick={onClose} className='place-self-end border-none bg-gray-600 m-0 p-0'>
          <FaXmark size={20} color='white'/>
        </button>
        
        <h1 className='text-3xl font-bold'>Create a channel</h1>
        
        <form className='flex flex-col justify-center items-center' onSubmit={handleSubmit}>
          <input 
            type="text"
            onChange={(e) => setChannel(e.target.value)}
            placeholder='Channel name'
            required 
            className='w-full text-black bg-white rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-600'
          />
          
          <div>
            <input 
              type="text"
              placeholder='Search users'
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className='w-full text-black bg-white rounded-md px-3 py-2 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-600'
            />
            
            <div className='flex flex-col gap-2 mt-2 bg-white rounded-md px-3 py-2'>
              {searchData?.map((data, index) => (
                <div onClick={() => toggleMember(data.username)} key={index} className='user-row'>
                  <span>{data.username}</span>
                  {membersList.includes(data.username) ? <FaCircleMinus size={20} /> : <FaCirclePlus size={20} />}
                </div>
              ))}
            </div>
          </div>
          
          <button type='submit' className='mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md'>
            <FaPenToSquare /> Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;