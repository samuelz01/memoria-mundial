import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Investigacion from './pages/Investigacion';

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Home isDark={isDark} toggleTheme={toggleTheme} />} 
        />
        <Route 
          path="/investigacion/:temaId" 
          element={<Investigacion isDark={isDark} toggleTheme={toggleTheme} />} 
        />
      </Routes>
    </Router>
  );
}
