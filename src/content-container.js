import React, { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useCookies } from 'react-cookie';
import { useIsTyping } from 'use-is-typing';
import { FaCirclePlus } from "react-icons/fa6";
import VideoChat from './components/Video';
import user from './OIG4.jpg';

// Firebase configuration
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

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const auth = firebase.auth();

// Chat message component
function ChatMessage({ message }) {
    const { text, name } = message;
    
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

// Chat room component
function ChatRoom() {
    const [showVideo, setShowVideo] = useState(false);
    const [isTyping, register] = useIsTyping();
    const [cookie, setCookie] = useCookies(['channel', 'user']);
    const [formValue, setFormValue] = useState('');
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');

    // Set default channel if not exists
    if (!cookie.channel || cookie.channel === '') {
        setCookie('channel', 'Orange / Private Messages', { path: '/' });
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!formValue) return;

        const { uid } = auth.currentUser;
        const name = auth.currentUser.email.slice(0, -20);

        if (cookie.channel === 'Orange / Private Messages' && !cookie.user) {
            alert('Please select a user to send a message to!');
            return;
        }

        const messageData = {
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            name,
            channel: cookie.user && cookie.channel === 'Orange / Private Messages' 
                ? cookie.user 
                : cookie.channel
        };

        await messagesRef.add(messageData);
        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Query messages based on channel or private chat
    const query = cookie.user && cookie.channel === 'Orange / Private Messages'
        ? messagesRef
            .where('channel', 'in', [cookie.user, auth.currentUser.email.slice(0, -20)])
            .where('name', 'in', [auth.currentUser.email.slice(0, -20), cookie.user])
            .orderBy("createdAt")
        : messagesRef
            .where('channel', '==', decodeURI(cookie.channel))
            .orderBy("createdAt");

    const [messages] = useCollectionData(query, { idField: 'id' });

    React.useEffect(() => {
        if (dummy.current) {
            dummy.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            {showVideo && <VideoChat onClose={() => setShowVideo(false)} />}
            <div className="content-container">
                <div style={{ height: '100vh', overflowY:'scroll' , overflowX: 'hidden'}}>
                    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                    <span ref={dummy}></span>
                </div>
                <form onSubmit={sendMessage} style={{ overflow: 'hidden', padding: '10px' }}>
                    <div className='flex flex-row p-3 items-center justify-start'>
                        <FaCirclePlus size={28} color='white' onClick={() => setShowVideo(true)} />
                        <input 
                            value={formValue} 
                            onChange={(e) => setFormValue(e.target.value)} 
                            type="text" 
                            ref={register} 
                            className="input_box" 
                            placeholder="Say something RUDE like SH*T" 
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

const ContentContainer = () => {
    return <ChatRoom />;
}

export default ContentContainer;