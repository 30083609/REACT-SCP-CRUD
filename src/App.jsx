import React, { useState } from 'react';
import './styles.css';
import Landing   from './Landing';
import MainMenu  from './components/MainMenu';
import SCPForm   from './components/SCPForm';
import Read      from './Read';
import Update    from './Update';
import Delete    from './Delete';

const App = () => {
  const [stage,      setStage] = useState('landing');
  const [activeView, setView]  = useState('Create');

  const handleEnter    = () => setStage('menu');
  const handleViewChange = (view) => {
    setView(view);
    setStage('crud');
  };

  return (
    <div className="container">
      {stage === 'landing' && <Landing onEnter={handleEnter} />}

      {stage === 'menu' && <MainMenu onSelect={handleViewChange} />}

      {stage === 'crud' && (
        <>
          {/* Global Back to Menu */}
          <div className="tab" style={{ justifyContent: 'center' }}>
            <button
              className="back-btn"
              onClick={() => setStage('menu')}
            >
              ← Back to Menu
            </button>
          </div>

          {activeView === 'Create' && (
            <SCPForm onSubmit={() => setStage('menu')}
                     goBack={() => setStage('menu')} />
          )}
          {activeView === 'Read'   && <Read /> }
          {activeView === 'Update' && <Update goBack={() => setStage('menu')} /> }
          {activeView === 'Delete' && <Delete /> }
        </>
      )}
    </div>
  );
};

export default App;
