
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  HardHat,
  Box,
  Users,
  Clock,
  MapPin,
  DollarSign,
  Check,
  AlertTriangle,
  Wifi,
  WifiOff,
  Save
} from 'lucide-react';
import ProjectForm from '../components/forms/ProjectForm';
import MaterialSelector from '../components/forms/MaterialSelector';
import { useAuth } from '../Authcontext';
import { createProject } from '../services/api';

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    dimensions: { length: '', width: '', height: '' },
    materials: [],
    laborHours: 0,
    startDate: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [savedLocally, setSavedLocally] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for locally saved draft
    const savedDraft = localStorage.getItem('projectDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        if (draftData.userId === currentUser?.uid) {
          // Ask user if they want to restore the draft
          if (window.confirm('We found a saved draft project. Would you like to restore it?')) {
            setFormData(draftData.formData);
          } else {
            localStorage.removeItem('projectDraft');
          }
        }
      } catch (e) {
        console.error('Error parsing saved draft:', e);
        localStorage.removeItem('projectDraft');
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);

  const saveProjectLocally = () => {
    if (!currentUser?.uid) return;
    
    try {
      localStorage.setItem('projectDraft', JSON.stringify({
        userId: currentUser.uid,
        formData,
        savedAt: new Date().toISOString()
      }));
      setSavedLocally(true);
      setTimeout(() => setSavedLocally(false), 3000); // Reset saved notification after 3 seconds
    } catch (e) {
      console.error('Error saving project locally:', e);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser?.uid) {
      setError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    // Validate required fields before submission
    if (!formData.name) {
      setError('Project name is required');
      setIsSubmitting(false);
      return;
    }
    
    // Save locally in case of network failure
    saveProjectLocally();
    
    if (!isOnline) {
      setError('You are currently offline. Project has been saved locally and will be submitted when youre back online.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const projectToCreate = {
        ...formData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };
      
      const response = await createProject(projectToCreate);
      
      if (response) {
        // Clear local storage draft on successful submission
        localStorage.removeItem('projectDraft');
        navigate('/dashboard', { state: { projectCreated: true } });
      } else {
        throw new Error('Failed to create project. Empty response received.');
      }
    } catch (error) {
      console.error('Project creation failed:', error);
      
      if (error.message === 'Network Error') {
        setError('Unable to connect to the server. Project has been saved locally and will be submitted when connection is restored.');
      } else {
        setError(error.response?.data?.message || 
                error.message || 
                'Failed to create project. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  // Function to try submitting again
  const retrySubmit = () => {
    setError(null);
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Network Status Indicator */}
        <div className={`px-4 py-2 flex items-center justify-center gap-2 text-sm ${isOnline ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <span>Online - Changes will be saved to the server</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>Offline - Changes will be saved locally</span>
            </>
          )}
        </div>
        
        {/* Save confirmation */}
        {savedLocally && (
          <div className="px-4 py-2 bg-blue-50 text-blue-700 flex items-center justify-center gap-2 text-sm">
            <Save className="h-4 w-4" />
            <span>Draft saved locally</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => step > 1 ? setStep(step-1) : navigate('/dashboard')}
              className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HardHat className="h-6 w-6" />
              New Project
            </h2>
            <div className="w-6"></div> {/* Spacer */}
          </div>
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center 
                    ${step >= i ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}>
                    {step > i ? <Check className="h-4 w-4" /> : i}
                  </div>
                  <span className={`text-xs mt-1 ${step >= i ? 'font-semibold' : 'text-blue-200'}`}>
                    {i === 1 ? 'Details' : i === 2 ? 'Materials' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {/* Display error message if there is one */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex flex-col">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
              {error.includes('offline') || error.includes('connect to the server') ? (
                <div className="mt-2 flex justify-end">
                  <button 
                    onClick={saveProjectLocally}
                    className="mr-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Save Draft
                  </button>
                  <button 
                    onClick={retrySubmit}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {step === 1 && (
            <ProjectForm 
              formData={formData}
              onUpdate={(data) => {
                setFormData({...formData, ...data});
                if (Object.keys(data).length > 0) {
                  saveProjectLocally(); // Auto-save when form changes
                }
              }}
              onNext={() => setStep(2)}
            />
          )}
          
          {step === 2 && (
            <MaterialSelector 
              selectedMaterials={formData.materials}
              onUpdate={(materials) => {
                setFormData({...formData, materials});
                saveProjectLocally(); // Auto-save when materials change
              }}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Review Your Project
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <HardHat className="h-4 w-4 text-blue-500" />
                      Project Details
                    </h4>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Name:</span> {formData.name || 'Not specified'}</p>
                      <p><span className="font-medium">Location:</span> {formData.location || 'Not specified'}</p>
                      <p><span className="font-medium">Start Date:</span> {formData.startDate}</p>
                      {formData.description && (
                        <p className="mt-1"><span className="font-medium">Description:</span> {formData.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Box className="h-4 w-4 text-blue-500" />
                      Dimensions
                    </h4>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Length:</span> {formData.dimensions.length || '0'} ft</p>
                      <p><span className="font-medium">Width:</span> {formData.dimensions.width || '0'} ft</p>
                      <p><span className="font-medium">Height:</span> {formData.dimensions.height || '0'} ft</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Labor
                    </h4>
                    <p className="mt-2"><span className="font-medium">Hours:</span> {formData.laborHours || '0'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                      Materials
                    </h4>
                    {formData.materials && formData.materials.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {formData.materials.map(material => (
                          <li key={material.id}>
                            {material.name} ({material.quantity} units)
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-gray-500">No materials selected</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={saveProjectLocally}
                    className="px-4 py-2 flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}