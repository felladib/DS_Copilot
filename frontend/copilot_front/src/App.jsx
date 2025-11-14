import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings';
import {SidebarProvider} from './utils/SidebarContext';
import { ThemeProvider } from './utils/ThemeContext';
function App() {


  return (
    <Router>
      <ThemeProvider>
      <SidebarProvider>
        <div className="app">
          <Routes>
            <Route path="/r" element={<Dashboard />} />
            <Route path="/Settings" element={<Settings />} />
            {/* Tu peux ajouter d'autres routes ici */}
          </Routes>
        </div>
      </SidebarProvider>
       </ThemeProvider>
    </Router>
  )
}

export default App
