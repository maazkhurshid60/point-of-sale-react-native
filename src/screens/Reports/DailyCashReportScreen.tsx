import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

const DailyCashReportScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('summary'); // summary, bank, cash, return, supplier, division

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
          <View>
            <Text style={styles.breadcrumb}>Dashboard / <Text style={{ color: COLORS.primary }}>Reports</Text></Text>
            <Text style={styles.title}>Daily Cash Report</Text>
          </View>
          <Pressable style={styles.refreshBtn} onPress={loadData}>
            <FontAwesome6 name="rotate" size={16} color={COLORS.primary} />
          </Pressable>
        </View>

        <View style={[styles.statsGrid, !isTablet && styles.statsGridMobile]}>
          <View style={[styles.statCard, !isTablet && { flex: 1, minWidth: '45%' }]}>
            <Text style={styles.statLabel}>Opening Balance</Text>
            <Text style={styles.statValue}>{(resultData.open_amount)}</Text>
          </View>
          <View style={[styles.statCard, styles.primaryStatCard, !isTablet && { flex: 1, minWidth: '45%' }]}>
            <Text style={[styles.statLabel, { color: '#fff' }]}>Closing Cash</Text>
            <Text style={[styles.statValue, { color: '#fff' }]}>{(resultData.closing_balance)}</Text>
          </View>
          {!isTablet ? (
            <View style={[styles.statCard, { flex: 1, minWidth: '100%' }]}>
              <Text style={styles.statLabel}>Store / Cashier</Text>
              <Text style={styles.statValue} numberOfLines={1}>
                {resultData.store_name || '-'} • {resultData.user_name || '-'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Store</Text>
                <Text style={styles.statValue} numberOfLines={1}>{resultData.store_name || '-'}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Cashier</Text>
                <Text style={styles.statValue}>{resultData.user_name || '-'}</Text>
              </View>
            </>
          )}
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
              size={14}
              color={activeTab === tab.id ? COLORS.primary : COLORS.greyText}
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
          <Text style={styles.loaderText}>Loading report details...</Text>
        </View>
      );
    }

    if (!reportData) {
      return (
        <View style={styles.emptyContainer}>
          <FontAwesome6 name="circle-exclamation" size={48} color={COLORS.greyText} />
          <Text style={styles.emptyText}>No report data available</Text>
        </View>
      );
    }

    // Tab content logic
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
            <Text style={styles.emptyText}>Detailed data for {activeTab} coming soon...</Text>
          </View>
        );
    }
  };

  const renderSummaryTable = () => {
    const detailsObj = reportData.DetailsReport || {};
    const detailsEntries = Object.entries(detailsObj);

    return (
      <ScrollView style={styles.reportScroll}>
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Summary Details</Text>
          {detailsEntries.length > 0 ? detailsEntries.map(([key, value], idx: number) => (
            <View key={idx} style={styles.reportRow}>
              <Text style={styles.reportKey}>{key.replace(/_/g, ' ')}</Text>
              <Text style={styles.reportValue}>
                {typeof value === 'number' ? value.toFixed(2) : String(value)}
              </Text>
            </View>
          )) : (
            <Text style={styles.emptyInternalText}>No details available</Text>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderSimpleTable = (data: any[], headers: string[]) => (
    <View style={styles.simpleTable}>
      <View style={styles.simpleTableHeader}>
        {headers.map((h, i) => (
          <Text key={i} style={[styles.simpleHeaderCell, { flex: 1 }]}>{h}</Text>
        ))}
      </View>
      <ScrollView style={styles.tableBody}>
        {data.length > 0 ? data.map((item, idx) => (
          <View key={idx} style={styles.simpleTableRow}>
            {/* This is a naive mapping, real mapping depends on data keys */}
            <Text style={[styles.simpleCell, { flex: 1 }]}>{item.account || item.id || idx + 1}</Text>
            <Text style={[styles.simpleCell, { flex: 1 }]}>{item.description || item.customer_name || item.supplier_name || '---'}</Text>
            <Text style={[styles.simpleCell, styles.cellAmount, { flex: 1 }]}>${item.amount?.toFixed(2) || '0.00'}</Text>
          </View>
        )) : (
          <Text style={styles.emptyInternalText}>No records found</Text>
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <View style={styles.contentWrapper}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  breadcrumb: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 12,
    color: COLORS.greyText,
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: COLORS.black,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statsGridMobile: {
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  primaryStatCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 11,
    color: COLORS.greyText,
    marginBottom: 4,
  },
  statValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: COLORS.black,
  },
  tabContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  tabScroll: {
    paddingBottom: 0,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: COLORS.primary,
  },
  tabLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: COLORS.greyText,
  },
  activeTabLabel: {
    color: COLORS.primary,
    ...TYPOGRAPHY.montserrat.bold,
  },
  contentWrapper: {
    flex: 1,
  },
  reportScroll: {
    flex: 1,
  },
  reportSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  reportKey: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: '#495057',
  },
  reportValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 13,
    color: COLORS.black,
  },
  simpleTable: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  simpleTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  simpleHeaderCell: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 11,
    color: COLORS.greyText,
  },
  simpleTableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    alignItems: 'center',
  },
  simpleCell: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: '#495057',
  },
  cellAmount: {
    ...TYPOGRAPHY.montserrat.bold,
    textAlign: 'right',
  },
  tableBody: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: COLORS.greyText,
    ...TYPOGRAPHY.montserrat.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    color: COLORS.greyText,
    textAlign: 'center',
    ...TYPOGRAPHY.montserrat.medium,
  },
  emptyInternalText: {
    padding: 20,
    textAlign: 'center',
    color: COLORS.greyText,
    ...TYPOGRAPHY.montserrat.medium,
  }
});

export default DailyCashReportScreen;
