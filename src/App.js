import React from "react";
import Sidebar from "./Sidebar";
import ContentContainer from "./content-container";  
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import Panel from "./panel";


firebase.initializeApp({
  apiKey: "AIzaSyC2wpd-kO2xT6FqKOoh02BGot2TR6f8_PU",
  authDomain: "orange-ad7c2.firebaseapp.com",
  databaseURL: "https://orange-ad7c2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "orange-ad7c2",
  storageBucket: "orange-ad7c2.appspot.com",
  messagingSenderId: "634548881107",
  appId: "1:634548881107:web:192a3a3f247e25540e3626",
  measurementId: "G-7V3KZ2C9RQ"
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const db = firebase.database()



const App = () => {
  const [user] = useAuthState(auth);
  
  if (user) {
    var uid = auth.currentUser.uid;
    var userStatusDatabaseRef = db.ref('/status/' + uid);

      var isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };
      var isOnlineForDatabase = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };
      firebase.database().ref('.info/connected').on('value', function(snapshot) {
        if (snapshot.val() === false) {
            return;
        };
        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
            userStatusDatabaseRef.set(isOnlineForDatabase);
        });
      });
  }

    return (
      <>
      <div>
        {user ? 
        <>
          <Sidebar />
          <div className="content">
            <Panel /><ContentContainer />
          </div>
        </>
         : <SignIn />}
      </div>
      </>
      
    );
};

const SignIn = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [signusername, setsignUsername] = React.useState('');
  const [signpassword, setsignPassword] = React.useState('');
  async function signIn(e) {
    e.preventDefault();
    const loginauth = getAuth();
    signInWithEmailAndPassword(loginauth, username + "@orange.is-great.net", password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }
  async function signUp(e) {
    const messagesRef = firestore.collection('user-info');

    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(signusername + "@orange.is-great.net", signpassword);
      console.log(auth.currentUser);
    } catch (error) {
      alert(error);
    }

    await messagesRef.add({
      username: signusername,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: auth.currentUser.uid,
    });
  }

  return (
    <div className='sign-in-container'>
        <h1>Log in</h1>
        <form onSubmit={signIn}>
            <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className="input"/><br />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className="input"/><br />
            <button type='submit'>Log in</button>
        </form><br />
        <h1>Sign Up</h1>
        <form onSubmit={signUp}>
            <input type="text" placeholder='Username' value={signusername} onChange={(e) => setsignUsername(e.target.value)} className="input"/><br />
            <input type="password" placeholder='Password' value={signpassword} onChange={(e) => setsignPassword(e.target.value)} className="input"/><br />
            <button type='submit'>Sign Up</button>
        </form>
    </div>
  )
}

export default App;
