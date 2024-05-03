import user from './OIG4.jpg';
import React, { useRef, useState, useLayoutEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyC2wpd-kO2xT6FqKOoh02BGot2TR6f8_PU",
  authDomain: "orange-ad7c2.firebaseapp.com",
  projectId: "orange-ad7c2",
  storageBucket: "orange-ad7c2.appspot.com",
  messagingSenderId: "634548881107",
  appId: "1:634548881107:web:192a3a3f247e25540e3626",
  measurementId: "G-7V3KZ2C9RQ",
});


const firestore = firebase.firestore();
const auth = firebase.auth();

const ContentContainer = () => {


    return (
        <ChatRoom />
    );
}

function Chatmsg(props) {

    const { text, uid, name } = props.message;
    console.log(name)
    
    return (
        <div className="chat-msg">
            <img src={user} alt="pfp" className='pfp' />
            <div className="msg-content">
                <p className="name">{name}</p>
                <p>{text}</p>
            </div>
        </div>
    );
}

const ChatRoom = () => {
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt');
  
    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');
    const dummy = useRef();

    const sendMessage = async (e) => {
        e.preventDefault();
    
        const { uid } = auth.currentUser;
        const name = auth.currentUser.email.slice(0, -20);
    
        await messagesRef.add({
          text: formValue,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          name
        })
    
        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    useLayoutEffect(() => {
        if (dummy.current) 
            dummy.current.scrollIntoView({ behavior: 'smooth' })
    }, [dummy]);

    return (<>
        <div className="content-container">
            <div style={{ height: '90vh', overflowY:'scroll' , overflowX: 'hidden'}}>
        
                {messages && messages.map(msg => <Chatmsg key={msg.id} message={msg} />)}

                <span ref={dummy}></span>
            </div>
            <form onSubmit={sendMessage} style={{ overflow: 'hidden', padding: '10px' }}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} type="text" className="input_box" placeholder="Say something RUDE like SH*T"/>
            </form>
        </div>
      </>
      
    )
}


export default ContentContainer;