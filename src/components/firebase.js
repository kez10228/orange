import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC2wpd-kO2xT6FqKOoh02BGot2TR6f8_PU",
    authDomain: "orange-ad7c2.firebaseapp.com",
    databaseURL: "https://orange-ad7c2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "orange-ad7c2",
    storageBucket: "orange-ad7c2.appspot.com",
    messagingSenderId: "634548881107",
    appId: "1:634548881107:web:192a3a3f247e25540e3626",
    measurementId: "G-7V3KZ2C9RQ"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = firebase.firestore();
export const database = firebase.database();

export default firebase;
