// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Authcontext';
// import PrivateRoute from './components/navigation/PrivateRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NewProjectPage from './pages/NewProjectPage';
import ProjectDetail from './pages/ProjectDetail';
import EditProjectPage from './pages/EditProjectPage';
import ReportPage from './pages/ReportPage';
import Optimize from './pages/Optimize';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
   
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<LoginModel />} />
          <Route path="/signup" element={<SignupModel />} /> */}
          
          {/* Now directly accessible routes (previously private) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-project" element={<NewProjectPage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/edit" element={<EditProjectPage />} />
          <Route path="/projects/:id/report" element={<ReportPage />} />
          <Route path="/projects/:id/optimize" element={<Optimize />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>

    </AuthProvider>
  );
};

export default App;
