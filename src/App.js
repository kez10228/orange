import React from "react";
import Sidebar from "./Sidebar";
import ContentContainer from "./content-container";  
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import Panel from "./panel";
import { getNotifToken, onMessageListener } from "./requestNotifToken";


firebase.initializeApp({
  apiKey: "AIzaSyC2wpd-kO2xT6FqKOoh02BGot2TR6f8_PU",
  authDomain: "orange-ad7c2.firebaseapp.com",
  projectId: "orange-ad7c2",
  storageBucket: "orange-ad7c2.appspot.com",
  messagingSenderId: "634548881107",
  appId: "1:634548881107:web:192a3a3f247e25540e3626",
  measurementId: "G-7V3KZ2C9RQ",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
  getNotifToken();
  onMessageListener()
    .then(payload => {
        console.log(payload);
     })
    .catch(err => {
      console.log(err);
    });
  const [user] = useAuthState(auth);

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
    });
  }

  return (
    <div className='sign-in-container'>
        <h1>Log in</h1>
        <form onSubmit={signIn}>
            <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className="input"/><br />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className="input"/><br />
            <button type='submit'>Log in</button>
            <p>This is a temporary login page</p>
        </form><br />
        <h1>Sign Up</h1>
        <form onSubmit={signUp}>
            <input type="text" placeholder='Username' value={signusername} onChange={(e) => setsignUsername(e.target.value)} className="input"/><br />
            <input type="password" placeholder='Password' value={signpassword} onChange={(e) => setsignPassword(e.target.value)} className="input"/><br />
            <button type='submit'>Sign Up</button>
            <p>This is a temporary Signup page</p>
        </form>
    </div>
  )
}

export default App;