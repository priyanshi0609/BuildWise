// src/components/dashboard/RecentActivity.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, HardHat, FileText, DollarSign, PlusCircle, AlertCircle } from 'lucide-react';
import { getRecentActivity } from '../../services/api';

const activityIcons = {
  project_created: <HardHat className="h-4 w-4 text-blue-500" />,
  estimate_created: <FileText className="h-4 w-4 text-green-500" />,
  cost_updated: <DollarSign className="h-4 w-4 text-amber-500" />,
  default: <PlusCircle className="h-4 w-4 text-gray-500" />
};

const activityColors = {
  project_created: 'bg-blue-50 text-blue-700',
  estimate_created: 'bg-green-50 text-green-700',
  cost_updated: 'bg-amber-50 text-amber-700',
  default: 'bg-gray-50 text-gray-700'
};

export default function RecentActivity({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const recentActivities = await getRecentActivity(userId);
        setActivities(recentActivities || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message || 'Failed to load recent activity');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchActivities();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-start gap-2">
//         <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
//         <div>
//           <p className="font-medium">Error loading activity</p>
//           {/* <p className="text-sm">{error}</p> */}
//         </div>
//       </div>
//     );
//   }

  if (!activities || activities.length === 0) {
    return (
      <div className="p-4 bg-gray-50 text-gray-500 rounded-md text-center">
        No recent activity found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id || index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-3 rounded-md flex items-start gap-3 ${activityColors[activity.type] || activityColors.default}`}
        >
          <div className="mt-0.5">
            {activityIcons[activity.type] || activityIcons.default}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.message || 'Activity'}</p>
            {activity.details && (
              <p className="text-xs mt-1 opacity-80">{activity.details}</p>
            )}
          </div>
          <div className="text-xs opacity-70 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(activity.timestamp)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}