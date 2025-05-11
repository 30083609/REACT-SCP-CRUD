import React, { useState } from 'react';
import './styles.css';
import Landing from './Landing';
import MainMenu from './components/MainMenu';
import SCPForm from './components/SCPForm';
import Read from './Read';

const App = () => {
  const [stage, setStage] = useState('landing'); // landing → menu → section
  const [activeView, setActiveView] = useState('Create');

  const handleEnter = () => setStage('menu');

  const handleViewChange = (view) => {
    setActiveView(view);
    setStage('crud');
  };

  return (
    <div className="container">
      {stage === 'landing' && <Landing onEnter={handleEnter} />}

      {stage === 'menu' && <MainMenu onSelect={handleViewChange} />}

      {stage === 'crud' && (
        <>
          <div className="tab" style={{ justifyContent: 'center' }}>
            <button onClick={() => setStage('menu')}>← Back to Menu</button>
          </div>

          {activeView === 'Create' && <SCPForm />}
          {activeView === 'Read' && <Read />}
          {activeView === 'Update' && (
            <p style={{ textAlign: 'center', color: 'lime' }}>Update form coming soon...</p>
          )}
          {activeView === 'Delete' && (
            <p style={{ textAlign: 'center', color: 'lime' }}>Delete interface coming soon...</p>
          )}
        </>
      )}
    </div>
  );
};

export default App;
