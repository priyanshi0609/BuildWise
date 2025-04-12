import { motion } from 'framer-motion';
import { HardHat, Clock, DollarSign } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <HardHat className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {project.location || 'No location specified'}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-gray-400">
              <Clock className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 text-gray-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total cost</p>
              <p className="text-sm font-medium text-gray-900">
              ${project.totalCost?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}