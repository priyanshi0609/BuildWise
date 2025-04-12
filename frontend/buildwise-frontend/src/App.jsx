import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './Authcontext';
import NewProjectPage from './pages/NewProjectPage';
import Settings from './pages/Settings';
import SignupModalS from './pages/signup-model';

const App = () => {
  return (
    <AuthProvider>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<NewProjectPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signup-model" element={<SignupModalS />} />
          
        </Routes>
      
    </AuthProvider>
  );
};

export default App;
