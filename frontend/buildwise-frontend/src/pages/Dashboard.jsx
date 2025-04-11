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
import ProjectCard from '@/components/Dashboard/ProjectCard';
import CostBreakdownChart from '@/components/Dashboard/CostBreakdownChart';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import { useAuth } from '@/context/AuthContext';
import { getProjects } from '@/services/api';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userProjects = await getProjects(currentUser.uid);
        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <HardHat className="h-8 w-8 text-blue-600 mr-2" />
            BuildWise Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
              <p className="opacity-90">You have {projects.length} active project{projects.length !== 1 ? 's' : ''}</p>
            </div>
            <button 
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center font-medium shadow-sm transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              onClick={() => navigate('/estimate/new')}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </motion.div>

        {/* Dashboard Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`${activeTab === 'projects' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${activeTab === 'analytics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`${activeTab === 'reports' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Reports
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'projects' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectCard 
                  project={project}
                  onClick={() => navigate(`/projects/${project.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
                Cost Breakdown
              </h3>
              <CostBreakdownChart projects={projects} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                Recent Activity
              </h3>
              <RecentActivity userId={currentUser.uid} />
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              Generated Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.filter(p => p.reportGenerated).map(project => (
                <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded flex items-center transition-colors"
                      onClick={() => navigate(`/reports/${project.id}`)}
                    >
                      View <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                    <span>Estimated: ${project.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}