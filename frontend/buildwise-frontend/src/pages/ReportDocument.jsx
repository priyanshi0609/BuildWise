import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../assets/buildwise-logo.png';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3B82F6',
    paddingBottom: 10
  },
  logo: {
    width: 120,
    height: 40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    fontSize: 12,
    color: '#6B7280'
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginTop: 10
  },
  table: {
    width: '100%',
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 5
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  col1: {
    width: '50%'
  },
  col2: {
    width: '20%',
    textAlign: 'right'
  },
  col3: {
    width: '30%',
    textAlign: 'right'
  }
});

export default function ReportDocument({ project, preview = false }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateMaterialCost = (material) => {
    return material.quantity * material.costPerUnit;
  };

  const totalMaterialsCost = project.materials.reduce(
    (sum, material) => sum + calculateMaterialCost(material), 0
  );

  const laborCost = project.laborHours * 50; // Assuming $50/hour
  const overhead = (totalMaterialsCost + laborCost) * 0.2;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <Text>Generated on: {formatDate(new Date())}</Text>
        </View>

        <Text style={styles.title}>{project.name} - Cost Report</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{project.location}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{formatDate(project.startDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{project.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dimensions</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Length:</Text>
            <Text style={styles.value}>{project.dimensions.length} ft</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Width:</Text>
            <Text style={styles.value}>{project.dimensions.width} ft</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Height:</Text>
            <Text style={styles.value}>{project.dimensions.height} ft</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materials</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.col1, { fontWeight: 'bold' }]}>Material</Text>
              <Text style={[styles.col2, { fontWeight: 'bold' }]}>Quantity</Text>
              <Text style={[styles.col3, { fontWeight: 'bold' }]}>Cost</Text>
            </View>
            {project.materials.map((material, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{material.name}</Text>
                <Text style={styles.col2}>
                  {material.quantity} {material.unit}
                </Text>
                <Text style={styles.col3}>
                  ${calculateMaterialCost(material).toLocaleString()}
                </Text>
              </View>
            ))}
            <View style={[styles.tableRow, { backgroundColor: '#F3F4F6' }]}>
              <Text style={[styles.col1, { fontWeight: 'bold' }]}>Total Materials</Text>
              <Text style={styles.col2}></Text>
              <Text style={[styles.col3, { fontWeight: 'bold' }]}>
                ${totalMaterialsCost.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Materials:</Text>
            <Text style={styles.value}>${totalMaterialsCost.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Labor ({project.laborHours} hours):</Text>
            <Text style={styles.value}>${laborCost.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Overhead (20%):</Text>
            <Text style={styles.value}>${overhead.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.total}>Total Project Cost:</Text>
            <Text style={[styles.value, styles.total]}>
              ${project.totalCost.toLocaleString()}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  return preview ? doc : <>{doc}</>;
}