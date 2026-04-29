import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import ReportFilterSection from './components/ReportFilterSection';
import ReportMockChart from './components/ReportMockCharts';
import ReportStatusCard from './components/ReportStatusCard';
import { useProductReportController } from './hooks/useProductReportController';
import { styles } from './ProductReportScreen.styles';

export const ProductReportScreen: React.FC = () => {
  const {
    filters,
    isLoading,
    dummySalesData,
    setScreen,
    toggleTabs,
  } = useProductReportController();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => setScreen('REPORTS_MENU')}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Products Report</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.filterWrapper}>
           <ReportFilterSection type="PRODUCT" />
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Fetching analytics...</Text>
          </View>
        ) : (
          <View style={styles.reportContent}>
            <View style={styles.tabContainer}>
              <Pressable
                onPress={() => toggleTabs(true, false)}
                style={[styles.tab, filters.isChartsOpen && styles.activeTab]}
              >
                <FontAwesome6 
                  name="chart-pie" 
                  size={14} 
                  color={filters.isChartsOpen ? 'white' : COLORS.textSecondary} 
                  style={{ marginRight: 8 }} 
                />
                <Text style={[styles.tabText, filters.isChartsOpen && styles.activeTabText]}>Charts</Text>
              </Pressable>
              <Pressable
                onPress={() => toggleTabs(false, true)}
                style={[styles.tab, filters.isSummaryOpen && styles.activeTab]}
              >
                <FontAwesome6 
                  name="list-check" 
                  size={14} 
                  color={filters.isSummaryOpen ? 'white' : COLORS.textSecondary} 
                  style={{ marginRight: 8 }} 
                />
                <Text style={[styles.tabText, filters.isSummaryOpen && styles.activeTabText]}>Summary</Text>
              </Pressable>
            </View>

            {filters.isChartsOpen && (
              <View style={styles.chartSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Performance Overview</Text>
                </View>
                
                <View style={styles.statsGrid}>
                  <ReportStatusCard label="Total Sold" value="49 Units" icon="box" color={COLORS.primary} />
                  <ReportStatusCard label="Revenue" value="PKR 49k" icon="receipt" color={COLORS.success} />
                  <ReportStatusCard label="Gross Profit" value="PKR 12k" icon="chart-line" color="#8B5CF6" />
                  <ReportStatusCard label="Total Disc." value="PKR 1.2k" icon="tag" color={COLORS.danger} />
                </View>

                <View style={styles.chartCard}>
                   <ReportMockChart title="Sales Trend (Monthly)" data={dummySalesData} type="line" color={COLORS.primary} />
                </View>
                <View style={styles.chartCard}>
                   <ReportMockChart title="Category Distribution" data={dummySalesData} type="bar" color={COLORS.warning} />
                </View>
              </View>
            )}

            {filters.isSummaryOpen && (
              <View style={styles.summarySection}>
                <View style={styles.tableCard}>
                  <View style={styles.tableCardHeader}>
                    <Text style={styles.tableCardTitle}>Data Summary</Text>
                  </View>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Product Name</Text>
                    <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Qty</Text>
                    <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
                  </View>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <View key={i} style={styles.tableRow}>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.cellMainText} numberOfLines={1}>Premium Item #{i}</Text>
                        <Text style={styles.cellSubText}>ID: 5042{i}</Text>
                      </View>
                      <Text style={[styles.cellText, { flex: 1, textAlign: 'center' }]}>{10 * i}</Text>
                      <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                        <Text style={styles.cellAmountText}>PKR {(500 * i).toLocaleString()}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProductReportScreen;
