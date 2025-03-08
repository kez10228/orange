import React, { useRef } from 'react';
import { FaXmark } from "react-icons/fa6";
import 'firebase/compat/firestore';
import oranges from './oranges-in-a-box.jpg';

function Modal2({onClose}) {
  const modalRef = useRef();
  return (
    <div ref={modalRef} className='modal'>
      <div className='flex flex-col items-center justify-center gap-0 text-white bg-gray-600 rounded-xl px-10 pt-5 pb-10 mx-4'>
        <button onClick={onClose} className='place-self-end border-none bg-gray-600 m-0 p-0'>
          <FaXmark size={20} color='white'/>
        </button>
        
        <h1 className='text-3xl font-bold'>THE ORANGE ARMY</h1>
        <h1 className='text-3xl font-bold'>V4.00 🥳🥳</h1>

        <p className='text-center'>This new update includes:</p>
        <ol className='text-center'>
            <li>Redesigned login and signup pages</li>
            <br />
            <li>Implimented page navigation (React router dom)</li>
            <br />
            <li>ERROR in ./src/components/Modal2.jsx
Module build failed (from ./node_modules/babel-loader/lib/index.js): Unexpected token, expected "from" (4:13)

  2 | import { FaXmark } from "react-icons/fa6";
  3 | import 'firebase/compat/firestore';
4 | import  from './oranges-in-a-box.jpg';
    |              ^
  5 |

ERROR in [eslint]
src\components\Modal2.jsx
  Line 4:13:  Parsing error: Unexpected token, expected "from" (4:13)

webpack compiled with 2 errors and 1 warning
</li>
        </ol> 
        <br />
        <img src={oranges} alt="oranges in a box" className='w-1/4' />
      </div>
    </div>
  );
}

export default Modal2;
