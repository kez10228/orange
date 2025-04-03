import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GridLoader, ClockLoader, ClimbingBoxLoader} from 'react-spinners';

const AppWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [user] = useState(null);

  setTimeout(() => {
    setLoading(false);
  }, 1000);
  
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  const loadingType = () => {
    if (getRndInteger(1, 3) === 1) {
      return (
        <GridLoader color={'#a84c0f'} loading={loading} size={15} />
      );
    } else if (getRndInteger(1, 3) === 2) {
      return (
        <ClockLoader color={'#a84c0f'} loading={loading} size={30} />
      );
    } else {
      return (
        <ClimbingBoxLoader color={'#a84c0f'} loading={loading} size={15} />
      );
    }
  }
  

  if (loading) {
    return (
      <div className="loading-container">
        {loadingType()}
        <br />
        <h1 style={{color: 'white'}}>Did you know: Beanz beanz za magic froot za more you eat za more you toot!!!! ⛽⛽⛽</h1>
      </div>
    ); // Clean loading with no flash
  }

  return (
    <App initialUser={user} />
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);