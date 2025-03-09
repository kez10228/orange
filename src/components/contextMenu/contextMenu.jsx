import "./contextMenu.css";
import React from 'react'

const ContextMenu = ({
    rightClickItem,
    positionX,
    positionY,
    isToggled,
    buttons,
    contextMenuRef
}) => {
  return (
    <menu 
        ref={contextMenuRef}
        className={`context-menu ${isToggled ? 'active' : ''}`}
        style={{
            left: positionX,
            top: positionY
        }}
    >
        {buttons.map((button, index) => {
            function handleClick(e) {
                e.stopPropagation();
                button.onClick(e, rightClickItem);
            }   

            if (button.isSpacer) {
                return <hr key={index} className="spacer" />;
            }

            return (
                <button onClick={handleClick} className="context-menu-button">
                    <span>{button.text}</span>
                    <span className="icon">{button.icon}</span>
                </button>
            )
        })}
    </menu>
  )
}

export default ContextMenu