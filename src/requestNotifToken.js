import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const app = initializeApp({
    apiKey: "AIzaSyC2wpd-kO2xT6FqKOoh02BGot2TR6f8_PU",
    authDomain: "orange-ad7c2.firebaseapp.com",
    databaseURL: "https://orange-ad7c2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "orange-ad7c2",
    storageBucket: "orange-ad7c2.appspot.com",
    messagingSenderId: "634548881107",
    appId: "1:634548881107:web:192a3a3f247e25540e3626",
    measurementId: "G-7V3KZ2C9RQ"
});

const messaging = getMessaging(app);

export const getNotifToken = async () => {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("./firebase-messaging-sw.js");
        });
      }
    try {
        const currentToken = await getToken(messaging, { vapidKey: 'BDBn7ip0Eo8F_Au81RV30V2PM62QFvto9S5Dp5Vd1j5626r3PcliiOC5JYAtctM3mnhAc1Zv8NFGJecZ16fgG2o' });
        if (currentToken) {
            console.log('current token for client: ', currentToken);
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }

  }

export const onMessageListener = () => 
    new Promise(resolve => {
        onMessage(messaging, payload => {
            console.log('Message received. ' + payload);
            resolve(payload);
        });
    });
