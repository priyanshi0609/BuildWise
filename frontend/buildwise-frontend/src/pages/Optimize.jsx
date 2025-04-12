// src/pages/Optimize.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  HardHat,
  DollarSign,
  Check,
  AlertTriangle,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../Authcontext';
import { getProjectById, updateProject } from '../services/api';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Access the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function Optimize() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optimized, setOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [savings, setSavings] = useState(0);
  const [optimizedMaterials, setOptimizedMaterials] = useState([]);
  const [aiError, setAiError] = useState(null);

  const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

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

  const getOptimizationReason = (materialName) => {
    const reasons = {
      'Concrete': 'Alternative mix with similar strength but lower cost',
      'Steel Rebar': 'Bulk purchase discount available',
      'Brick': 'Local supplier has surplus inventory',
      'Wood Plank': 'Sustainable alternative from certified forest',
      'Drywall': 'Thinner variant with same performance',
      'Roof Shingles': 'Overstock from previous project',
      'PVC Pipe': 'Recycled material option',
      'Electrical Wire': 'Copper-aluminum composite alternative'
    };
    return reasons[materialName] || 'Supplier discount available';
  };

  const handleAIOptimize = async () => {
    if (!genAI) {
      setAiError("Gemini API key not configured");
      return;
    }

    try {
      setAiError(null);
      setIsOptimizing(true);
      
      const prompt = `
Suggest cheaper and eco-friendly alternatives for the following construction materials.
For each item, provide:
1. Alternative Material Name
2. Estimated Cost Per Unit (in USD)
3. Reason for Suggestion (brief)

Format your response as:
Alternative: [material name]
Cost: [price per unit]
Reason: [explanation]

Materials:
${project.materials.map(mat => 
  `Name: ${mat.name}, Quantity: ${mat.quantity} ${mat.unit}, Current Cost: $${mat.price} per ${mat.unit}`
).join('\n')}
`;

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Parse the AI response
      const parsed = text.split('\n').filter(line => line.trim());
      const aiOptimized = [];
      let currentMaterial = {};

      parsed.forEach(line => {
        if (line.toLowerCase().includes("alternative:")) {
          if (Object.keys(currentMaterial).length > 0) {
            aiOptimized.push(currentMaterial);
          }
          currentMaterial = {
            name: line.split(':')[1].trim(),
            fromAI: true
          };
        } else if (line.toLowerCase().includes("cost:")) {
          const costText = line.split(':')[1].trim().replace('$', '');
          currentMaterial.price = parseFloat(costText) || 0;
        } else if (line.toLowerCase().includes("reason:")) {
          currentMaterial.reason = line.split(':')[1].trim();
        }
      });

      if (Object.keys(currentMaterial).length > 0) {
        aiOptimized.push(currentMaterial);
      }

      // Map AI suggestions to our original materials
      const combinedOptimized = project.materials.map((mat, index) => {
        const aiSuggestion = aiOptimized[index] || {};
        const randomDiscount = Math.random() * 0.2 + 0.1; // 10-30% discount as fallback
        
        return {
          ...mat,
          originalPrice: mat.price,
          price: aiSuggestion.price || parseFloat((mat.price * (1 - randomDiscount)).toFixed(2)),
          savings: mat.price - (aiSuggestion.price || parseFloat((mat.price * (1 - randomDiscount)).toFixed(2))),
          reason: aiSuggestion.reason || getOptimizationReason(mat.name),
          isAISuggestion: !!aiSuggestion.name
        };
      });

      const totalSavings = combinedOptimized.reduce(
        (sum, material) => sum + (material.savings * material.quantity), 0
      );

      setOptimizedMaterials(combinedOptimized);
      setSavings(totalSavings);
      setOptimized(true);
    } catch (err) {
      console.error('AI Optimization failed:', err);
      setAiError(err.message || 'Failed to get AI suggestions. Using fallback optimization.');
      // Fallback to mock optimization if AI fails
      handleMockOptimize();
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleMockOptimize = () => {
    const mockOptimizedMaterials = project.materials.map(material => {
      const randomDiscount = Math.random() * 0.3 + 0.1; // 10-40% discount
      const optimizedPrice = material.price * (1 - randomDiscount);
      return {
        ...material,
        originalPrice: material.price,
        price: parseFloat(optimizedPrice.toFixed(2)),
        savings: material.price - optimizedPrice,
        reason: getOptimizationReason(material.name),
        isAISuggestion: false
      };
    });
    
    const totalSavings = mockOptimizedMaterials.reduce(
      (sum, material) => sum + (material.savings * material.quantity), 0
    );
    
    setOptimizedMaterials(mockOptimizedMaterials);
    setSavings(totalSavings);
    setOptimized(true);
  };

  const handleOptimize = async () => {
    try {
      setIsOptimizing(true);
      setError(null);
      
      // Try AI optimization first, falls back to mock if fails
      await handleAIOptimize();
    } catch (err) {
      console.error('Optimization failed:', err);
      setError(err.message || 'Failed to optimize project');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyChanges = async () => {
    try {
      setIsOptimizing(true);
      
      const updatedMaterials = optimizedMaterials.map(({ 
        originalPrice, 
        savings, 
        reason, 
        isAISuggestion,
        ...rest 
      }) => rest);
      
      await updateProject(id, {
        materials: updatedMaterials,
        materialsCost: project.materialsCost - savings,
        totalCost: project.totalCost - savings,
        optimizedAt: new Date().toISOString(),
        optimizationSavings: savings
      });
      
      navigate(`/projects/${id}`, { state: { optimized: true } });
    } catch (err) {
      console.error('Failed to apply changes:', err);
      setError(err.message || 'Failed to save optimized project');
    } finally {
      setIsOptimizing(false);
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
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <BarChart2 className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Cost Optimization</h1>
                <p className="opacity-90">{project.name}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!API_KEY && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-700">
                  <strong>Note:</strong> Gemini API key not configured. Using mock optimization data.
                </p>
              </div>
            )}

            {aiError && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-700">
                  <strong>AI Service Error:</strong> {aiError} Using fallback optimization.
                </p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Current Project Costs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium">Total Estimated Cost</h3>
                  <p className="text-2xl font-bold">
                    ${project.totalCost?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium">Materials Cost</h3>
                  <p className="text-2xl font-bold">
                    ${project.materialsCost?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium">Materials Count</h3>
                  <p className="text-2xl font-bold">
                    {project.materials?.length || '0'}
                  </p>
                </div>
              </div>
            </div>

            {!optimized ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-4">
                  Run AI-powered cost optimization
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our system will analyze your project materials and suggest cost-saving alternatives 
                  without compromising quality or structural integrity.
                </p>
                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <BarChart2 className="h-5 w-5" />
                      Optimize Costs
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium text-green-800">
                        Potential Savings Found!
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-green-800">
                      ${savings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    These changes could save you {((savings / project.materialsCost) * 100).toFixed(1)}% on material costs.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">Optimized Materials</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Material
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Original Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            New Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Savings
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reason
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {optimizedMaterials.map((material, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {material.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              ${material.originalPrice?.toLocaleString() || '0'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              ${material.price?.toLocaleString() || '0'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                              ${((material.savings || 0) * (material.quantity || 1)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {material.isAISuggestion ? (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  AI Suggested
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  System Suggested
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {material.reason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setOptimized(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Re-run Optimization
                  </button>
                  <button
                    onClick={handleApplyChanges}
                    disabled={isOptimizing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isOptimizing ? 'Saving...' : 'Apply Changes'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}