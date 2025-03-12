import { FaChild, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { FaFileCircleExclamation } from "react-icons/fa6";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useCookies } from 'react-cookie';
import { useState } from "react";
import Modal from "./components/modals/Modal";
import Modal2 from './components/modals/Modal2';
import { auth, firestore } from './config/firebase';
import { GiOrange } from "react-icons/gi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal2, setShowModal2] = useState(true);
  const channelRef = firestore.collection('channels');
  const query = channelRef.where('members', "array-contains", auth.currentUser.email.slice(0, -20));
  const [channels] = useCollectionData(query, { idField: 'id' });

  return (
    <>
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
      {showModal2 && <Modal2 onClose={() => setShowModal2(false)} />}
      <div className="fixed top-0 left-0 h-screen w-16 bg-gray-800 m-0 flex flex-col text-white shadow-lg z-10">
          <ChannelIcon icon={<GiOrange size="28" />} text="Orange / Private Messages" />
          <Divider />
          <ChannelIcon icon={<FaChild size="28" />} text="Everyone :)" />
          <div className="channels">
            {channels && channels.map((channel) => (<ChannelIcon key={channel.name} icon={<FaFileCircleExclamation size="28" />} text={channel.name}  />))}
          </div>

          <Divider />  
          <div className="sidebar-icon group" onClick={() => setIsOpen(true)}>
            {<FaPlus size="24" />}
            <span className="tooltip group-hover:scale-100">
                Create a channel
            </span>
          </div>
          <div className="flex-grow"></div>
          <Divider />
          <SignOut icon={<FaSignOutAlt size="24" />} text="Sign Out" id="sign-out" />
      </div>
    </>
  );    
};

const ChannelIcon = ({ icon, text }) => {
    const [, setCookie] = useCookies(['channel']);

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