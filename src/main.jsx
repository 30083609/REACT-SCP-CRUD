import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

// Initialize React in the #root element and start the render loop
ReactDOM.createRoot(
  document.getElementById('root')    // grab the DOM node with id="root"
).render(
  <React.StrictMode>                
    <App />                         
  </React.StrictMode>
)
