import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useReportStore } from '../../store/useReportStore';
import ReportFilterSection from './components/ReportFilterSection';
import ReportMockChart from './components/ReportMockCharts';
import ReportStatusCard from './components/ReportStatusCard';

/**
 * PRODUCT REPORT SCREEN
 * Implementation of Products Report with Charts and Summary.
 */
const ProductReportScreen: React.FC = () => {
  const store = useReportStore();
  const filters = store.reports['PRODUCT'];
  const isLoading = store.isLoading['PRODUCT'];

  useEffect(() => {
    // Initial data fetch
    store.fetchReportData('PRODUCT');
  }, []);

  const dummySalesData = [
    { label: 'Jan', value: 35 },
    { label: 'Feb', value: 28 },
    { label: 'Mar', value: 34 },
    { label: 'Apr', value: 32 },
    { label: 'May', value: 40 }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.breadcrumb}>Dashboard / Reports / <Text style={{ color: COLORS.primary }}>Products</Text></Text>
        <Text style={styles.title}>Products Report (Activated)</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ReportFilterSection type="PRODUCT" />

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* TABS FOR CHARTS AND SUMMARY */}
            <View style={styles.tabContainer}>
              <Pressable
                onPress={() => store.toggleTabs('PRODUCT', true, false)}
                style={[styles.tab, filters.isChartsOpen && styles.activeTab]}
              >
                <Text style={[styles.tabText, filters.isChartsOpen && styles.activeTabText]}>Chart</Text>
              </Pressable>
              <Pressable
                onPress={() => store.toggleTabs('PRODUCT', false, true)}
                style={[styles.tab, filters.isSummaryOpen && styles.activeTab]}
              >
                <Text style={[styles.tabText, filters.isSummaryOpen && styles.activeTabText]}>Summary</Text>
              </Pressable>
            </View>

            {/* CHARTS VIEW */}
            {filters.isChartsOpen && (
              <View style={styles.chartSection}>
                <View style={styles.statsGrid}>
                  <ReportStatusCard label="Quantity Sold" value="49" icon="box" color="#2196F3" />
                  <ReportStatusCard label="Total Sales" value="$49,000" icon="dollar-sign" color="#4CAF50" />
                  <ReportStatusCard label="Profit" value="$12,500" icon="chart-line" color="#9C27B0" />
                  <ReportStatusCard label="Discount" value="$1,200" icon="tags" color="#FF9800" />
                </View>

                <ReportMockChart title="Monthly Sales Trend" data={dummySalesData} type="line" color={COLORS.primary} />
                <ReportMockChart title="Category Wise Selling" data={dummySalesData} type="bar" color={COLORS.posYellow} />
              </View>
            )}

            {/* SUMMARY VIEW */}
            {filters.isSummaryOpen && (
              <View style={styles.summarySection}>
                <View style={styles.tableCard}>
                  <Text style={styles.sectionTitle}>Data Summary</Text>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Product</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Qty</Text>
                    <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
                  </View>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.cellText, { flex: 2 }]} numberOfLines={1}>Product Item #{i}</Text>
                      <Text style={[styles.cellText, { flex: 1 }]}>{10 * i}</Text>
                      <Text style={[styles.cellText, { flex: 1.5, textAlign: 'right', fontWeight: 'bold' }]}>${(500 * i).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  scrollContent: { paddingBottom: 40 },
  header: { marginBottom: 20 },
  breadcrumb: { ...TYPOGRAPHY.montserrat.medium, fontSize: 12, color: COLORS.greyText },
  title: { ...TYPOGRAPHY.montserrat.bold, fontSize: 24, color: COLORS.black, marginTop: 4 },
  tabContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e9ecef' },
  activeTab: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: COLORS.greyText },
  activeTabText: { color: '#fff' },
  chartSection: { gap: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4 },
  summarySection: { gap: 16 },
  tableCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#f1f3f5' },
  sectionTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 16, color: COLORS.black, marginBottom: 16 },
  tableHeader: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  headerCell: { ...TYPOGRAPHY.montserrat.bold, fontSize: 13, color: COLORS.greyText },
  tableRow: { flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f8f9fa', alignItems: 'center' },
  cellText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 13, color: '#495057' },
});

export default ProductReportScreen;
