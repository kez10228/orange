import user from "./assets/img/OIG4.jpg";
import { useCookies } from "react-cookie";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaGear } from "react-icons/fa6";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect, useRef } from "react";
import { auth, firestore } from "./config/firebase.js";
import ContextMenu from "./components/contextMenu/contextMenu";
import UserInfo from "./components/userInfo/userInfo";
import Settings from "./components/settings/settings.jsx";
import OnlinePresence from "./assets/svgs/OnlinePresence.jsx";
import OfflinePresence from "./assets/svgs/OfflinePresence.jsx";

const UserIndicator = ({
  text,
  state,
  contextMenuRef,
  setContextMenu,
  setIsUserOpened,
  handleClicked,
}) => {
  const onlinePresence = <OnlinePresence onlineClassName="online2" />;

  const offlinePresence = <OfflinePresence offlineClassName="offline" />;

  const handleContextMenu = (e, rightClickedText) => {
    e.preventDefault();

    const contextMenuAttr = contextMenuRef.current.getBoundingClientRect();
    const isLeft = e.clientX < window?.innerWidth / 2;

    let x;
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
        y,
      },
    });

    console.log(contextMenuAttr);

    console.log(rightClickedText);
  };

  return (
    <div
      className="userContainer"
      onClick={() => handleClicked(text, state)}
      onContextMenu={(e) => handleContextMenu(e, text)}
    >
      <img src={user} alt="pfp" className="pfp" />
      <p className="username">{text}</p>
      {state === "online" ? onlinePresence : offlinePresence}
    </div>
  );
};

const Panel = () => {
  const db = getDatabase();
  const [cookies, setCookies] = useCookies(["channel", "user"]);
  const messageRef = firestore.collection("user-info");
  const query = messageRef.orderBy("createdAt").limit(25);
  const [users] = useCollectionData(query, { idField: "id" });
  const [statusData, setStatusData] = useState({});
  const [isUserOpened, setIsUserOpened] = useState(true);
  const [userInfo, setUserInfo] = useState({
    username: "orange",
    status: "online",
    createdAt: "8 February 2025 at 12:25:10 UTC", // Assuming the default user joined at the current date
    about:
      "This is a special user (creator of website). His pronouns are depre/ssed and his pet is called depression. BTW I need money donate please.",
  });
  const contextMenuRef = useRef(null);
  useEffect(() => {
    const disableContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", disableContextMenu);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);
  useEffect(() => {
    const handleClickAway = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu((prev) => ({
          ...prev,
          toggled: false,
        }));
      }
    };

    document.addEventListener("mousedown", handleClickAway);

    return () => {
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, []);

  const [contextMenu, setContextMenu] = useState({
    position: {
      x: 0,
      y: 0,
    },
    toggled: false,
  });

  useEffect(() => {
    const statusRef = ref(db, "status");
    onValue(statusRef, (snapshot) => {
      setStatusData(snapshot.val());
    });
  }, [db]);

  const handleClicked = async (username, state) => {
    setIsUserOpened(true);
    setCookies("user", username);

    const userDoc = await firestore
      .collection("user-info")
      .where("username", "==", username)
      .get();
    if (!userDoc.empty) {
      const userData = userDoc.docs[0].data();
      setUserInfo({
        username: userData.username,
        status: state,
        createdAt: userData.createdAt.toDate(),
        about: userData.about || "No additional information provided.",
      });
    } else {
      setUserInfo(null);
    }
  };

  const filteredUsers = users?.filter(
    (user) => user.uid !== auth.currentUser.uid
  );
  const isAvailable = cookies.channel === "Orange / Private Messages";
  const currentUsername = auth.currentUser.email.slice(0, -20);
  const displayName =
    currentUsername.charAt(0).toUpperCase() + currentUsername.slice(1);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="panel">
        <h2 className="font-bold text-lg my-5">{cookies.channel}</h2>
        <hr />
        <div className="panel-header">
          {isAvailable &&
            filteredUsers?.map((user) => (
              <UserIndicator
                state={statusData[user.uid]?.state || "offline"}
                key={user.uid}
                text={user.username}
                contextMenuRef={contextMenuRef}
                setContextMenu={setContextMenu}
                setIsUserOpened={setIsUserOpened}
                handleClicked={handleClicked}
              />
            ))}
        </div>
        <div className="user">
          <div className="flex flex-row mt-2">
            <img src={user} alt="pfp" className="pfp" />
            <OnlinePresence onlineClassName="online" />
            <div className="sub-user">
              <p className="pointer-events-none">{displayName}</p>
              <p className="sub-text pointer-events-none">Online</p>
            </div>
            <button
              className="border-none w-fit h-fit"
              onClick={() => setShowSettings(true)}
            >
              <FaGear color="white" size={20} className="self-center m-3" />
            </button>
            {showSettings && (
              <Settings onClose={() => setShowSettings(false)} />
            )}
          </div>
        </div>
        <ContextMenu
          contextMenuRef={contextMenuRef}
          isToggled={
            contextMenu.toggled &&
            contextMenu.position.x !== 0 &&
            contextMenu.position.y !== 0
          }
          positionX={contextMenu.position.x}
          positionY={contextMenu.position.y}
          buttons={[
            {
              text: "Send Message",
              icon: "✉️",
              onClick: () => console.log("Opening DM"),
              isSpacer: false,
            },
            {
              text: "View Profile",
              icon: "👤",
              onClick: () => console.log("View Profile"),
              isSpacer: false,
            },
            {
              text: "",
              icon: "",
              isSpacer: true,
            },
            {
              text: "Block",
              icon: "🚫",
              onClick: () => console.log("Block"),
              isSpacer: false,
            },
            {
              text: "Report",
              icon: "⚠️",
              onClick: () => console.log("Report"),
              isSpacer: false,
            },
          ]}
        />
      </div>
      {isUserOpened && userInfo && <UserInfo userInfo={userInfo} />}
    </>
  );
};

export default Panel;
