import user from './OIG4.jpg';
import { useCookies } from 'react-cookie';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect, useRef } from 'react';
import { auth, firestore } from './firebase';
import ContextMenu from './components/contextMenu/contextMenu';
import UserInfo from './components/userInfo/userInfo';

let userinfoname = "orange";
let statusinfo = "online";

const UserIndicator = ({ text, state, contextMenuRef, setContextMenu, setIsUserOpened }) => {
    const [cookies, setCookies] = useCookies(['channel', 'user']);
    
    const onlinePresence = (
        <svg y={17} width={25} height={15} className="online2" viewBox="0 0 25 15">
            <mask id=":r3:">
                <rect x="7.5" y={5} width={10} height={10} rx={5} ry={5} fill="white" />
                <rect x="12.5" y={10} width={0} height={0} rx={0} ry={0} fill="black" />
                <polygon
                    points="-2.16506,-2.5 2.16506,0 -2.16506,2.5"
                    fill="black"
                    transform="scale(0) translate(13.125 10)"
                    style={{ transformOrigin: "13.125px 10px" }}
                />
                <circle fill="black" cx="12.5" cy={10} r={0} />
            </mask>
            <rect fill="#23a55a" width={25} height={15} mask="url(#:r3:)" />
        </svg>
    );

    const offlinePresence = (
        <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 10 10" fill="none" className='offline'>
            <circle cx={5} cy={5} r={5} fill="#D9D9D9" />
            <g style={{ mixBlendMode: "plus-darker" }}>
                <circle cx={5} cy={5} r={2} fill="#80848E" />
            </g>
        </svg>
    );

    const handleContextMenu = (e, rightClickedText) => {
        e.preventDefault();

        const contextMenuAttr = contextMenuRef.current.getBoundingClientRect();
        const isLeft = e.clientX < window?.innerWidth / 2

        let x
        let y = e.clientY;

        if (isLeft) {
            x = e.clientX;
        } else {
            x = e.clientX - contextMenuAttr.width;
        }

        setContextMenu({
            toggled: true,
            position: {
                x,
                y
            }
        });

        console.log(contextMenuAttr);

        console.log(rightClickedText);
    };

    const handleClicked = () => {
        setIsUserOpened(true);
        setCookies('user', text);
        userinfoname = text;
        statusinfo = state;
    }

    return (
        <div className="userContainer" onClick={() => handleClicked()} onContextMenu={(e) => handleContextMenu(e, text)}>
            <img src={user} alt="pfp" className='pfp' />
            <p className="username">{text}</p>
            {state === "online" ? onlinePresence : offlinePresence}
        </div>
    );
};

const Panel = () => {
    const db = getDatabase();
    const [cookies] = useCookies(['channel', 'user']);
    const messageRef = firestore.collection('user-info');
    const query = messageRef.orderBy('createdAt').limit(25);
    const [users] = useCollectionData(query, { idField: 'id' });
    const [statusData, setStatusData] = useState({});
    const [isUserOpened, setIsUserOpened] = useState(true);
    const contextMenuRef = useRef(null);
    useEffect(() => {
        const disableContextMenu = (e) => {
            e.preventDefault();
        };
        
        document.addEventListener('contextmenu', disableContextMenu);
        
        return () => {
            document.removeEventListener('contextmenu', disableContextMenu);
        };
    }, []);
    useEffect(() => {
        const handleClickAway = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setContextMenu(prev => ({
                    ...prev,
                    toggled: false
                }));
            }
        };
    
        document.addEventListener('mousedown', handleClickAway);
        
        return () => {
            document.removeEventListener('mousedown', handleClickAway);
        };
    }, []);
    
    
    
    
    const [contextMenu, setContextMenu] = useState({
        position: {
            x: 0,
            y: 0,
        },
        toggled: false
    });

    useEffect(() => {
        const statusRef = ref(db, 'status');
        onValue(statusRef, (snapshot) => {
            setStatusData(snapshot.val());
        });
    }, [db]);

    const filteredUsers = users?.filter(user => user.uid !== auth.currentUser.uid);
    const isAvailable = cookies.channel === "Orange / Private Messages";
    const currentUsername = auth.currentUser.email.slice(0, -20);
    const displayName = currentUsername.charAt(0).toUpperCase() + currentUsername.slice(1);

    return (
        <>
        <div className="panel">
            <h2 className='font-bold text-lg my-5'>{cookies.channel}</h2>
            <hr />
            <div className="panel-header">
                {isAvailable && filteredUsers?.map(user => (
                    <UserIndicator 
                        state={statusData[user.uid]?.state || 'offline'} 
                        key={user.id} 
                        text={user.username}
                        contextMenuRef={contextMenuRef}
                        setContextMenu={setContextMenu}
                        setIsUserOpened={setIsUserOpened}
                    />
                ))}
            </div>
            <div className="user">
                <div className='flex flex-row mt-2'>
                    <img src={user} alt="pfp" className='pfp' />
                    <svg x="14.5" y={17} width={25} height={15} viewBox="0 0 25 15" className='online'>
                        <mask id=":r3:">
                            <rect x="7.5" y={5} width={10} height={10} rx={5} ry={5} fill="white" />
                            <rect x="12.5" y={10} width={0} height={0} rx={0} ry={0} fill="black" />
                            <polygon
                            points="-2.16506,-2.5 2.16506,0 -2.16506,2.5"
                            fill="black"
                            transform="scale(0) translate(13.125 10)"
                            style={{ transformOrigin: "13.125px 10px" }}
                            />
                            <circle fill="black" cx="12.5" cy={10} r={0} />
                        </mask>
                        <rect fill="#23a55a" width={25} height={15} mask="url(#:r3:)" />
                    </svg>
                    <div className="sub-user">
                        <p className='pointer-events-none'>{displayName}</p>
                        <p className='sub-text pointer-events-none'>Online</p>
                    </div>
                </div>
            </div>
            <ContextMenu 
                contextMenuRef={contextMenuRef}
                isToggled={contextMenu.toggled && contextMenu.position.x !== 0 && contextMenu.position.y !== 0}
                positionX={contextMenu.position.x}
                positionY={contextMenu.position.y}
                buttons={[
                    {
                        text: "Send Message",
                        icon: "✉️",
                        onClick: () => console.log("Opening DM"),
                        isSpacer: false
                    },
                    {
                        text: "View Profile",
                        icon: "👤",
                        onClick: () => console.log("View Profile"),
                        isSpacer: false
                    },
                    {
                        text: "",
                        icon: "",
                        isSpacer: true
                    },
                    {
                        text: "Block",
                        icon: "🚫",
                        onClick: () => console.log("Block"),
                        isSpacer: false
                    },
                    {
                        text: "Report",
                        icon: "⚠️",
                        onClick: () => console.log("Report"),
                        isSpacer: false
                    }
                ]}
            />
            
        </div>
        {isUserOpened && <UserInfo username={userinfoname} status={statusinfo} />}
        </>
    );
};

export default Panel;