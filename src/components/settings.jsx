import React, { useRef } from 'react';
import { FaXmark } from "react-icons/fa6";
import 'firebase/compat/firestore';

function Settings({onClose}) {
  const modalRef = useRef();
  return (
    <div ref={modalRef} className='modal h-screen w-full'>
        <div className='h-screen w-full flex flex-col items-center justify-center 
        gap-0 text-white bg-gray-600 rounded-xl'>
            <button onClick={onClose} className='place-self-end top-0 border-none fixed
             bg-gray-600 mt-3 mr-3 p-0'>
                <FaXmark size={20} color='white'/>
            </button>
            <div>Yea soooo im going to work on this later. SO LONG SUCKERS</div>
        </div>
    </div>
  );
}

export default Settings;
