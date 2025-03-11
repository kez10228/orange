import React, { useRef, useState } from 'react';
import { FaXmark } from "react-icons/fa6";
import 'firebase/compat/firestore';
import './settings.css';

function Settings({onClose}) {
  const modalRef = useRef();
  const [settingNo, setSettingNo] = useState(1);
  let setting;
  if (settingNo === 1) {
    setting = 
    <div className="setting-box">
      <p className='setting-title'>My Account</p>
      <div className="profile-border">
        {/* From UIVERSE.COM by catraco */}
        <div className="container setting-pattern-1"></div>
      </div>
      
    </div>
  }
  return (
    <div ref={modalRef} className='modal h-screen w-full'>
        <div className='h-screen w-full flex flex-row
        gap-0 text-white bg-gray-600 rounded-xl'>
            <button onClick={onClose} className='top-0 border-none fixed
             bg-gray-600 mt-3 mr-3 p-0 right-0'>
                <FaXmark size={20} color='white'/>
            </button>
            <div className='settings-container'>
              <div className="main-settings">
                <p className='setting-heading'>USER SETTINGS</p>
                <button className='setting' onClick={() => setSettingNo(1)}>My account</button>
              </div>
            </div>
            <div className="settings-box">
              {setting}
            </div>
        </div>
    </div>
  );
}

export default Settings;
