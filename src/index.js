import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GridLoader, ClockLoader, ClimbingBoxLoader} from 'react-spinners';
import { Analytics } from "@vercel/analytics/react"

const AppWrapper = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, []);

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  const loadingType = () => {
    if (getRndInteger(1, 3) === 1) {
      return (
        <GridLoader color={'#ff6600'} loading={loading} size={15} />
      );
    } else if (getRndInteger(1, 3) === 2) {
      return (
        <ClockLoader color={'#ff6600'} loading={loading} size={30} />
      );
    } else {
      return (
        <ClimbingBoxLoader color={'#ff6600'} loading={loading} size={15} />
      );
    }
  }
  

  if (loading) {
    return (
      <div className="loading-container">
        {loadingType()}
        <br />
        <h1 style={{color: 'white'}}>Did you know: you are reading this</h1>
      </div>
    ); // Clean loading with no flash
  }

  return (
    <App initialUser={user} />
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);