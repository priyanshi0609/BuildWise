// src/components/forms/ProjectForm.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Ruler, Calendar, Users, DollarSign, ArrowRight } from 'lucide-react';

export default function ProjectForm({ formData, onUpdate, onNext }) {
  const [localData, setLocalData] = useState({
    name: formData.name || '',
    location: formData.location || '',
    dimensions: formData.dimensions || { length: '', width: '', height: '' },
    laborHours: formData.laborHours || 0,
    laborCostPerHour: formData.laborCostPerHour || 50,
    equipmentCost: formData.equipmentCost || 0,
    overheadCost: formData.overheadCost || 0,
    startDate: formData.startDate || new Date().toISOString().split('T')[0],
    description: formData.description || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(localData);
    onNext();
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={localData.name}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="My Construction Project"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={localData.location}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="123 Main St, City"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <Ruler className="h-4 w-4" />
          Dimensions (in meters)
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <input
              type="number"
              name="length"
              value={localData.dimensions.length}
              onChange={handleDimensionChange}
              min="0"
              step="0.1"
              placeholder="Length"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>
          <div>
            <input
              type="number"
              name="width"
              value={localData.dimensions.width}
              onChange={handleDimensionChange}
              min="0"
              step="0.1"
              placeholder="Width"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>
          <div>
            <input
              type="number"
              name="height"
              value={localData.dimensions.height}
              onChange={handleDimensionChange}
              min="0"
              step="0.1"
              placeholder="Height"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={localData.startDate}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="laborHours" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Estimated Labor Hours
          </label>
          <input
            type="number"
            id="laborHours"
            name="laborHours"
            value={localData.laborHours}
            onChange={handleChange}
            min="0"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        <div>
          <label htmlFor="laborCostPerHour" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Labor Cost/Hour ($)
          </label>
          <input
            type="number"
            id="laborCostPerHour"
            name="laborCostPerHour"
            value={localData.laborCostPerHour}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="equipmentCost" className="block text-sm font-medium text-gray-700 mb-1">
            Equipment Cost ($)
          </label>
          <input
            type="number"
            id="equipmentCost"
            name="equipmentCost"
            value={localData.equipmentCost}
            onChange={handleChange}
            min="0"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        <div>
          <label htmlFor="overheadCost" className="block text-sm font-medium text-gray-700 mb-1">
            Overhead Cost ($)
          </label>
          <input
            type="number"
            id="overheadCost"
            name="overheadCost"
            value={localData.overheadCost}
            onChange={handleChange}
            min="0"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={localData.description}
          onChange={handleChange}
          rows="3"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="Additional details about the project..."
        ></textarea>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          Next: Select Materials <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.form>
  );
}