import user from './OIG4.jpg'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useCookies } from 'react-cookie'
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

const auth = firebase.auth();
const firestore = firebase.firestore();

const Panel = () => {
    const [cookies, setCookies] = useCookies(['channel', 'user']);
    const messageRef = firestore.collection('user-info');
    const query = messageRef.orderBy('createdAt').limit(25);
    const [users] = useCollectionData(query, { idField: 'id' });
    var available = false;
    if (cookies.channel === "Orange / Private Messages") {
        available = true;
    } else {
        available = false;
    }
    return (
        <div className="panel">
            <div className="panel-header">
                <h2>{cookies.channel}</h2>
                <hr />
                <br />
                {available ? users && users.map(user => <p key={user.id} onClick={() => setCookies('user', user.username)}>{user.username}</p>) : null}
            </div>
            <div className="user">
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
                    <p>{auth.currentUser.email.slice(0, -20).charAt(0).toUpperCase() + auth.currentUser.email.slice(1, -20)}</p>
                    <p className='sub-text'>Online</p>
                </div>
            </div>
        </div>
    );
}
export default Panel;