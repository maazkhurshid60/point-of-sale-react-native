import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import ReportFilterSection from './components/ReportFilterSection';
import ReportMockChart from './components/ReportMockCharts';
import ReportStatusCard from './components/ReportStatusCard';
import { useCreditSaleReportController } from './hooks/useCreditSaleReportController';
import { styles } from './CreditSaleReportScreen.styles';

export const CreditSaleReportScreen: React.FC = () => {
    const {
        filters,
        isLoading,
        dummyData,
        setScreen,
        toggleTabs,
    } = useCreditSaleReportController();

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
                    <Text style={styles.headerTitle}>Credit Sales</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.filterWrapper}>
                    <ReportFilterSection type="CREDIT_SALE" />
                </View>

                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loaderText}>Auditing credit ledger...</Text>
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
                                <Text style={[styles.tabText, filters.isChartsOpen && styles.activeTabText]}>Aging</Text>
                            </Pressable>
                            <Pressable 
                                onPress={() => toggleTabs(false, true)}
                                style={[styles.tab, filters.isSummaryOpen && styles.activeTab]}
                            >
                                <FontAwesome6 
                                    name="clipboard-list" 
                                    size={14} 
                                    color={filters.isSummaryOpen ? 'white' : COLORS.textSecondary} 
                                    style={{ marginRight: 8 }} 
                                />
                                <Text style={[styles.tabText, filters.isSummaryOpen && styles.activeTabText]}>Details</Text>
                            </Pressable>
                        </View>

                        {filters.isChartsOpen && (
                            <View style={styles.chartSection}>
                                <View style={styles.statsGrid}>
                                    <ReportStatusCard label="Total Credit" value="PKR 128k" icon="hand-holding-dollar" color={COLORS.danger} />
                                    <ReportStatusCard label="Overdue" value="PKR 12.5k" icon="triangle-exclamation" color={COLORS.warning} />
                                </View>
                                <View style={styles.chartCard}>
                                    <ReportMockChart title="Credit Aging Analysis" data={dummyData} type="bar" color={COLORS.danger} />
                                </View>
                            </View>
                        )}

                        {filters.isSummaryOpen && (
                            <View style={styles.summarySection}>
                                <View style={styles.tableCard}>
                                    <View style={styles.tableCardHeader}>
                                        <Text style={styles.tableCardTitle}>Customer Credit Summary</Text>
                                    </View>
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.headerCell, { flex: 2 }]}>Customer</Text>
                                        <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Limit</Text>
                                        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Balance</Text>
                                    </View>
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <View key={i} style={styles.tableRow}>
                                            <View style={{ flex: 2 }}>
                                                <Text style={styles.cellMainText}>Credit Customer {i}</Text>
                                                <Text style={styles.cellSubText}>ID: CR-890{i}</Text>
                                            </View>
                                            <Text style={[styles.cellText, { flex: 1, textAlign: 'center' }]}>PKR 5k</Text>
                                            <Text style={[styles.cellAmountText, { flex: 1.5, textAlign: 'right', color: COLORS.danger }]}>PKR 1,200</Text>
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

export default CreditSaleReportScreen;
