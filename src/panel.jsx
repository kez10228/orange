import user from './assets/img/OIG4.jpg';
import { useCookies } from 'react-cookie';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FaGear } from "react-icons/fa6";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from 'react';
import { auth, firestore } from './config/firebase.js';
import Settings from './components/settings/settings.jsx'
import OnlinePresence from './assets/svgs/OnlinePresence.jsx';
import OfflinePresence from './assets/svgs/OfflinePresence.jsx';

const UserIndicator = ({ text, state, handleClicked }) => {
    const onlinePresence = (
        <OnlinePresence onlineClassName="online2" />
    );

    const offlinePresence = (
        <OfflinePresence offlineClassName="offline"/>
    );


    return (
        <div className="userContainer" onClick={() => handleClicked(text, state)}>
            <img src={user} alt="pfp" className='pfp' />
            <p className="username">{text}</p>
            {state === "online" ? onlinePresence : offlinePresence}
        </div>
    );
};

const Panel = ({ setShowContent }) => {
    const db = getDatabase();
    const [cookies, setCookies] = useCookies(['channel', 'user']);
    const messageRef = firestore.collection('user-info');
    const query = messageRef.orderBy('createdAt').limit(25);
    const [users] = useCollectionData(query, { idField: 'id' });
    const [statusData, setStatusData] = useState({});

    useEffect(() => {
        const statusRef = ref(db, 'status');
        onValue(statusRef, (snapshot) => {
            setStatusData(snapshot.val());
        });
    }, [db]);

    const handleClicked = async (username) => {
        setCookies('user', username);
        setShowContent(true)
    };

    const filteredUsers = users?.filter(user => user.uid !== auth.currentUser.uid);
    const isAvailable = cookies.channel === "Orange / Private Messages";
    const currentUsername = auth.currentUser.email.slice(0, -20);
    const displayName = currentUsername.charAt(0).toUpperCase() + currentUsername.slice(1);
    const [showSettings, setShowSettings] = useState(false)

    return (
        <>
        <div className="panel">
            <h2 className='font-bold text-lg my-5'>{cookies.channel}</h2>
            <hr />
            <div className="panel-header">
                {isAvailable && filteredUsers?.map(user => (
                    <UserIndicator 
                        state={statusData[user.uid]?.state || 'offline'} 
                        key={user.uid} 
                        text={user.username}
                        handleClicked={handleClicked}
                        setShowContent={setShowContent}
                    />
                ))}
            </div>
            <div className="user">
                <div className='flex flex-row mt-2'>
                    <img src={user} alt="pfp" className='pfp' />
                    <OnlinePresence onlineClassName='online' />
                    <div className="sub-user">
                        <p className='pointer-events-none'>{displayName}</p>
                        <p className='sub-text pointer-events-none'>Online</p>
                    </div>
                    <button className='border-none w-fit h-fit' onClick={() => setShowSettings(true)}>
                        <FaGear color='white' size={20} className='self-center m-3'/>
                    </button>
                    {showSettings && <Settings onClose={() => setShowSettings(false)} />}
                </div>
            </div>
        </div>

        </>
    );
};

export default Panel;