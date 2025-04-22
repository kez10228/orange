import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GridLoader, ClockLoader, ClimbingBoxLoader } from "react-spinners";
import { Analytics } from "@vercel/analytics/react";
import { UpdateOldMessages } from "./test";

const AppWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [user] = useState(null);

  UpdateOldMessages(); // Call the function to update old messages

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      window.navigator.userAgent
    );
    if (
      isMobile &&
      window.location.href !== "https://mobile.orangearmy.co.uk"
    ) {
      window.location.href = "https://mobile.orangearmy.co.uk";
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const loadingType = () => {
    const randomNumber = getRndInteger(1, 3);
    if (randomNumber === 1) {
      return <GridLoader color={"#ff6600"} loading={loading} size={15} />;
    } else if (randomNumber === 2) {
      return <ClockLoader color={"#ff6600"} loading={loading} size={30} />;
    } else {
      return (
        <ClimbingBoxLoader color={"#ff6600"} loading={loading} size={15} />
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container" aria-live="polite">
        {loadingType()}
        <br />
        <h1 style={{ color: "white" }}>Did you know: you are reading this</h1>
      </div>
    );
  }

  return (
    <>
      <App initialUser={user} />
      <Analytics mode="production" />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
