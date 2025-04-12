import { useState } from 'react';

export default function ProjectForm({ formData, onUpdate, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.dimensions.length) newErrors.length = 'Length is required';
    if (!formData.dimensions.width) newErrors.width = 'Width is required';
    if (!formData.dimensions.height) newErrors.height = 'Height is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Project Details</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Length (ft)</label>
            <input
              type="number"
              value={formData.dimensions.length}
              onChange={(e) => onUpdate({ 
                dimensions: { ...formData.dimensions, length: e.target.value } 
              })}
              className={`w-full px-3 py-2 border rounded-md ${errors.length ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.length && <p className="mt-1 text-sm text-red-600">{errors.length}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width (ft)</label>
            <input
              type="number"
              value={formData.dimensions.width}
              onChange={(e) => onUpdate({ 
                dimensions: { ...formData.dimensions, width: e.target.value } 
              })}
              className={`w-full px-3 py-2 border rounded-md ${errors.width ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.width && <p className="mt-1 text-sm text-red-600">{errors.width}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (ft)</label>
            <input
              type="number"
              value={formData.dimensions.height}
              onChange={(e) => onUpdate({ 
                dimensions: { ...formData.dimensions, height: e.target.value } 
              })}
              className={`w-full px-3 py-2 border rounded-md ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Next: Materials
        </button>
      </div>
    </div>
  );
}