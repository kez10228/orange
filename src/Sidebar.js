import { FaFire, FaChild, FaPlus, FaSignOutAlt } from "react-icons/fa";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useCookies } from 'react-cookie'
import logo from './logo.png';

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


const Sidebar = () => {
  const channelRef = firestore.collection('channels');
  const query = channelRef.where('members', "array-contains", auth.currentUser.email.slice(0, -20));
  const [channels] = useCollectionData(query, { idField: 'id' });


  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-gray-800 m-0 flex flex-col text-white shadow-lg">
        <ChannelIcon icon={<FaFire size="28" />} text="Orange / Private Messages" />
        <Divider />
        <ChannelIcon icon={<FaChild size="28" />} text="Everyone :)" />

          {channels && channels.map((channel) => (<ChannelIcon key={channel.id} icon={<FaFire size="28" />} text={channel.name}  />))}

        <Divider />  
        <SidebarIcon icon={<FaPlus size="24" />} text="Create a new channel" />  
        <Divider />
        <SignOut icon={<FaSignOutAlt size="24" />} text="Sign Out" id="sign-out" />
    </div>
  );    
};


const ChannelIcon = ({ icon, text }) => {
    const [cookies, setCookie] = useCookies(['channel'])

    const cookieSetter = (text) => () => {
        setCookie('channel', text, { path: '/' });
    }

    return (
        <div className="sidebar-icon group" onClick={cookieSetter(text)}>
            {icon}

            <span className="tooltip group-hover:scale-100">
                {text}
            </span>
        </div>
    );
}

const SidebarIcon = ({ icon, text }) => {
  return (
    <div className="sidebar-icon group">
      {icon}

      <span className="tooltip group-hover:scale-100">
          {text}
      </span>
    </div>
  )
}

const SignOut = ({ icon, text }) => {
  return (
      <div className="sidebar-icon group" onClick={() => auth.signOut()}>
          {icon}

          <span className="tooltip group-hover:scale-100">
              {text}
          </span>
      </div>
  );
}

const Divider = () => <hr className="sidebar-hr" />;


export default Sidebar;