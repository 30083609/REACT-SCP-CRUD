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

  // Switch from Landing screen to Main Menu
  const handleEnter = () => setStage('menu');

  // Change which CRUD view is active and show the CRUD UI
  const handleViewChange = (view) => {
    setView(view);
    setStage('crud');
  };

  return (
    <div className="container">
      {stage === 'landing' && (
        <Landing
          onEnter={handleEnter}     // when user clicks “enter”, call handleEnter()
        />
      )}

      {stage === 'menu' && (
        <MainMenu
          onSelect={handleViewChange}  // when user selects Create/Read/Update/Delete, call handleViewChange()
        />
      )}

      {stage === 'crud' && (
        <>
          {/* Global Back to Menu */}
          <div className="tab" style={{ justifyContent: 'center' }}>
            <button
              className="back-btn"
              onClick={() => setStage('menu')}  // back button: return to menu stage
            >
              ← Back to Menu
            </button>
          </div>

          {activeView === 'Create' && (
            <SCPForm
              onSubmit={() => {
                // insert new SCP entry into DB then return to Main Menu
                setStage('menu');
              }}
              goBack={() => setStage('menu')}  // cancel Create: just return to menu
            />
          )}

          {activeView === 'Read' && (
            <Read />
            /* Read component:
               - fetch all SCP entries from DB on mount
               - display list/table of records */
          )}

          {activeView === 'Update' && (
            <Update
              goBack={() => setStage('menu')}  // after updating in DB, return to menu
            />
          )}

          {activeView === 'Delete' && (
            <Delete />
            /* Delete component:
               - fetch entries, allow selection
               - delete selected entry from DB */
          )}
        </>
      )}
    </div>
  );
};

export default App;
