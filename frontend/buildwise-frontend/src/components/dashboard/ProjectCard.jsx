// src/components/dashboard/ProjectCard.jsx
import { motion } from 'framer-motion';
import { HardHat, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {project.name}
          </h3>
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {project.status || 'Active'}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{project.location || 'Location not specified'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Started {formatDate(project.startDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4 flex-shrink-0" />
            <span>Estimated: ${project.totalCost?.toLocaleString() || '0'}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HardHat className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {project.materials?.length || 0} material{project.materials?.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            View <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}