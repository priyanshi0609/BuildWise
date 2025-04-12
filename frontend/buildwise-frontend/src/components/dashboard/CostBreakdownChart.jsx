// src/components/dashboard/CostBreakdownChart.jsx
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CostBreakdownChart({ projects }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  // Calculate totals across all projects
  const totals = projects.reduce((acc, project) => {
    return {
      materials: acc.materials + (project.materialsCost || 0),
      labor: acc.labor + (project.laborCost || 0),
      equipment: acc.equipment + (project.equipmentCost || 0),
      overhead: acc.overhead + (project.overheadCost || 0),
    };
  }, { materials: 0, labor: 0, equipment: 0, overhead: 0 });

  const data = {
    labels: ['Materials', 'Labor', 'Equipment', 'Overhead'],
    datasets: [
      {
        label: 'Cost Breakdown',
        data: [totals.materials, totals.labor, totals.equipment, totals.overhead],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `$${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Bar data={data} options={options} />
    </motion.div>
  );
}