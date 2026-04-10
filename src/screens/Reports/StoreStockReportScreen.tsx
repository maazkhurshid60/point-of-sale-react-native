import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useReportStore } from '../../store/useReportStore';
import ReportFilterSection from './components/ReportFilterSection';
import ReportMockChart from './components/ReportMockCharts';
import ReportStatusCard from './components/ReportStatusCard';

const StoreStockReportScreen: React.FC = () => {
    const store = useReportStore();
    const filters = store.reports['STORE'];
    const isLoading = store.isLoading['STORE'];

    useEffect(() => {
        store.fetchReportData('STORE');
    }, []);

    const dummyData = [
        { label: 'Store A', value: 850 },
        { label: 'Store B', value: 620 },
        { label: 'Store C', value: 940 },
        { label: 'Store D', value: 1100 }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.breadcrumb}>Dashboard / Reports / <Text style={{ color: COLORS.primary }}>Stores</Text></Text>
                <Text style={styles.title}>Stock store report</Text>
            </View>
            
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <ReportFilterSection type="STORE" />

                {isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
                ) : (
                    <>
                        <View style={styles.tabContainer}>
                            <Pressable 
                                onPress={() => store.toggleTabs('STORE', true, false)}
                                style={[styles.tab, filters.isChartsOpen && styles.activeTab]}
                            >
                                <Text style={[styles.tabText, filters.isChartsOpen && styles.activeTabText]}>Chart</Text>
                            </Pressable>
                            <Pressable 
                                onPress={() => store.toggleTabs('STORE', false, true)}
                                style={[styles.tab, filters.isSummaryOpen && styles.activeTab]}
                            >
                                <Text style={[styles.tabText, filters.isSummaryOpen && styles.activeTabText]}>Summary</Text>
                            </Pressable>
                        </View>

                        {filters.isChartsOpen && (
                            <View style={styles.chartSection}>
                                <View style={styles.statsGrid}>
                                    <ReportStatusCard label="Store Stock Value" value="$42,000" icon="shop" color="#9C27B0" />
                                    <ReportStatusCard label="Total SKU" value="156" icon="barcode" color="#00BCD4" />
                                </View>
                                <ReportMockChart title="Stock by Store" data={dummyData} type="bar" color="#9C27B0" />
                            </View>
                        )}

                        {filters.isSummaryOpen && (
                            <View style={styles.summarySection}>
                                <View style={styles.tableCard}>
                                    <Text style={styles.sectionTitle}>Store Performance</Text>
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.headerCell, { flex: 2 }]}>Store</Text>
                                        <Text style={[styles.headerCell, { flex: 1 }]}>Items</Text>
                                        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Value</Text>
                                    </View>
                                    {dummyData.map((item, i) => (
                                        <View key={i} style={styles.row}>
                                            <Text style={[styles.rowText, { flex: 2 }]}>{item.label}</Text>
                                            <Text style={[styles.rowText, { flex: 1 }]}>{120 + (i * 10)}</Text>
                                            <Text style={[styles.rowText, { flex: 1.5, textAlign: 'right', fontWeight: 'bold' }]}>${item.value * 10}.00</Text>
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
    header: { marginBottom: 20 },
    breadcrumb: { ...TYPOGRAPHY.montserrat.medium, fontSize: 12, color: COLORS.greyText },
    title: { ...TYPOGRAPHY.montserrat.bold, fontSize: 24, color: COLORS.black, marginTop: 4 },
    tabContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e9ecef' },
    activeTab: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    tabText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: COLORS.greyText },
    activeTabText: { color: '#fff' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    chartSection: { gap: 16 },
    summarySection: { gap: 16 },
    tableCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#f1f3f5' },
    sectionTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 16, marginBottom: 16 },
    tableHeader: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
    headerCell: { ...TYPOGRAPHY.montserrat.bold, fontSize: 13, color: COLORS.greyText },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f8f9fa' },
    rowText: { ...TYPOGRAPHY.montserrat.medium, fontSize: 13, color: '#495057' }
});

export default StoreStockReportScreen;
