import React, { useState } from 'react'
import './styles.css'
import Landing from './Landing'
import MainMenu from './components/MainMenu'
import SCPForm from './components/SCPForm'
import Read     from './Read'
import Update   from './Update'
import Delete   from './Delete'

/**
 * App root — switches between:
 *  • landing → menu → CRUD screens
 */
const App = () => {
  // stage: 'landing' | 'menu' | 'crud'
  const [stage,     setStage] = useState('landing')
  // which CRUD screen to show
  const [activeView, setView] = useState('Create')

  // Enter pressed on Landing
  const handleEnter = () => setStage('menu')

  // MainMenu button pressed
  const handleViewChange = (view) => {
    setView(view)
    setStage('crud')
  }

  return (
    <div className="container">
      {stage === 'landing' && <Landing onEnter={handleEnter} />}

      {stage === 'menu'    && <MainMenu onSelect={handleViewChange} />}

      {stage === 'crud'    && (
        <>
          {/* Back to MainMenu */}
          <div className="tab">
            <button
              className="back-btn"
              onClick={() => setStage('menu')}
            >
              ← Back to Menu
            </button>
          </div>

          {/* Render the selected CRUD view */}
          {activeView === 'Create' && (
            <SCPForm onSubmit={() => setStage('menu')}
                     goBack={() => setStage('menu')} />
          )}
          {activeView === 'Read'   && <Read /> }
          {activeView === 'Update' && <Update goBack={() => setStage('menu')} /> }
          {activeView === 'Delete' && <Delete goBack={() => setStage('menu')} /> }
        </>
      )}
    </div>
  )
}

export default App
