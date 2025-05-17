import React from 'react';
import "../styles.css";

/*
 Main menu with CRUD buttons.  
 Props:
 onSelect(tabName): callback for when user picks Create/Read/Update/Delete
 */

const MainMenu = ({ onSelect }) => {
  return (
    <div className="tabcontent active">
      <h2 className="scp-title">SCP Database Control Panel</h2>
      <p style={{ textAlign: 'center', color: 'lime' }}>Secure • Contain • Protect</p>
      <div className="tab" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        {['Create', 'Read', 'Update', 'Delete'].map((tab) => (
          <button
            key={tab}
            className="tab-button"
            onClick={() => onSelect(tab)}
            style={{ minWidth: '150px', fontSize: '1.2rem' }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
