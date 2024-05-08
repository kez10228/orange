import user from './OIG4.jpg';
import React, { useRef, useState, useLayoutEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useCookies } from 'react-cookie'
import { useIsTyping } from 'use-is-typing';


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

    const { text, name } = props.message;
    
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
    const [isTyping, register] = useIsTyping();
    const [cookie, setCookie] = useCookies(['channel', 'user'])
    const messagesRef = firestore.collection('messages');
    if (!cookie.channel || cookie.channel === '') {
        setCookie('channel', 'Orange / Private Messages', { path: '/' })
    }

    const [formValue, setFormValue] = useState('');
    const dummy = useRef();

    const sendMessage = async (e) => {
        e.preventDefault();
        const { uid } = auth.currentUser;
        const name = auth.currentUser.email.slice(0, -20);
        if (!formValue) return;
        if (cookie.channel === 'Orange / Private Messages' && !cookie.user) {
            alert('Please select a user to send a message to!')
            return;
        } else if (cookie.user && cookie.channel === 'Orange / Private Messages') {
            await messagesRef.add({
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                name,
                channel: cookie.user,
              })
        } else {
            await messagesRef.add({
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                name,
                channel: cookie.channel,
              })
        }

    
        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    useLayoutEffect(() => {
        if (dummy.current) 
            dummy.current.scrollIntoView({ behavior: 'smooth' })
    }, [dummy]);
    var query = messagesRef.where('channel', '==', decodeURI(cookie.channel)).orderBy("createdAt");
    if (cookie.user && cookie.channel === 'Orange / Private Messages') {
        query = messagesRef.where('channel', '==', cookie.user).orderBy("createdAt");
    } else {
        query = messagesRef.where('channel', '==', decodeURI(cookie.channel)).orderBy("createdAt");
    }
    const [messages] = useCollectionData(query, { idField: 'id' });
    return (<>
        <div className="content-container">
            <div style={{ height: '90vh', overflowY:'scroll' , overflowX: 'hidden'}}>
        
                {messages && messages.map(msg => <Chatmsg key={msg.id} message={msg} />)}

                <span ref={dummy}></span>
            </div>
            <form onSubmit={sendMessage} style={{ overflow: 'hidden', padding: '10px' }}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} type="text" ref={register} className="input_box" placeholder="Say something RUDE like SH*T" />
            </form>
        </div>
      </>
      
    )
}


export default ContentContainer;