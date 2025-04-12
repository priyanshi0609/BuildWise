// src/components/forms/MaterialSelector.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, X, ArrowLeft, ArrowRight } from 'lucide-react';

// Sample material data - in a real app, this would come from an API
const MATERIALS = [
  { id: 1, name: 'Concrete', category: 'Foundation', price: 120, unit: 'cubic meter' },
  { id: 2, name: 'Steel Rebar', category: 'Reinforcement', price: 2.5, unit: 'meter' },
  { id: 3, name: 'Brick', category: 'Masonry', price: 0.5, unit: 'piece' },
  { id: 4, name: 'Wood Plank', category: 'Framing', price: 3.2, unit: 'meter' },
  { id: 5, name: 'Drywall', category: 'Interior', price: 15, unit: 'sheet' },
  { id: 6, name: 'Roof Shingles', category: 'Roofing', price: 1.8, unit: 'piece' },
  { id: 7, name: 'PVC Pipe', category: 'Plumbing', price: 2.1, unit: 'meter' },
  { id: 8, name: 'Electrical Wire', category: 'Electrical', price: 0.8, unit: 'meter' },
  { id: 9, name: 'Insulation', category: 'Insulation', price: 0.4, unit: 'square meter' },
  { id: 10, name: 'Paint', category: 'Finishing', price: 25, unit: 'gallon' },
];

export default function MaterialSelector({ selectedMaterials, onUpdate, onBack, onNext }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [localSelected, setLocalSelected] = useState(selectedMaterials || []);

  const categories = ['all', ...new Set(MATERIALS.map(m => m.category))];

  const filteredMaterials = MATERIALS.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         material.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddMaterial = (material) => {
    setLocalSelected(prev => {
      const existing = prev.find(m => m.id === material.id);
      if (existing) {
        return prev.map(m => 
          m.id === material.id ? { ...m, quantity: m.quantity + 1 } : m
        );
      }
      return [...prev, { ...material, quantity: 1 }];
    });
  };

  const handleRemoveMaterial = (materialId) => {
    setLocalSelected(prev => {
      const existing = prev.find(m => m.id === materialId);
      if (existing && existing.quantity > 1) {
        return prev.map(m => 
          m.id === materialId ? { ...m, quantity: m.quantity - 1 } : m
        );
      }
      return prev.filter(m => m.id !== materialId);
    });
  };

  const handleQuantityChange = (materialId, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    setLocalSelected(prev => 
      prev.map(m => m.id === materialId ? { ...m, quantity } : m)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(localSelected);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <h3 className="text-lg font-semibold">Select Materials</h3>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
              {filteredMaterials.map(material => (
                <div 
                  key={material.id} 
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{material.name}</h4>
                      <p className="text-sm text-gray-500">{material.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${material.price}/{material.unit}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddMaterial(material)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h4 className="font-medium mb-4">Selected Materials</h4>
          {localSelected.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No materials selected yet</p>
          ) : (
            <ul className="space-y-3 max-h-96 overflow-y-auto">
              {localSelected.map(material => (
                <li key={material.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{material.name}</h5>
                      <p className="text-sm text-gray-500">{material.category}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveMaterial(material.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveMaterial(material.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={material.quantity}
                        onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                        className="w-16 text-center border rounded p-1"
                      />
                      <button
                        onClick={() => handleAddMaterial(material)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-medium">
                      ${(material.price * material.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          Next: Review Project <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}