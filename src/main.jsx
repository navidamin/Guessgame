import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// HashRouter instead of BrowserRouter: GitHub Pages has no server-side
// rewrites, so a hard refresh or shared link to /game/CODE would 404.
// Hash routes (#/game/CODE) keep deep links working on static hosting.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
