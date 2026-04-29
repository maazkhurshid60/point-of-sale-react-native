import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useDailyCashReportController } from './hooks/useDailyCashReportController';
import { styles } from './DailyCashReportScreen.styles';

export const DailyCashReportScreen: React.FC = () => {
  const {
    isTablet,
    isLoading,
    reportData,
    activeTab,
    tabs,
    setScreen,
    setActiveTab,
    loadData,
  } = useDailyCashReportController();

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

export default DailyCashReportScreen;
