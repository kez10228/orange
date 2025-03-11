import React from "react";
import Sidebar from "./Sidebar";
import ContentContainer from "./content-container";  
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Panel from "./panel";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import firebase, { auth, firestore, database } from './config/firebase';
import ContextMenu from "./components/contextMenu/contextMenu2";

const App = () => {
  const [user] = useAuthState(auth);
  
  // Only run the online/offline logic if user exists
  if (user?.uid) {
    var userStatusDatabaseRef = database.ref('/status/' + user.uid);

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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/chat" element={
          user ? (
            <>
              <Sidebar />
              <div className="content">
                <Panel /><ContentContainer />
              </div>
              <ContextMenu />
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
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/chat');
    }
  }, [navigate]);

  async function signIn(e) {
    e.preventDefault();
    const loginauth = getAuth();
    
    // Set persistence before sign in
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    
    // Then sign in
    signInWithEmailAndPassword(loginauth, username + "@orange.is-great.net", password)
      .then((userCredential) => {
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
};

const SignUp = () => {
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