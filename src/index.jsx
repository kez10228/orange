import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GridLoader, ClockLoader, ClimbingBoxLoader} from 'react-spinners';
import ReCAPTCHA from "react-google-recaptcha";
import { Analytics } from '@vercel/analytics/react';

const AppWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [user] = useState(null);

  function onChange() {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }
  
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
        <h1>Hee hee you have to do captcha now :)</h1>
        <br />
        <ReCAPTCHA 
          sitekey="6Ldw8P8qAAAAAFuXqeAcGlLUsjsFckZeQZRsPpCt"
          onChange={() => onChange()}
          size="normal"
        />
      </div>
    ); // Clean loading with no flash
  }

  return (
    <>
      <App initialUser={user} />
      <Analytics mode="production" />
    </>
    
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);