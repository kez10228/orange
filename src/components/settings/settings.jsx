import React, { useRef, useState } from 'react';
import { FaXmark } from "react-icons/fa6";
import pfp from '../../assets/img/OIG4.jpg';
import { firestore, auth } from '../../config/firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import './settings.css';
import OnlinePresence from '../../assets/svgs/OnlinePresence';

function Settings({ onClose }) {
  const modalRef = useRef();
  const [settingNo, setSettingNo] = useState(1);
  const [about, setAbout] = useState("No about me set yet!"); // State for "about"
  const [originalAbout, setOriginalAbout] = useState(""); // Store the original "about" value
  const currentUsername = auth.currentUser.email.slice(0, -20);
  const usersRef = firestore.collection('user-info');
  const [users] = useCollectionData(usersRef, { idField: 'id' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!about || about === originalAbout) return; // Prevent unnecessary updates

    try {
      // Find the document for the current user
      const userDoc = await firestore
        .collection("user-info")
        .where("username", "==", currentUsername)
        .get();

      if (!userDoc.empty) {
        // Update the "about" field in the user's document
        const docId = userDoc.docs[0].id; // Get the document ID
        await firestore.collection("user-info").doc(docId).update({about: about});

        // Update the originalAbout state to reflect the saved value
        setOriginalAbout(about);
        alert("About Me updated successfully!");
      } else {
        console.error("User document not found.");
      }
    } catch (error) {
      console.error("Error updating About Me:", error);
    }
  }

  // Update "about" when users data changes
  React.useEffect(() => {
    if (users) {
      const currentUser = users.find(user => user.username === currentUsername);
      if (currentUser) {
        const aboutValue = currentUser.about || "No about me set yet!";
        setAbout(aboutValue);
        setOriginalAbout(aboutValue); // Store the original value
      }
    }
  }, [users, currentUsername]); // Dependency array ensures this runs when users or currentUsername changes

  let setting;
  if (settingNo === 1) {
    setting = (
      <div className="setting-box">
        <p className="setting-title">My Account</p>
        <div className="profile-border">
          {/* From UIVERSE.COM by catraco */}
          <div className="container setting-pattern-1"></div>
          <img src={pfp} alt="pfp" className="pfp-userInfo" />
          <OnlinePresence onlineClassName="online-settings" />
          <div className="-translate-y-3">
            <p className="username-info">{currentUsername}</p>
            <p className="status-info">Online</p>
          </div>
          <div className="settings-about-me">
            <p className="font-bold">About me</p>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <textarea
                type="text"
                value={about} // Bind to state
                onChange={(e) => setAbout(e.target.value)} // Allow editing
                className="bg-gray-900 border-none text-white h-20 mr-3"
              />
              {/* Show the Save button only if the about value has changed */}
              {about !== originalAbout && (
                <button 
                  className="p-3 
                  self-center border-none 
                  bg-blue-800hover:bg-blue-900"
                  type='submit'
                >
                  Save
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={modalRef} className="modal h-screen w-full">
      <div className="h-screen w-full flex flex-row gap-0 text-white bg-gray-600 rounded-xl">
        <button
          onClick={onClose}
          className="top-0 border-none fixed bg-gray-600 mt-3 mr-3 p-0 right-0"
        >
          <FaXmark size={20} color="white" />
        </button>
        <div className="settings-container">
          <div className="main-settings">
            <p className="setting-heading">USER SETTINGS</p>
            <button className="setting" onClick={() => setSettingNo(1)}>
              My account
            </button>
          </div>
        </div>
        <div className="settings-box">{setting}</div>
      </div>
    </div>
  );
}

export default Settings;
