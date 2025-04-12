// src/pages/ReportDocument.jsx
import { HardHat, MapPin, Clock, DollarSign, Box, Users } from 'lucide-react';

export default function ReportDocument({ project }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8 print:space-y-6">
      {/* Project Overview */}
      <div className="border-b pb-6 print:pb-4">
        <h2 className="text-xl font-bold mb-4 print:text-lg">Project Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          <div className="flex items-start gap-3">
            <HardHat className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0 print:text-black" />
            <div>
              <h3 className="font-medium">Project Name</h3>
              <p>{project.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0 print:text-black" />
            <div>
              <h3 className="font-medium">Location</h3>
              <p>{project.location || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0 print:text-black" />
            <div>
              <h3 className="font-medium">Start Date</h3>
              <p>{formatDate(project.startDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0 print:text-black" />
            <div>
              <h3 className="font-medium">Total Estimated Cost</h3>
              <p>${project.totalCost?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="border-b pb-6 print:pb-4">
        <h2 className="text-xl font-bold mb-4 print:text-lg">Cost Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
          <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <Box className="h-4 w-4 text-blue-600 print:text-black" />
              Materials
            </h3>
            <p className="text-2xl font-bold">
              ${project.materialsCost?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600 print:text-black" />
              Labor
            </h3>
            <p className="text-2xl font-bold">
              ${project.laborCost?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {project.laborHours || '0'} hours @ ${project.laborCostPerHour?.toLocaleString() || '0'}/hr
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border">
            <h3 className="font-medium mb-2">Equipment</h3>
            <p className="text-2xl font-bold">
              ${project.equipmentCost?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border">
            <h3 className="font-medium mb-2">Overhead</h3>
            <p className="text-2xl font-bold">
              ${project.overheadCost?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="border-b pb-6 print:pb-4">
        <h2 className="text-xl font-bold mb-4 print:text-lg">Materials</h2>
        {project.materials?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 print:bg-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
  {project.materials.map((material, index) => (
    <tr key={index}>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
        {material.name}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {material.quantity} {material.unit}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        ${Number(material.price || 0).toLocaleString()}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        ${Number((material.price || 0) * (material.quantity || 0)).toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        ) : (
          <p className="text-gray-500">No materials selected</p>
        )}
      </div>

      {/* Project Details */}
      <div>
        <h2 className="text-xl font-bold mb-4 print:text-lg">Project Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Dimensions</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 p-3 rounded-lg print:bg-white print:border">
                <p className="text-sm text-gray-500">Length</p>
                <p className="font-medium">{project.dimensions?.length || '0'} m</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg print:bg-white print:border">
                <p className="text-sm text-gray-500">Width</p>
                <p className="font-medium">{project.dimensions?.width || '0'} m</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg print:bg-white print:border">
                <p className="text-sm text-gray-500">Height</p>
                <p className="font-medium">{project.dimensions?.height || '0'} m</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border">
              <p className="whitespace-pre-line">
                {project.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 text-center text-sm text-gray-500 print:pt-4">
        <p>Report generated on {new Date().toLocaleDateString()}</p>
        <p className="mt-1">BuildWise Construction Cost Estimator</p>
      </div>
    </div>
  );
}