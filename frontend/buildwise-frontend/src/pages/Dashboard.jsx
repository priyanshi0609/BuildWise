import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  FileText,
  BarChart2,
  Settings,
  HardHat,
  Clock,
  DollarSign,
  ArrowRight
} from 'lucide-react';

import ProjectCard from '../components/dashboard/ProjectCard';
import CostBreakdownChart from '../components/dashboard/CostBreakdownChart';
import RecentActivity from '../components/dashboard/RecentActivity';
// import Optimization from '../components/dashboard/Optimize';
import { useAuth } from '../Authcontext';
import { getProjects } from '../services/api';

export default function Dashboard() {
  // Local state for project list, loading/error indicators, and tab navigation
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');

  const { currentUser, logout } = useAuth() || {};
  const navigate = useNavigate();

  // Fetch user's projects from Firebase on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (currentUser?.uid) {
          const userProjects = await getProjects(currentUser.uid);
          setProjects(Array.isArray(userProjects) ? userProjects : []);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects');
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser]);

  // Animation configs for staggered fade-in effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Redirect unauthenticated users to login
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="mb-4">Please log in to access the dashboard</p>
          <button
            onClick={() => navigate('/login-model')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading spinner while fetching projects
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Display error screen if fetching fails
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <HardHat className="h-8 w-8 text-blue-600 mr-2" />
            BuildWise Dashboard
          </h1>
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white shadow-lg"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.displayName || 'User'}!</h2>
              <p className="opacity-90">
                {projects.length === 0
                  ? "You don't have any projects yet"
                  : `You have ${projects.length} active project${projects.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center font-medium shadow-sm"
              onClick={() => navigate('/new-project')}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </motion.div>

        {/* Tabs for Projects, Analytics, Reports, Optimization */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['projects', 'analytics', 'reports'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* --- Projects Tab --- */}
        {activeTab === 'projects' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.length > 0 ? (
              projects.map((project) => (
                <motion.div key={project.id || Math.random()} variants={itemVariants}>
                  <ProjectCard
                    project={project}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  />
                </motion.div>
              ))
            ) : (
              // Show when there are no projects
              <div className="col-span-full text-center py-12">
                <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-500 mb-6">Get started by creating your first project</p>
                  <button
                    onClick={() => navigate('/new-project')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Project
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* --- Analytics Tab --- */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cost Breakdown Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
                Cost Breakdown
              </h3>
              {projects.length > 0 ? (
                <CostBreakdownChart projects={projects} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No data available. Create projects to see analytics.
                </div>
              )}
            </div>

            {/* Recent Activity Log */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                Recent Activity
              </h3>
              <RecentActivity userId={currentUser.uid} />
            </div>
          </div>
        )}

        {/* --- Reports Tab --- */}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              Generated Reports
            </h3>
            {projects.filter(p => p.reportGenerated).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.filter(p => p.reportGenerated).map(project => (
                  <div key={project.id} className="border rounded-lg p-4 bg-white hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'No date available'}
                        </p>
                      </div>
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded flex items-center"
                        onClick={() => navigate(`/reports/${project.id}`)}
                      >
                        View <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center text-sm">
                      <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                      <span>Estimated: ₹{project.totalCost?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reports generated yet. Create projects and generate reports to view them here.
              </div>
            )}
          </div>
        )}

        {/* --- Optimization Tab --- */}
        {activeTab === 'optimization' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                Optimization Insights
              </h3>
              {/* Send the first available project ID to the Optimization component */}
              {projects.length > 0 ? (
                <Optimization projectId={projects[0]?.id} />
              ) : (
                <p className="text-gray-500">No project available to optimize.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
