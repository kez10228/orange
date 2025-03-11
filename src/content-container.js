import React, { useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useCookies } from 'react-cookie';
import { FaCirclePlus } from "react-icons/fa6";
import VideoChat from './components/videoChat/Video';
import user from './assets/img/OIG4.jpg';
import firebase, { auth, firestore } from './config/firebase';

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
                ? "pm" + cookie.user 
                : cookie.channel
        };

        await messagesRef.add(messageData);
        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Query messages based on channel or private chat
    const query = cookie.user && cookie.channel === 'Orange / Private Messages'
        ? messagesRef
            .where('channel', 'in', ["pm" + cookie.user, "pm" + auth.currentUser.email.slice(0, -20)])
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
                <div style={{ height: '100vh', overflowY:'scroll' , overflowX: 'hidden'}} className='chatbox'>
                    {messages && messages.map((msg, index) => <ChatMessage key={`${msg.id}-${index}`} message={msg} />)}
                    <span ref={dummy}></span>
                </div>
                <form onSubmit={sendMessage} style={{ overflow: 'hidden', padding: '10px' }}>
                    <div className='flex flex-row gap-3 items-center justify-start'>
                        <FaCirclePlus size={28} color='white' onClick={() => setShowVideo(true)} />
                        <input 
                            value={formValue} 
                            onChange={(e) => setFormValue(e.target.value)} 
                            type="text" 
                            className="input_box" 
                            placeholder="Say something NICE for once" 
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