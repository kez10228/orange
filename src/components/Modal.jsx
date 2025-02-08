import React from 'react'
import { useState, useEffect } from 'react';
import { FaXmark, FaPenToSquare, FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Timestamp } from "firebase/firestore"; 

firebase.initializeApp({
  apiKey: "AIzaSyC2wpd-kO2xT6FqKOoh02BGot2TR6f8_PU",
  authDomain: "orange-ad7c2.firebaseapp.com",
  databaseURL: "https://orange-ad7c2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "orange-ad7c2",
  storageBucket: "orange-ad7c2.appspot.com",
  messagingSenderId: "634548881107",
  appId: "1:634548881107:web:192a3a3f247e25540e3626",
  measurementId: "G-7V3KZ2C9RQ"
});

const db = firebase.firestore();
var members = [];

function Modal({onClose}) {
  const [search, setsearch] = useState("");
  const [channel, setchannel] = useState("")
  const [searchData, setsearchData] = useState([])
  const [membersList, setMembersList] = useState([]);
  const modalRef = React.useRef();
  const messageRef = db.collection('user-info');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [users] = useCollectionData(query, { idField: 'id' });
  const ref = db.collection('channels');

  const handleChange = (e) => {
    setsearch(e.target.value);
  }

  const handleNameChange = (e) => {
    setchannel(e.target.value);
  }

useEffect(() => {
  if (search !== "" && users) {
    const newFilterData = users.filter(user => {
        return user.username.includes(search)
    });
    setsearchData(newFilterData);
  }
  if (users) {
    setsearchData(users);
  }
}, [search, users]);

  const closeModal = () => {
    members = [];
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (members.length > 0) {
      await ref.add({
        name: channel,
        createdAt: Timestamp.now(),
        members: members,
      });
    };
    console.log(members);
  }
  
  const addToArray = (user) => {
    if (!membersList.includes(user)) {
        setMembersList([...membersList, user]);
        members.push(user);
    } else {
        setMembersList(membersList.filter(member => member !== user));
        members = members.filter(member => member !== user);
    }
  }

  return (
    <div ref={modalRef} className='modal'>
      <div className='flex flex-col items-center justify-center gap-5 text-white bg-gray-600 rounded-xl px-10 pt-5 pb-10 mx-4'>
        <button onClick={closeModal} className='place-self-end border-none bg-gray-600 m-0 p-0'><FaXmark size={20} color='white'/></button>
        <h1 className='text-3xl font-bold'>Create a channel</h1>
        <form className='flex flex-col justify-center items-center' onSubmit={submit}>
          <input 
            type="text" onChange={handleNameChange} 
            placeholder='Channel name' required 
            className='w-full text-black bg-white 
            rounded-md px-3 py-2 mt-2 focus:outline-none 
            focus:ring-2 focus:ring-blue-600' 
          />
          <div>
            <input 
              type="text" placeholder='Search users' 
              onChange={handleChange} value={search}  
              className='w-full text-black 
              bg-white rounded-md px-3 py-2 
              mt-3 focus:outline-none focus:ring-2 
              focus:ring-blue-600'
            />
            <div className='flex flex-col gap-2 mt-2 bg-white rounded-md px-3 py-2'>
            {searchData.map((data, index) => (
                <div onClick={() => addToArray(data.username)} key={index} className='user-row'>
                    <span>{data.username}</span>
                    {membersList.includes(data.username) ? <FaCircleMinus size={20} /> : <FaCirclePlus size={20} />}
                </div>
            ))}
            </div>
          </div>
          <button type='submit' className='mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md'><FaPenToSquare /> Create</button>
        </form>
      </div>
    </div>
  )
}

export default Modal