import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useReportStore } from '../../store/useReportStore';
import { useUIStore } from '../../store/useUIStore';
import ReportFilterSection from './components/ReportFilterSection';
import ReportMockChart from './components/ReportMockCharts';
import ReportStatusCard from './components/ReportStatusCard';

const CreditSaleReportScreen: React.FC = () => {
    const store = useReportStore();
    const setScreen = useUIStore((state) => state.setScreen);
    const filters = store.reports['CREDIT_SALE'];
    const isLoading = store.isLoading['CREDIT_SALE'];

    useEffect(() => {
        store.fetchReportData('CREDIT_SALE');
    }, []);

    const dummyData = [
        { label: '30 Days', value: 4500 },
        { label: '60 Days', value: 2800 },
        { label: '90 Days', value: 1200 },
        { label: 'Over 90', value: 800 }
    ];

    return (
        <View style={styles.container}>
            {/* Clean White Header with Back Button */}
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
                        {/* TABS FOR CHARTS AND SUMMARY */}
                        <View style={styles.tabContainer}>
                            <Pressable 
                                onPress={() => store.toggleTabs('CREDIT_SALE', true, false)}
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
                                onPress={() => store.toggleTabs('CREDIT_SALE', false, true)}
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

                        {/* CHARTS VIEW */}
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

                        {/* SUMMARY VIEW */}
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backBtn: { 
        width: 44, 
        height: 44, 
        borderRadius: 14, 
        backgroundColor: '#F1F5F9', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    headerTextContainer: { flex: 1, alignItems: 'center' },
    headerTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 18, color: '#1A202C' },
    
    scrollContent: { paddingHorizontal: 20, paddingBottom: 60, paddingTop: 20 },
    filterWrapper: { marginBottom: 20 },
    
    loaderContainer: { marginTop: 60, alignItems: 'center' },
    loaderText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 13, color: '#64748B', marginTop: 10 },
    
    reportContent: { gap: 20 },
    tabContainer: { 
        flexDirection: 'row', 
        backgroundColor: '#E2E8F0', 
        padding: 6, 
        borderRadius: 16, 
        gap: 8 
    },
    tab: { 
        flex: 1, 
        flexDirection: 'row',
        paddingVertical: 12, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 12, 
    },
    activeTab: { 
        backgroundColor: COLORS.primary, 
        elevation: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
    },
    tabText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 13, color: '#64748B' },
    activeTabText: { color: 'white' },
    
    chartSection: { gap: 16 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    chartCard: { 
        backgroundColor: 'white', 
        borderRadius: 24, 
        padding: 20, 
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.05,
        borderWidth: 1,
        borderColor: '#F1F5F9'
    },
    
    summarySection: { gap: 16 },
    tableCard: { 
        backgroundColor: 'white', 
        borderRadius: 24, 
        overflow: 'hidden', 
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        borderWidth: 1,
        borderColor: '#F1F5F9'
    },
    tableCardHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    tableCardTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 16, color: '#1E293B' },
    tableHeader: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#F8FAFC' },
    headerCell: { ...TYPOGRAPHY.montserrat.bold, fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
    tableRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', alignItems: 'center' },
    cellMainText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#1E293B' },
    cellSubText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 11, color: '#94A3B8' },
    cellText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 13, color: '#1E293B' },
    cellAmountText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: COLORS.primary },
});

export default CreditSaleReportScreen;
