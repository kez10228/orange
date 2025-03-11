import React from 'react'
import "./userInfo.css";
import pfp from "../../assets/img/OIG4.jpg";
import { firestore } from '../../config/firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import OnlinePresence from '../../assets/svgs/OnlinePresence';
import OfflinePresence from '../../assets/svgs/OfflinePresence';


function UserInfo({username, status, notFound}) {
  const onlineStatus = 
  (
    <OnlinePresence onlineClassName="online-info" />
  );

  const offlineStatus = (
    <OfflinePresence offlineClassName="offline-info" />
  );
  let createdAt;
  const usersRef = firestore.collection('user-info');
  const [users] = useCollectionData(usersRef, { idField: 'id' });
  users?.map((user) => {
    if (user.username === username) {
      createdAt = user.createdAt;
      return createdAt;
    }
    return null;
  });
  createdAt = createdAt?.toDate()
  let text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  
  if (username === "orange" || username === "test") {
    text = "This is a special user (creator of website). His pronouns are depre/ssed and his pet is called depression. BTW I need money donate please.";
  }
  if (username === "bean") {
    text = "BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN BEAN "
  }
  if (username === "kura") {
    text = "Crazy person that needs therapy, stole Kevin's pet depression..."
  }
  
  if (notFound) {
    return (
      <div className='userInfo bg-gray-700'></div>
    );
  } else {
    return (
      <div className='userInfo'>
        {/* From UIVERSE.COM by catraco */}
        <div className="container"></div>
          <img src={pfp} alt="pfp" className='pfp-userInfo' />
          <p className='username-info'>{username}</p>
          <p className='status-info'>{status}</p>
          {status === "online" ? onlineStatus : offlineStatus}
          <div className="aboutme">
            <div className="aboutbox">
              <p className='font-bold'>About me</p>
              <p>{text}</p>
            </div>
            <hr />
            <p>Joined At: {createdAt?.toLocaleString('en-UK', { timeZoneName: 'short' })}</p>
          </div>
      </div>
    );
  } 
}

export default UserInfo
