// src/components/dashboard/CostBreakdownChart.jsx
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { HardHat, DollarSign, Box, Users, TrendingUp, PieChart, BarChart2 } from 'lucide-react';

// Register all chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function CostBreakdownChart({ projects }) {
  const [activeTab, setActiveTab] = useState('breakdown');
  
  if (!projects || projects.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-500">No project data available to display charts</p>
      </div>
    );
  }

  // Calculate totals and averages
  const { totals, averages, byMonth } = projects.reduce((acc, project) => {
    // Totals
    acc.totals.materials += project.materialsCost || 0;
    acc.totals.labor += project.laborCost || 0;
    acc.totals.equipment += project.equipmentCost || 0;
    acc.totals.overhead += project.overheadCost || 0;
    
    // Averages
    acc.averages.materials += (project.materialsCost || 0) / projects.length;
    acc.averages.labor += (project.laborCost || 0) / projects.length;
    acc.averages.equipment += (project.equipmentCost || 0) / projects.length;
    acc.averages.overhead += (project.overheadCost || 0) / projects.length;
    
    // Group by month (simplified example)
    const month = new Date(project.createdAt || new Date()).getMonth();
    acc.byMonth[month] = acc.byMonth[month] || { materials: 0, labor: 0, equipment: 0, overhead: 0 };
    acc.byMonth[month].materials += project.materialsCost || 0;
    acc.byMonth[month].labor += project.laborCost || 0;
    acc.byMonth[month].equipment += project.equipmentCost || 0;
    acc.byMonth[month].overhead += project.overheadCost || 0;
    
    return acc;
  }, { 
    totals: { materials: 0, labor: 0, equipment: 0, overhead: 0 },
    averages: { materials: 0, labor: 0, equipment: 0, overhead: 0 },
    byMonth: Array(12).fill().map(() => ({ materials: 0, labor: 0, equipment: 0, overhead: 0 }))
  });

  const totalCost = Object.values(totals).reduce((sum, val) => sum + val, 0);

  // Chart data configurations
  const barData = {
    labels: ['Materials', 'Labor', 'Equipment', 'Overhead'],
    datasets: [
      {
        label: 'Total Cost',
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
      {
        label: 'Average Per Project',
        data: [averages.materials, averages.labor, averages.equipment, averages.overhead],
        backgroundColor: [
          'rgba(59, 130, 246, 0.4)',
          'rgba(16, 185, 129, 0.4)',
          'rgba(245, 158, 11, 0.4)',
          'rgba(139, 92, 246, 0.4)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderWidth: 1,
      }
    ],
  };

  const pieData = {
    labels: ['Materials', 'Labor', 'Equipment', 'Overhead'],
    datasets: [{
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
    }]
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Materials',
        data: byMonth.map(m => m.materials),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Labor',
        data: byMonth.map(m => m.labor),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Equipment',
        data: byMonth.map(m => m.equipment),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Overhead',
        data: byMonth.map(m => m.overhead),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label || ''}: $${context.raw.toLocaleString()}`;
          }
        }
      },
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

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const percentage = ((value / totalCost) * 100).toFixed(1);
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
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
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-500" />
          Project Cost Analytics
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${activeTab === 'breakdown' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <BarChart2 className="h-4 w-4" />
            Breakdown
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${activeTab === 'distribution' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <PieChart className="h-4 w-4" />
            Distribution
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${activeTab === 'trends' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <TrendingUp className="h-4 w-4" />
            Trends
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Box className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Materials</p>
                <p className="text-xl font-bold">${totals.materials.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {((totals.materials / totalCost) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Labor</p>
                <p className="text-xl font-bold">${totals.labor.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {((totals.labor / totalCost) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <HardHat className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Equipment & Overhead</p>
                <p className="text-xl font-bold">${(totals.equipment + totals.overhead).toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {(((totals.equipment + totals.overhead) / totalCost) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-96">
          {activeTab === 'breakdown' && (
            <div className="h-full">
              <Bar data={barData} options={chartOptions} />
            </div>
          )}
          {activeTab === 'distribution' && (
            <div className="h-full">
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
          {activeTab === 'trends' && (
            <div className="h-full">
              <Line data={lineData} options={chartOptions} />
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Cost Efficiency</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Labor vs Materials Ratio</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(totals.labor / (totals.labor + totals.materials)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {(totals.labor / (totals.labor + totals.materials) * 100).toFixed(1)}% Labor / 
                  {(totals.materials / (totals.labor + totals.materials) * 100).toFixed(1)}% Materials
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fixed vs Variable Costs</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${((totals.equipment + totals.overhead) / totalCost) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {(((totals.equipment + totals.overhead) / totalCost) * 100).toFixed(1)}% Fixed / 
                  {((1 - (totals.equipment + totals.overhead) / totalCost) * 100).toFixed(1)}% Variable
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Project Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-xl font-bold">{projects.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Project Cost</p>
                <p className="text-xl font-bold">${(totalCost / projects.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Highest Cost Area</p>
                <p className="text-xl font-bold">
                  {[
                    { name: 'Materials', value: totals.materials },
                    { name: 'Labor', value: totals.labor },
                    { name: 'Equipment', value: totals.equipment },
                    { name: 'Overhead', value: totals.overhead }
                  ].reduce((a, b) => a.value > b.value ? a : b).name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-xl font-bold">${totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}