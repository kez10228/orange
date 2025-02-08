import React, { useState, useRef } from 'react';
import { FaXmark } from "react-icons/fa6";
import 'firebase/compat/firestore';
import oranges from './oranges-in-a-box.jpg';
import valentine from './valentine.jpg';

function Modal2({onClose}) {
  const modalRef = useRef();
  return (
    <div ref={modalRef} className='modal'>
      <div className='flex flex-col items-center justify-center gap-0 text-white bg-gray-600 rounded-xl px-10 pt-5 pb-10 mx-4'>
        <button onClick={onClose} className='place-self-end border-none bg-gray-600 m-0 p-0'>
          <FaXmark size={20} color='white'/>
        </button>
        
        <h1 className='text-3xl font-bold'>THE ORANGE ARMY</h1>
        <h1 className='text-3xl font-bold'>V2.01</h1>

        <p className='text-center'>This new update includes:</p>
        <ol className='text-center'>
            <li>New domain: <a href="https://orangearmy.co.uk">orangearmy.co.uk</a></li>
            <br />
            <li>Fancy popups like this one</li>
            <br />
            <li>That's it, why did I add this last one: IDK</li>
        </ol> 
        <p className='text-center'>And BTW happy valentines on the 14th Feb :)</p>
        <br />
        <img src={oranges} alt="oranges in a box" className='w-1/4' />
        <img src={valentine} alt="oranges in a box" className='w-1/4' />
      </div>
    </div>
  );
}

export default Modal2;
