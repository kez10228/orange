import React from 'react'
import "./userInfo.css";
import pfp from "./OIG4.jpg";
import firebase, { auth, firestore, database } from '../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function UserInfo({username, status, notFound}) {
  const onlineStatus = 
  (
    <svg y={17} width={25} height={15} className="online-info" viewBox="0 0 25 15">
      <mask id=":r3:">
          <rect x="7.5" y={5} width={10} height={10} rx={5} ry={5} fill="white" />
          <rect x="12.5" y={10} width={0} height={0} rx={0} ry={0} fill="black" />
          <polygon
              points="-2.16506,-2.5 2.16506,0 -2.16506,2.5"
              fill="black"
              transform="scale(0) translate(13.125 10)"
              style={{ transformOrigin: "13.125px 10px" }}
          />
          <circle fill="black" cx="12.5" cy={10} r={0} />
      </mask>
      <rect fill="#23a55a" width={25} height={15} mask="url(#:r3:)" />
    </svg>
  );

  const offlineStatus = (
    <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 10 10" fill="none" className='offline-info'>
        <circle cx={5} cy={5} r={5} fill="#D9D9D9" />
        <g style={{ mixBlendMode: "plus-darker" }}>
            <circle cx={5} cy={5} r={2} fill="#80848E" />
        </g>
    </svg>
  );
  let createdAt;
  const usersRef = firestore.collection('user-info');
  const [users] = useCollectionData(usersRef, { idField: 'id' });
  users?.map((user) => {
    if (user.username === username) {
      createdAt = user.createdAt;
      return createdAt;
    }
  });
  createdAt = createdAt?.toDate()
  let special = false;
  if (username === "orange" || username === "test") {
    special = true;
  }
  if (notFound) {
    return (
      <div className='userInfo bg-gray-700'></div>
    );
  } else {
    return (
      <div className='userInfo'>
        {/* From UIVERSE.COM by catraco */}
        <div class="container"></div>
          <img src={pfp} alt="pfp" className='pfp-userInfo' />
          <p className='username-info'>{username}</p>
          <p className='status-info'>{status}</p>
          {status === "online" ? onlineStatus : offlineStatus}
          <div className="aboutme">
            <div className="aboutbox">
              <p className='font-bold'>About me</p>
              {special ? <p>This is a special user (creator of website). His pronouns are depre/ssed and his pet 
                is called depression. BTW I need money donate please.</p> : <p>Lorem 
                ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum.</p>
              }
            </div>
            <hr />
            <p>Joined At: {createdAt?.toLocaleString('en-UK', { timeZoneName: 'short' })}</p>
          </div>
      </div>
    );
  } 
}

export default UserInfo