// src/pages/ReportPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Printer, 
  ArrowLeft,
  HardHat,
  DollarSign,
  Box,
  Users,
  Clock
} from 'lucide-react';
import { useAuth } from '../Authcontext';
import { getProjectById } from '../services/api';
import ReportDocument from './ReportDocument';

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectData = await getProjectById(id);
        
        if (projectData.userId !== currentUser?.uid) {
          throw new Error('You do not have permission to view this project');
        }
        
        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (id && currentUser) {
      fetchProject();
    }
  }, [id, currentUser]);

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    // In a real app, this would generate and download the PDF
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Report</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(`/projects/${id}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Project
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Report Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8" />
                <div>
                  <h1 className="text-2xl font-bold">Project Report</h1>
                  <p className="opacity-90">{project.name}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-50 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : (
                    <>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-50"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-6">
            <ReportDocument project={project} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}