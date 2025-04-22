import React from "react";
import "./userInfo.css";
import user from "../../assets/img/OIG4.jpg";
import OnlinePresence from "../../assets/svgs/OnlinePresence";
import OfflinePresence from "../../assets/svgs/OfflinePresence";

function UserInfo({ userInfo }) {
  const { username, status, createdAt, about, pfp } = userInfo;
  const onlineStatus = <OnlinePresence onlineClassName="online-info" />;
  const offlineStatus = <OfflinePresence offlineClassName="offline-info" />;

  return (
    <div className="userInfo">
      {/* From UIVERSE.COM by catraco */}
      <div className="container"></div>
      {pfp ? <img src={"http://api.orangearmy.co.uk/uploads/" + pfp} alt="pfp" className="pfp-userInfo" /> : <img src={user} alt="pfp" className="pfp-userInfo" />}
      <p className="username-info">{username}</p>
      <p className="status-info">{status}</p>
      {status === "online" ? onlineStatus : offlineStatus}
      <div className="aboutme">
        <div className="aboutbox">
          <p className="font-bold">About me</p>
          <p>{about}</p>
        </div>
        <hr />
        <p>
          Joined At:{" "}
          {createdAt?.toLocaleString("en-UK", { timeZoneName: "short" })}
        </p>
      </div>
    </div>
  );
}

export default UserInfo;
