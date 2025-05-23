// src/pages/PdfDocument.jsx
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register ChartJS components
ChartJS.register(BarElement, CategoryScale, LinearScale);

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '1px solid #0d47a1',
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0d47a1',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: '1px solid #eee',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0d47a1',
    borderBottom: '1px solid #0d47a1',
    paddingBottom: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 10,
  },
  label: {
    fontWeight: 'bold',
    width: '40%',
  },
  value: {
    width: '60%',
    textAlign: 'right',
  },
  costHighlight: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0d47a1',
    color: 'white',
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    fontSize: 9,
    borderBottom: '1px solid #eee',
  },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'right' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '15%', textAlign: 'right' },
  chartContainer: {
    width: '100%',
    height: 150,
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
    borderTop: '1px solid #eee',
    paddingTop: 5,
  },
  optimizationNote: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 3,
    marginTop: 10,
    fontSize: 9,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
    alignSelf: 'center',
  }
});

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function PdfDocument({ project }) {
  // Calculate cost breakdown
  const materialsCost = project.materials?.reduce((sum, mat) => sum + (mat.price * mat.quantity), 0) || 0;
  const laborCost = (project.laborHours || 0) * (project.laborCostPerHour || 0);
  const equipmentCost = project.equipmentCost || 0;
  const overheadCost = project.overheadCost || 0;
  const totalCost = materialsCost + laborCost + equipmentCost + overheadCost;

  // Chart data for cost breakdown
  const chartData = {
    labels: ['Materials', 'Labor', 'Equipment', 'Overhead'],
    datasets: [{
      data: [materialsCost, laborCost, equipmentCost, overheadCost],
      backgroundColor: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
    }]
  };

  // Chart configuration
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ₹' + context.raw.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* In a real implementation, you would use an actual logo image */}
          <View style={styles.logo}>
            <Text style={{...styles.title, marginBottom: 0}}>BuildWise</Text>
          </View>
          <Text style={styles.title}>Project report generated by BuildWise</Text>
          <Text style={styles.title}>{project.name} - Construction Cost Report</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
          <Text style={styles.subtitle}>Project ID: {project.id || 'N/A'}</Text>
        </View>

        {/* Project Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Overview</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Project Name:</Text>
            <Text style={styles.value}>{project.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{project.location || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{project.description || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{project.status ? project.status.replace('_', ' ') : 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{project.startDate || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Duration:</Text>
            <Text style={styles.value}>{project.duration || 'N/A'} days</Text>
          </View>
        </View>

        {/* Cost Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost Summary</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Total Estimated Cost:</Text>
            <Text style={{...styles.value, ...styles.costHighlight}}>{formatCurrency(totalCost)}</Text>
          </View>
          
          {/* Cost Breakdown Chart - Note: In actual implementation, you'd need to render this as an image */}
          <View style={styles.chartContainer}>
            <Text>Cost Breakdown Visualization</Text>
            {/* In a real implementation, you would render the chart as an image */}
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Materials Cost:</Text>
            <Text style={styles.value}>{formatCurrency(materialsCost)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Labor Cost:</Text>
            <Text style={styles.value}>{formatCurrency(laborCost)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Equipment Cost:</Text>
            <Text style={styles.value}>{formatCurrency(equipmentCost)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Overhead Cost:</Text>
            <Text style={styles.value}>{formatCurrency(overheadCost)}</Text>
          </View>
        </View>

        {/* Materials Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materials Breakdown</Text>
          
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Material</Text>
            <Text style={styles.col2}>Quantity</Text>
            <Text style={styles.col3}>Unit Price</Text>
            <Text style={styles.col4}>Total Cost</Text>
            <Text style={styles.col5}>% of Total</Text>
          </View>
          
          {project.materials?.map((material, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{material.name}</Text>
              <Text style={styles.col2}>{material.quantity} {material.unit}</Text>
              <Text style={styles.col3}>{formatCurrency(material.price)}</Text>
              <Text style={styles.col4}>{formatCurrency(material.price * material.quantity)}</Text>
              <Text style={styles.col5}>
                {((material.price * material.quantity / totalCost) * 100).toFixed(1)}%
              </Text>
            </View>
          )) || <Text style={{padding: 5, fontSize: 9}}>No materials data available</Text>}
          
          <View style={{...styles.tableRow, backgroundColor: '#f5f5f5'}}>
            <Text style={styles.col1}>Total Materials Cost</Text>
            <Text style={{...styles.col4, fontWeight: 'bold'}}>{formatCurrency(materialsCost)}</Text>
            <Text style={{...styles.col5, fontWeight: 'bold'}}>
              {((materialsCost / totalCost) * 100).toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Labor Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labor Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Labor Hours:</Text>
            <Text style={styles.value}>{project.laborHours || 0} hours</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Labor Cost Per Hour:</Text>
            <Text style={styles.value}>{formatCurrency(project.laborCostPerHour || 0)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Labor Cost:</Text>
            <Text style={{...styles.value, ...styles.costHighlight}}>{formatCurrency(laborCost)}</Text>
          </View>
        </View>

        {/* Optimization Recommendations */}
        {project.optimizationSavings && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optimization Recommendations</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Potential Savings:</Text>
              <Text style={{...styles.value, color: '#34A853'}}>
                {formatCurrency(project.optimizationSavings)} ({((project.optimizationSavings / totalCost) * 100).toFixed(1)}%)
              </Text>
            </View>
            
            {project.optimizedMaterials?.map((rec, index) => (
              <View key={index} style={{marginBottom: 5}}>
                <Text style={{fontSize: 9, fontWeight: 'bold'}}>
                  {rec.name} - Savings: {formatCurrency(rec.savings * rec.quantity)}
                </Text>
                <Text style={{fontSize: 8}}>Recommendation: {rec.reason}</Text>
              </View>
            ))}
            
            <View style={styles.optimizationNote}>
              <Text>Note: These recommendations are based on cost optimization analysis. 
              Please consult with your project engineer before implementing changes.</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This report was generated automatically by BuildWise Construction Cost Estimator</Text>
          <Text>For questions or support, contact arshtiwari12345@gmail.com</Text>
          <Text>Confidential - For authorized use only</Text>
        </View>
      </Page>
    </Document>
  );
}