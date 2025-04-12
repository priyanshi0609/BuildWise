import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CostBreakdownChart({ projects = [] }) {
  // Safely aggregate data from all projects
  const data = {
    labels: ['Materials', 'Labor', 'Equipment', 'Overhead'],
    datasets: [
      {
        data: projects.reduce(
          (acc, project) => {
            const breakdown = project?.costBreakdown || {};
            return [
              acc[0] + (breakdown.materials || 0),
              acc[1] + (breakdown.labor || 0),
              acc[2] + (breakdown.equipment || 0),
              acc[3] + (breakdown.overhead || 0)
            ];
          }, 
          [0, 0, 0, 0]
        ),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#6366F1'
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="h-80">
      <Pie 
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const value = context.raw;
                  const percentage = Math.round((value / total) * 100);
                  return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                }
              }
            }
          }
        }}
      />
    </div>
  );
}