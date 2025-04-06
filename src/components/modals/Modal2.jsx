import React, { useRef } from 'react';
import { FaXmark } from "react-icons/fa6";
import 'firebase/compat/firestore';
import oranges from '../../assets/img/oranges-in-a-box.jpg';

function Modal2({ onClose }) {
  const modalRef = useRef();
  return (
    <div ref={modalRef} className='modal'>
      <div className='flex flex-col items-center justify-center gap-0 text-white text-center bg-gray-600 rounded-xl px-10 pt-5 pb-10 mx-4 w-fit'>
        <button onClick={onClose} className='place-self-end border-none bg-gray-600 m-0 p-0'>
          <FaXmark size={20} color='white' />
        </button>
        
        <h1 className='text-3xl font-bold'>THE ORANGE ARMY V4.2.0 🥳🥳</h1>

        <p className='text-center'>This new update includes:</p>
        <ol className='text-center'>
            <li>YAY MOBILE VERSION</li>
        </ol> 
        <br />
        <img src={oranges} alt="oranges in a box" className='w-1/4' />
      </div>
    </div>
  );
}

export default Modal2;
