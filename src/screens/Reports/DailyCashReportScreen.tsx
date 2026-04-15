import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

const DailyCashReportScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const setScreen = useUIStore((state) => state.setScreen);

  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('summary');

  const fetchDailyCashReports = useAuthStore((state) => state.fetchDailyCashReports);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchDailyCashReports();
    setReportData(data);
    setIsLoading(false);
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: 'file-invoice-dollar' },
    { id: 'bank', label: 'Bank', icon: 'building-columns' },
    { id: 'cash', label: 'Cash', icon: 'money-bill-1' },
    { id: 'return', label: 'Return', icon: 'arrow-rotate-left' },
    { id: 'supplier', label: 'Supplier', icon: 'truck-field' },
    { id: 'division', label: 'Division', icon: 'layer-group' },
  ];

  const renderHeader = () => {
    const resultData = reportData?.result || {};
    return (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => setScreen('REPORTS_MENU')}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Daily Cash Report</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
            <FontAwesome6 name="rotate" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.statsGrid, !isTablet && styles.statsGridMobile]}>
          <View style={styles.headerStatCard}>
            <Text style={styles.headerStatLabel}>Opening Balance</Text>
            <Text style={styles.headerStatValue}>PKR {parseFloat(resultData.open_amount || 0).toLocaleString()}</Text>
          </View>
          <View style={[styles.headerStatCard, { backgroundColor: COLORS.primary }]}>
            <Text style={[styles.headerStatLabel, { color: 'rgba(255,255,255,0.7)' }]}>Closing Cash</Text>
            <Text style={[styles.headerStatValue, { color: 'white' }]}>PKR {parseFloat(resultData.closing_balance || 0).toLocaleString()}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              styles.tabItem,
              activeTab === tab.id && styles.activeTabItem
            ]}
          >
            <FontAwesome6
              name={tab.icon}
              size={12}
              color={activeTab === tab.id ? 'white' : COLORS.textSecondary}
            />
            <Text style={[
              styles.tabLabel,
              activeTab === tab.id && styles.activeTabLabel
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Auditing ledgers...</Text>
        </View>
      );
    }

    if (!reportData) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome6 name="circle-exclamation" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No financial data recorded for today.</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'summary':
        return renderSummaryTable();
      case 'bank':
        return renderSimpleTable(reportData.result?.income_bank || [], ['Account', 'Description', 'Amount']);
      case 'cash':
        return renderSimpleTable(reportData.result?.income_cash || [], ['Account', 'Description', 'Amount']);
      case 'return':
        return renderSimpleTable(reportData.result?.return || [], ['ID', 'Customer', 'Amount']);
      case 'supplier':
        return renderSimpleTable(reportData.result?.supplier_payment || [], ['ID', 'Supplier', 'Amount']);
      default:
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Module under development.</Text>
          </View>
        );
    }
  };

  const renderSummaryTable = () => {
    const detailsObj = reportData.DetailsReport || {};
    const detailsEntries = Object.entries(detailsObj);

    return (
      <View style={styles.tableCard}>
        <View style={styles.tableCardHeader}>
            <Text style={styles.tableCardTitle}>Balance Summary</Text>
        </View>
        {detailsEntries.length > 0 ? detailsEntries.map(([key, value], idx: number) => (
            <View key={idx} style={[styles.reportRow, idx === detailsEntries.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={styles.reportKey}>{key.replace(/_/g, ' ')}</Text>
                <Text style={styles.reportValue}>
                    {typeof value === 'number' ? `PKR ${value.toLocaleString()}` : String(value)}
                </Text>
            </View>
        )) : (
            <Text style={styles.emptyInternalText}>No detailed entries found.</Text>
        )}
      </View>
    );
  };

  const renderSimpleTable = (data: any[], headers: string[]) => (
    <View style={styles.tableCard}>
      <View style={styles.tableHeader}>
        {headers.map((h, i) => (
          <Text key={i} style={[styles.headerCell, { flex: 1, textAlign: i === headers.length - 1 ? 'right' : 'left' }]}>{h}</Text>
        ))}
      </View>
      {data.length > 0 ? data.map((item, idx) => (
        <View key={idx} style={styles.tableRow}>
            <Text style={[styles.cellMainText, { flex: 1 }]}>{item.account || item.id || idx + 1}</Text>
            <Text style={[styles.cellSubText, { flex: 1 }]}>{item.description || item.customer_name || item.supplier_name || '---'}</Text>
            <Text style={[styles.cellAmountText, { flex: 1, textAlign: 'right' }]}>PKR {item.amount?.toLocaleString() || '0'}</Text>
        </View>
      )) : (
        <Text style={styles.emptyInternalText}>No records found in this category.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderTabs()}
        <View style={styles.contentWrapper}>
          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 18, color: '#1A202C' },
  refreshBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  
  statsGrid: { flexDirection: 'row', gap: 15 },
  statsGridMobile: { flexWrap: 'wrap' },
  headerStatCard: { flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  headerStatLabel: { ...TYPOGRAPHY.montserrat.medium, fontSize: 11, color: '#64748B', marginBottom: 4 },
  headerStatValue: { ...TYPOGRAPHY.montserrat.bold, fontSize: 15, color: '#1E293B' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 },
  tabContainer: { marginBottom: 20 },
  tabScroll: { gap: 10 },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 8, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  activeTabItem: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, elevation: 4, shadowColor: COLORS.primary, shadowOpacity: 0.2 },
  tabLabel: { ...TYPOGRAPHY.montserrat.bold, fontSize: 13, color: '#64748B' },
  activeTabLabel: { color: 'white' },

  contentWrapper: { flex: 1 },
  tableCard: { backgroundColor: 'white', borderRadius: 24, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, borderWidth: 1, borderColor: '#F1F5F9' },
  tableCardHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tableCardTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 16, color: '#1E293B' },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#F8FAFC' },
  headerCell: { ...TYPOGRAPHY.montserrat.bold, fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', alignItems: 'center' },
  reportRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  reportKey: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#64748B', textTransform: 'capitalize' },
  reportValue: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#1E293B' },
  cellMainText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#1E293B' },
  cellSubText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 12, color: '#94A3B8' },
  cellAmountText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: COLORS.primary },

  loaderContainer: { marginTop: 60, alignItems: 'center' },
  loaderText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 13, color: COLORS.textSecondary, marginTop: 10 },
  emptyContainer: { marginTop: 60, alignItems: 'center', padding: 40 },
  emptyText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 15 },
  emptyInternalText: { padding: 30, textAlign: 'center', color: '#94A3B8', ...TYPOGRAPHY.montserrat.medium },
});

export default DailyCashReportScreen;
