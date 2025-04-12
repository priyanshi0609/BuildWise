// src/pages/EditProjectPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  HardHat,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../Authcontext';
import { getProjectById, updateProject } from '../services/api';
import ProjectForm from '../components/forms/ProjectForm';

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    dimensions: { length: '', width: '', height: '' },
    materials: [],
    laborHours: 0,
    laborCostPerHour: 50,
    equipmentCost: 0,
    overheadCost: 0,
    startDate: new Date().toISOString().split('T')[0],
    description: '',
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectData = await getProjectById(id);
        
        if (projectData.userId !== currentUser?.uid) {
          throw new Error('You do not have permission to edit this project');
        }
        
        setProject(projectData);
        setFormData({
          name: projectData.name || '',
          location: projectData.location || '',
          dimensions: projectData.dimensions || { length: '', width: '', height: '' },
          materials: projectData.materials || [],
          laborHours: projectData.laborHours || 0,
          laborCostPerHour: projectData.laborCostPerHour || 50,
          equipmentCost: projectData.equipmentCost || 0,
          overheadCost: projectData.overheadCost || 0,
          startDate: projectData.startDate || new Date().toISOString().split('T')[0],
          description: projectData.description || '',
          status: projectData.status || 'active'
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const updatedProject = await updateProject(id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      setProject(updatedProject);
      navigate(`/projects/${id}`, { state: { updated: true } });
    } catch (err) {
      console.error('Project update failed:', err);
      setError(err.message || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
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
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <HardHat className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Edit Project</h1>
                <p className="opacity-90">{project.name}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <ProjectForm 
              formData={formData}
              onUpdate={(data) => setFormData({...formData, ...data})}
              onNext={handleSubmit}
              isEditing
            />

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}