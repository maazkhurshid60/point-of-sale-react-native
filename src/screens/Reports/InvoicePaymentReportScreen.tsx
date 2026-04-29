import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import ReportFilterSection from './components/ReportFilterSection';
import ReportMockChart from './components/ReportMockCharts';
import ReportStatusCard from './components/ReportStatusCard';
import { useInvoicePaymentReportController } from './hooks/useInvoicePaymentReportController';
import { styles } from './InvoicePaymentReportScreen.styles';

export const InvoicePaymentReportScreen: React.FC = () => {
  const {
    filters,
    isLoading,
    dummyData,
    setScreen,
    toggleTabs,
  } = useInvoicePaymentReportController();

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
          <Text style={styles.headerTitle}>Invoice Payments</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.filterWrapper}>
           <ReportFilterSection type="INVOICE" />
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Analytics in progress...</Text>
          </View>
        ) : (
          <View style={styles.reportContent}>
            <View style={styles.tabContainer}>
              <Pressable
                onPress={() => toggleTabs(true, false)}
                style={[styles.tab, filters.isChartsOpen && styles.activeTab]}
              >
                <FontAwesome6 
                  name="chart-column" 
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
                  name="receipt" 
                  size={14} 
                  color={filters.isSummaryOpen ? 'white' : COLORS.textSecondary} 
                  style={{ marginRight: 8 }} 
                />
                <Text style={[styles.tabText, filters.isSummaryOpen && styles.activeTabText]}>Summary</Text>
              </Pressable>
            </View>

            {filters.isChartsOpen && (
              <View style={styles.chartSection}>
                <View style={styles.statsGrid}>
                  <ReportStatusCard label="Total Collected" value="PKR 84k" icon="money-bill-trend-up" color={COLORS.success} />
                  <ReportStatusCard label="Pending" value="12 Invoices" icon="clock" color={COLORS.warning} />
                  <ReportStatusCard label="Refunds" value="PKR 1.5k" icon="arrow-rotate-left" color={COLORS.danger} />
                </View>

                <View style={styles.chartCard}>
                   <ReportMockChart title="Daily Collection Summary" data={dummyData} type="bar" color={COLORS.success} />
                </View>
              </View>
            )}

            {filters.isSummaryOpen && (
              <View style={styles.summarySection}>
                <View style={styles.tableCard}>
                    <View style={styles.tableCardHeader}>
                        <Text style={styles.tableCardTitle}>Recent Payment Activity</Text>
                    </View>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerCell, { flex: 1.5 }]}>Invoice ID</Text>
                        <Text style={[styles.headerCell, { flex: 2 }]}>Customer</Text>
                        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
                    </View>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <View key={i} style={styles.tableRow}>
                            <View style={{ flex: 1.5 }}>
                                <Text style={styles.cellMainText}>INV-00{i}</Text>
                                <Text style={styles.cellSubText}>ID: 4092{i}</Text>
                            </View>
                            <Text style={[styles.cellText, { flex: 2 }]}>Customer Premium #{i}</Text>
                            <Text style={[styles.cellAmountText, { flex: 1.5, textAlign: 'right' }]}>PKR 1,200</Text>
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

export default InvoicePaymentReportScreen;
