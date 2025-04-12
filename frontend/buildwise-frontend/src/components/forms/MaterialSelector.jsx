import { useState } from 'react';

const materialOptions = [
  { id: 'concrete', name: 'Concrete', costPerUnit: 120, unit: 'cubic yard' },
  { id: 'steel', name: 'Steel', costPerUnit: 200, unit: 'ton' },
  { id: 'lumber', name: 'Lumber', costPerUnit: 5, unit: 'board foot' },
  { id: 'brick', name: 'Brick', costPerUnit: 0.75, unit: 'piece' },
  { id: 'drywall', name: 'Drywall', costPerUnit: 15, unit: 'sheet' },
  { id: 'roofing', name: 'Roofing', costPerUnit: 2.5, unit: 'square foot' },
];

export default function MaterialSelector({ selectedMaterials, onUpdate, onBack, onNext }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState(
    selectedMaterials.reduce((acc, mat) => ({ ...acc, [mat.id]: mat.quantity }), {})
  );

  const filteredMaterials = materialOptions.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuantityChange = (materialId, quantity) => {
    setQuantities({ ...quantities, [materialId]: parseInt(quantity) || 0 });
  };

  const handleMaterialToggle = (material) => {
    const isSelected = selectedMaterials.some(m => m.id === material.id);
    if (isSelected) {
      onUpdate(selectedMaterials.filter(m => m.id !== material.id));
    } else {
      onUpdate([...selectedMaterials, { ...material, quantity: quantities[material.id] || 1 }]);
    }
  };

  const handleNext = () => {
    // Update quantities before proceeding
    const updatedMaterials = selectedMaterials.map(material => ({
      ...material,
      quantity: quantities[material.id] || 1
    }));
    onUpdate(updatedMaterials);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Select Materials</h3>
      
      <div>
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        />
      </div>

      <div className="space-y-4">
        {filteredMaterials.map((material) => {
          const isSelected = selectedMaterials.some(m => m.id === material.id);
          return (
            <div 
              key={material.id}
              className={`p-4 border rounded-md ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleMaterialToggle(material)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <div>
                    <p className="font-medium">{material.name}</p>
                    <p className="text-sm text-gray-500">${material.costPerUnit} per {material.unit}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={quantities[material.id] || 1}
                      onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right"
                    />
                    <span className="text-sm text-gray-500">{material.unit}s</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Next: Review
        </button>
      </div>
    </div>
  );
}