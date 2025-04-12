import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './Authcontext';
import NewProjectPage from './pages/NewProjectPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<NewProjectPage />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
