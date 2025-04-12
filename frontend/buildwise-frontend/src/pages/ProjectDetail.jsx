import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HardHat,
  Box,
  Users,
  Clock,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import CostBreakdownChart from '../components/dashboard/CostBreakdownChart';
import { useAuth } from '../context/AuthContext';
import { getProject, deleteProject } from '../services/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(id);
        if (data.userId !== currentUser.uid) {
          throw new Error('Unauthorized access');
        }
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, currentUser]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Projects
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Project Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="opacity-90 mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  title="Edit Project"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Project Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HardHat className="h-5 w-5 text-blue-500" />
                  Project Overview
                </h2>
                <p className="text-gray-700">{project.description || 'No description provided'}</p>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{project.status}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{new Date(project.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  Cost Breakdown
                </h2>
                <div className="h-64">
                  <CostBreakdownChart projects={[project]} detailed />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Box className="h-5 w-5 text-blue-500" />
                  Dimensions
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Length</span>
                    <span className="font-medium">{project.dimensions.length} ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Width</span>
                    <span className="font-medium">{project.dimensions.width} ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height</span>
                    <span className="font-medium">{project.dimensions.height} ft</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Labor
                </h2>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Hours</span>
                  <span className="font-medium">{project.laborHours}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  Total Cost
                </h2>
                <div className="text-2xl font-bold text-blue-600">
                  ${project.totalCost?.toLocaleString() || '0'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}