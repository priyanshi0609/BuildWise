import { useEffect, useState } from 'react';
import { Clock, FileText, Edit, CheckCircle } from 'lucide-react';
import { getRecentActivity } from '../../services/api'; // Adjust the import path as necessary

export default function RecentActivity({ userId }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivity(userId);
        console.log('Fetched activity data:', data); // Debugging line

        // Check if the response is an array or has an "activities" array
        if (Array.isArray(data)) {
          setActivities(data);
        } else if (Array.isArray(data?.activities)) {
          setActivities(data.activities);
        } else {
          setActivities([]); // fallback to empty array
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setActivities([]); // fallback to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'created':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'updated':
        return <Edit className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading activities...</div>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <li key={activity.id || index}>
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-800">
                      {activity.message}{' '}
                      <span className="font-medium text-gray-900">
                        {activity.projectName}
                      </span>
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={activity.timestamp}>
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
