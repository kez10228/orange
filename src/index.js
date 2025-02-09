import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GridLoader from 'react-spinners/GridLoader';
import { Analytics } from "@vercel/analytics/react"

const AppWrapper = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <GridLoader
          color={"#F37A24"}
          loading={loading}
          size={20}
          aria-label="Loading"
          data-testid="loader"
        />
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