// src/pages/ProjectDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HardHat,
  MapPin,
  Clock,
  DollarSign,
  Box,
  Users,
  Edit,
  Trash2,
  ArrowLeft,
  FileText,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../Authcontext';
import { getProjectById, updateProject, deleteProject } from '../services/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectData = await getProjectById(id);
        
        // Verify the project belongs to the current user
        if (projectData.userId !== currentUser?.uid) {
          throw new Error('You do not have permission to view this project');
        }
        
        setProject(projectData);
        setEditData({
          name: projectData.name,
          description: projectData.description,
          status: projectData.status
        });
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProject(id, editData);
      setProject(prev => ({ ...prev, ...editData }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        setLoading(true);
        await deleteProject(id);
        navigate('/dashboard', { state: { projectDeleted: true } });
      } catch (err) {
        console.error('Error deleting project:', err);
        setError(err.message || 'Failed to delete project');
        setLoading(false);
      }
    }
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
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Project</h2>
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Project Not Found</h2>
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Project Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="bg-blue-700 border-b border-blue-400 text-white text-2xl font-bold p-1 w-full focus:outline-none focus:border-white"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Project Content */}
          <div className="p-6">
            {/* Status and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 text-sm">
                  Status
                </h3>
                {isEditing ? (
                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <p className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'on_hold' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status?.replace('_', ' ') || 'Active'}
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Start Date
                </h3>
                <p className="mt-2">{formatDate(project.startDate)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 text-sm">
                  Last Updated
                </h3>
                <p className="mt-2">{formatDate(project.updatedAt)}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Description</h3>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">
                  {project.description || 'No description provided'}
                </p>
              )}
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex justify-end gap-2 mb-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2">
                    <Box className="h-4 w-4 text-blue-500" />
                    Dimensions
                  </h3>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Length</p>
                      <p>{project.dimensions?.length || '0'} m</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Width</p>
                      <p>{project.dimensions?.width || '0'} m</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Height</p>
                      <p>{project.dimensions?.height || '0'} m</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Labor
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Hours:</span> {project.laborHours || '0'}</p>
                    <p><span className="font-medium">Cost/Hour:</span> ${project.laborCostPerHour?.toLocaleString() || '0'}</p>
                    <p><span className="font-medium">Total Labor Cost:</span> ${project.laborCost?.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    Costs
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Materials:</span> ${project.materialsCost?.toLocaleString() || '0'}</p>
                    <p><span className="font-medium">Labor:</span> ${project.laborCost?.toLocaleString() || '0'}</p>
                    <p><span className="font-medium">Equipment:</span> ${project.equipmentCost?.toLocaleString() || '0'}</p>
                    <p><span className="font-medium">Overhead:</span> ${project.overheadCost?.toLocaleString() || '0'}</p>
                    <p className="pt-2 border-t mt-2">
                      <span className="font-medium">Total:</span> ${project.totalCost?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2">
                    <Box className="h-4 w-4 text-blue-500" />
                    Materials
                  </h3>
                  {project.materials?.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {project.materials.map((material, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{material.name} ({material.quantity} {material.unit})</span>
                          <span>${(material.price * material.quantity).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-gray-500">No materials selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/projects/${id}/report`)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Generate Report
              </button>
              <button
                onClick={() => navigate(`/projects/${id}/optimize`)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <BarChart2 className="h-4 w-4" />
                Optimize Costs
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}