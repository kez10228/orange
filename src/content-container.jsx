import React, { useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useCookies } from 'react-cookie';
import user from './assets/img/OIG4.jpg';
import firebase, { auth, firestore } from './config/firebase';
import { FaArrowLeft } from "react-icons/fa6";

// Chat message component
function ChatMessage({ message }) {
    const { text, name } = message;
    
    return (
        <div className="chat-msg w-full">
            <img src={user} alt="pfp" className='pfp' />
            <div 
                className="msg-content break-words" 
                style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', maxWidth: '90%' }} // Restrict width
            >
                <p className="name" style={{ fontWeight: 'bold' }}>{name}</p>
                <p style={{ margin: 0 }} className='w-full'>{text}</p> {/* Remove unnecessary classes */}
            </div>
        </div>
    );
}

// Chat room component
function ContentContainer({setShowContent}) {
    const [cookie, setCookie] = useCookies(['channel', 'user']);
    const [formValue, setFormValue] = useState('');
    const dummy = useRef();
    const messagesRef = firestore.collection('messages'); // Reference to the collection
    const messagesQuery = messagesRef.limit(100); // Query for fetching messages

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

        const channel = cookie.user && cookie.channel === 'Orange / Private Messages' 
            ? "pm" + cookie.user 
            : cookie.channel;

        // Split the message into chunks of 200 characters, max 3 messages
        const chunks = formValue.match(/.{1,200}/g).slice(0, 3);

        for (const chunk of chunks) {
            const messageData = {
                text: chunk,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                name,
                channel
            };

            await messagesRef.add(messageData); // Use the collection reference to add a message
        }

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Query messages based on channel or private chat
    const query = cookie.user && cookie.channel === 'Orange / Private Messages'
        ? messagesQuery
            .where('channel', 'in', ["pm" + cookie.user, "pm" + auth.currentUser.email.slice(0, -20)])
            .where('name', 'in', [auth.currentUser.email.slice(0, -20), cookie.user])
            .orderBy("createdAt")
        : messagesQuery
            .where('channel', '==', decodeURI(cookie.channel))
            .orderBy("createdAt");

    const [messages] = useCollectionData(query, { idField: 'id' });

    // Automatically scroll to the bottom when the page loads
    React.useEffect(() => {
        const handleResize = () => {
            if (dummy.current) {
                dummy.current.scrollIntoView({ behavior: 'smooth' });
            }
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array ensures this runs only on mount

    React.useEffect(() => {
        if (dummy.current) {
            dummy.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    let channelName = cookie.channel;
    if (cookie.user && cookie.channel === 'Orange / Private Messages') {
        channelName = cookie.user;
    }

    return (
        <>
            <div className="content-container">
                <div className="navbar">
                    <button onClick={() => setShowContent(false)} className='border-none'>
                        <FaArrowLeft color='white' size={20}/>
                    </button>
                    
                    <p>{channelName}</p>
                </div>
                <div style={{ height: '100vh', overflowY:'scroll' , overflowX: 'hidden'}} className='chatbox'>
                    {messages && messages.map((msg, index) => <ChatMessage key={`${msg.id}-${index}`} message={msg} />)}
                    <span ref={dummy}></span>
                </div>
                <form onSubmit={sendMessage} style={{ overflow: 'hidden', padding: '10px' }}>
                    <div className='flex flex-row gap-3 items-center justify-start'>
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

export default ContentContainer;