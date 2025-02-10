import React, { useEffect, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoPlayer from './VideoPlayer';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa6";

const APP_ID = '8f9b95a3b59b49f0b4965d765e901ad7';
const TOKEN = '007eJxTYHArC1tTEXHpReXNM2ekmVg3yDLXu1pM2ui0JC2tsPTlkkMKDBZplkmWponGSaaWSSaWaQZAwsw0xdzMNNXSwDAxxVzcdFV6QyAjA9fKYlZGBggE8dkY8osS89JTGRgAT2oe6A==';
const CHANNEL = 'orange';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

function VideoRoom() {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const [mic, setMic] = useState(true);
    const [cam, setCam] = useState(true);

    const toggleMic = () => {
        if (localTracks[0]) {
            localTracks[0].setEnabled(!mic);
            setMic(!mic);
        }
    }

    const toggleCam = () => {
        if (localTracks[1]) {
            localTracks[1].setEnabled(!cam);
            setCam(!cam);
        }
    }

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);
    
        if (mediaType === 'video') {
          setUsers((previousUsers) => [...previousUsers, user]);
        }
    
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
    };

    const handleUserLeft = (user) => {
        setUsers((previousUsers) =>
            previousUsers.filter((u) => u.uid !== user.uid)
        );
    }

    useEffect(() => {
        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);

        client
            .join(APP_ID, CHANNEL, TOKEN, null)
            .then((uid) => 
                Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
            ).then(([tracks, uid]) => {
                const [audioTrack, videoTrack] = tracks;
                setLocalTracks(tracks);
                setUsers((previousUsers) => [...previousUsers, { uid, videoTrack, audioTrack }]);
                client.publish(tracks);
            });

        return () => {
            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
            client.unpublish(localTracks).then(() => {
                client.leave();
            });
        };
    }, []);

    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className={`grid gap-2 p-2 w-full ${getGridLayout(users.length)}`} 
                 style={{ aspectRatio: '16/9' }}>
                {users.map((user) => (
                    <VideoPlayer 
                        key={user.uid} 
                        user={user} 
                        style= {{ width: getMaxWidth(users.length), height: getVideoHeight(users.length) }}
                    />
                ))}
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button 
                    className={`rounded-full border-none w-14 h-14 flex justify-center items-center transition-colors ${mic ? 'bg-white' : 'bg-red-600'}`} 
                    onClick={toggleMic}
                >
                    {mic ? 
                        <FaMicrophone size={20} color='black' /> : 
                        <FaMicrophoneSlash size={20} color='white' />
                    }
                </button>
                <button 
                    className={`rounded-full border-none w-14 h-14 flex justify-center items-center transition-colors ${cam ? 'bg-white' : 'bg-red-600'}`} 
                    onClick={toggleCam}
                >
                    {cam ? 
                        <FaVideo size={20} color='black' /> : 
                        <FaVideoSlash size={20} color='white' />
                    }
                </button>
            </div>
        </div>
    );
}

const getGridLayout = (count) => {
    switch (count) {
        case 1:
            return 'grid-cols-1';
        case 2:
            return 'grid-cols-2';
        case 3:
        case 4:
            return 'grid-cols-2 grid-rows-2';
        case 5:
        case 6:
            return 'grid-cols-3 grid-rows-2';
        case 7:
        case 8:
        case 9:
            return 'grid-cols-3 grid-rows-3';
        default:
            return 'grid-cols-4 grid-rows-4';
    }
}

const getMaxWidth = (count) => {
    if (count === 1) return '900px';
    if (count === 2) return '600px';
    if (count <= 4) return '300px';
    if (count <= 6) return '300px';
    return '300px';
}

const getVideoHeight = (count) => {
    if (count === 1) return '600px';
    if (count === 2) return '400px';
    if (count <= 4) return '300px';
    if (count <= 6) return '250px';
    return '200px';
}

export default VideoRoom