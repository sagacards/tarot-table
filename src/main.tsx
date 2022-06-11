import React from 'react'
import ReactDOM from 'react-dom'
import '@fontsource/uncial-antiqua'
import './index.css'
import App from './App'

document.addEventListener('contextmenu', event => event.preventDefault());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
