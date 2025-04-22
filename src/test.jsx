import React, { useEffect } from "react";
import { firestore } from "./config/firebase";

export const UpdateOldMessages = async () => {
  try {
    const messagesSnapshot = await firestore
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(100) // Update only the most recent 100 messages
      .get();

    for (const messageDoc of messagesSnapshot.docs) {
      const messageData = messageDoc.data();
      const username = messageData.name;

      const userDoc = await firestore
        .collection("user-info")
        .where("username", "==", username)
        .get();

      let pfp = "http://api.orangearmy.co.uk/uploads/1745349689288-OIG4.jpg";
      if (!userDoc.empty) {
        const userPfp = userDoc.docs[0].data().pfp || "1745349689288-OIG4.jpg";
        pfp = `http://api.orangearmy.co.uk/uploads/${userPfp}`;
      }

      await firestore.collection("messages").doc(messageDoc.id).update({
        pfp,
      });

      console.log(`Updated message ${messageDoc.id} with PFP: ${pfp}`);
    }

    console.log("All messages updated successfully!");
  } catch (error) {
    console.error("Error updating messages with PFP:", error);
  }
};

const UpdateOldMessagesComponent = () => {
  useEffect(() => {
    UpdateOldMessages();
  }, []);

  return <div>Updating old messages...</div>;
};

export default UpdateOldMessagesComponent;
