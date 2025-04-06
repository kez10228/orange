import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GridLoader, ClockLoader, ClimbingBoxLoader } from 'react-spinners';

const AppWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [user] = useState(null);

  useEffect(() => {
    // Detect if the user is on a laptop or desktop
    const isDesktop = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return /windows|macintosh|linux/.test(userAgent) && !/mobile|tablet/.test(userAgent);
    };

    if (isDesktop()) {
      window.location.href = 'https://orangearmy.co.uk';
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const loadingType = () => {
    if (getRndInteger(1, 3) === 1) {
      return <GridLoader color={'#ff6600'} loading={loading} size={15} />;
    } else if (getRndInteger(1, 3) === 2) {
      return <ClockLoader color={'#ff6600'} loading={loading} size={30} />;
    } else {
      return <ClimbingBoxLoader color={'#ff6600'} loading={loading} size={15} />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        {loadingType()}
        <br />
        <h1 style={{ color: 'white' }}>Did you know: you are reading this</h1>
      </div>
    );
  }

  return <App initialUser={user} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);