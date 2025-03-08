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
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from "react";


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
  
  useEffect(() => {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }, []);

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
    <Router>
      <Routes>
        <Route path="/chat" element={
          user ? (
            <>
              <Sidebar />
              <div className="content">
                <Panel /><ContentContainer />
              </div>
            </>
          ) : <Navigate to="/signin" />
        } />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to={user ? "/chat" : "/signin"} />} />
      </Routes>
    </Router>
  );
};

const SignIn = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  async function signIn(e) {
    e.preventDefault();
    const loginauth = getAuth();
    
    // Set persistence before sign in
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
    // Then sign in
    signInWithEmailAndPassword(loginauth, username + "@orange.is-great.net", password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/chat');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  return (
    <div className="bg">
      <div className='sign-in-container'>
        <h1>Log in</h1>
        <form onSubmit={signIn}>
          <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className="input text-black"/><br />
          <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className="input text-black"/><br />
          <button type='submit' className="shadow__btn">Log in</button>
          <p className="p-0 m-0">Don't have an account? <Link to="/signup" className="text-blue-700">Sign up</Link></p>
        </form>
      </div>
    </div>
    
  );
};const SignUp = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function signUp(e) {
    e.preventDefault();
    const messagesRef = firestore.collection('user-info');

    try {
      await auth.createUserWithEmailAndPassword(username + "@orange.is-great.net", password);
      await messagesRef.add({
        username: username,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: auth.currentUser.uid,
      });
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="bg">
      <div className='sign-in-container'>
        <h1>Sign Up</h1>
        <form onSubmit={signUp}>
          <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className="input text-black"/><br />
          <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className="input text-black"/><br />
          <button type='submit' className="shadow__btn">Sign Up</button>
          <p className="p-0 m-0">Already have an account? <Link to="/signin" className="text-blue-700">Sign in</Link></p>
        </form>
      </div>
    </div>
    
  );
};

export default App;