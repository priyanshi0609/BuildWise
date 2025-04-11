import { useState } from 'react';
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
  Check
} from 'lucide-react';
import ProjectForm from '../components/Forms/ProjectForm';
import MaterialSelector from '../components/Forms/MaterialSelector';
import { useAuth } from '../context/AuthContext';
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createProject({
        ...formData,
        userId: currentUser.uid
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Project creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
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
          {step === 1 && (
            <ProjectForm 
              formData={formData}
              onUpdate={(data) => setFormData({...formData, ...data})}
              onNext={() => setStep(2)}
            />
          )}
          
          {step === 2 && (
            <MaterialSelector 
              selectedMaterials={formData.materials}
              onUpdate={(materials) => setFormData({...formData, materials})}
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
                      <p><span className="font-medium">Name:</span> {formData.name}</p>
                      <p><span className="font-medium">Location:</span> {formData.location}</p>
                      <p><span className="font-medium">Start Date:</span> {formData.startDate}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Box className="h-4 w-4 text-blue-500" />
                      Dimensions
                    </h4>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Length:</span> {formData.dimensions.length} ft</p>
                      <p><span className="font-medium">Width:</span> {formData.dimensions.width} ft</p>
                      <p><span className="font-medium">Height:</span> {formData.dimensions.height} ft</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Labor
                    </h4>
                    <p className="mt-2"><span className="font-medium">Hours:</span> {formData.laborHours}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                      Materials
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {formData.materials.map(material => (
                        <li key={material.id}>
                          {material.name} ({material.quantity} units)
                        </li>
                      ))}
                    </ul>
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
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}