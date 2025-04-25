import React, { useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import pfp from "../../assets/img/OIG4.jpg";
import { firestore, auth } from "../../config/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./settings.css";
import OnlinePresence from "../../assets/svgs/OnlinePresence";
import { FaArrowUpFromBracket } from "react-icons/fa6";
import { UpdateOldMessages } from "../../test";

function Settings({ onClose }) {
  const modalRef = useRef();
  const [settingNo, setSettingNo] = useState(1);
  const [about, setAbout] = useState("No about me set yet!"); // State for "about"
  const [originalAbout, setOriginalAbout] = useState(""); // Store the original "about" value
  const currentUsername = auth.currentUser.email.slice(0, -20);
  const usersRef = firestore.collection("user-info");
  const [users] = useCollectionData(usersRef, { idField: "id" });

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
        await firestore
          .collection("user-info")
          .doc(docId)
          .update({ about: about });

        // Update the originalAbout state to reflect the saved value
        setOriginalAbout(about);
        alert("About Me updated successfully!");
      } else {
        console.error("User document not found.");
      }
    } catch (error) {
      console.error("Error updating About Me:", error);
    }
  };

  // Update "about" when users data changes
  React.useEffect(() => {
    if (users) {
      const currentUser = users.find(
        (user) => user.username === currentUsername
      );
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
          <div className="container setting-pattern-1"></div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="relative group w-16 h-16 rounded-full">
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                id="file-input"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Preview the image
                    const reader = new FileReader();
                    reader.onload = () => {
                      document.querySelector(".pfp-settings").src =
                        reader.result;
                    };
                    reader.readAsDataURL(file);

                    // Upload the file to the server
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      const response = await fetch(
                        "https://api.orangearmy.co.uk/upload", // Changed to https
                        {
                          method: "POST",
                          body: formData,
                        }
                      );

                      if (response.ok) {
                        const data = await response.json();
                        const uploadedFileUrl = data.imageUrl; // Get the full file URL from the server
                        alert("File uploaded successfully!");
                        console.log("Uploaded file URL:", uploadedFileUrl);

                        // Update the "pfp" field in Firebase with the unique filename or URL
                        const userDoc = await firestore
                          .collection("user-info")
                          .where("username", "==", currentUsername)
                          .get();

                        if (!userDoc.empty) {
                          const docId = userDoc.docs[0].id; // Get the document ID
                          await firestore
                            .collection("user-info")
                            .doc(docId)
                            .update({ pfp: uploadedFileUrl }); // Save the full URL or unique filename
                        } else {
                          console.error("User document not found.");
                        }
                      } else {
                        console.error(
                          "Failed to upload file:",
                          response.statusText
                        );
                        alert("Failed to upload file.");
                      }
                    } catch (error) {
                      console.error("Error uploading file:", error);
                      alert("An error occurred while uploading the file.");
                    }
                    UpdateOldMessages(); // Call the function to update old messages with the new PFP
                    // Reset the file input value
                    e.target.value = "";
                  }
                }}
              />

              {/* Profile picture */}
              <img src={pfp} alt="Profile" className="pfp-settings" />

              {/* Upload icon */}
              <div
                className="pfp-settings absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer"
                onClick={() => document.getElementById("file-input").click()} // Trigger file input
              >
                <FaArrowUpFromBracket
                  className="text-white absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer place-self-center"
                  size={24}
                />
              </div>
            </div>
          </form>

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
                    bg-blue-800 hover:bg-blue-900"
                  type="submit"
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
