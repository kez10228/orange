import React, { useState, useEffect } from 'react';

const ContextMenu2 = () => {
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.pageX, y: e.pageY });
  };

  const handleClick = (e) => {
    if (!e.target.closest('.context-menu-button')) {
      setContextMenu({ show: false, x: 0, y: 0 });
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const buttonStyle = {
    padding: '6px 8px',
    color: '#dcddde',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    borderRadius: '2px'
  };

  return contextMenu.show ? (
    <div style={{ 
      position: 'absolute', 
      top: contextMenu.y, 
      left: contextMenu.x,
      background: '#2f3136',
      border: '1px solid #202225',
      borderRadius: '4px',
      padding: '4px',
      zIndex: 1000
    }}>
      <button 
        className="context-menu-button"
        style={buttonStyle}
        onClick={() => {
          window.alert('Inspecting Element (teehee)');
          window.alert('This is just a joke, I don\'t have the time to make this feature.');
          window.alert('I\'ll probably make it later (prob not due to procrastination)');
          window.alert('But for now, you can view the source code on GitHub.');
          window.alert('https://github.com/kez10228/orange');
          window.alert('Or you can open DevTools using Ctrl + Shift + I');
          window.alert('FUN FACT: I made this in 2 hours (I mean this update)');
          window.alert('(I\'m not that good at coding)');
          window.alert('yet another... FUN FACT: Ctrl + Shift + J opens the console tab');
          setContextMenu({ show: false, x: 0, y: 0 });
        }}
        onMouseEnter={(e) => e.target.style.background = '#36393f'}
        onMouseLeave={(e) => e.target.style.background = 'none'}
      >
        Inspect Element
      </button>
      <button 
        className="context-menu-button"
        style={buttonStyle}
        onClick={() => {
          window.open('https://github.com/kez10228/orange', '_blank');
          setContextMenu({ show: false, x: 0, y: 0 });
        }}
        onMouseEnter={(e) => e.target.style.background = '#36393f'}
        onMouseLeave={(e) => e.target.style.background = 'none'}
      >
        View Source Code
      </button>
    </div>
  ) : null;
};

export default ContextMenu2;
