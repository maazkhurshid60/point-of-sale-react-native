import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import ReportFilterSection from './components/ReportFilterSection';
import ReportMockChart from './components/ReportMockCharts';
import ReportStatusCard from './components/ReportStatusCard';
import { useWarehouseStockReportController } from './hooks/useWarehouseStockReportController';
import { styles } from './WarehouseStockReportScreen.styles';

export const WarehouseStockReportScreen: React.FC = () => {
    const {
        filters,
        isLoading,
        dummyData,
        setScreen,
        toggleTabs,
    } = useWarehouseStockReportController();

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
                    <Text style={styles.headerTitle}>Warehouse Inventory</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.filterWrapper}>
                    <ReportFilterSection type="WAREHOUSE" />
                </View>

                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loaderText}>Scanning logistics data...</Text>
                    </View>
                ) : (
                    <View style={styles.reportContent}>
                        <View style={styles.tabContainer}>
                            <Pressable
                                onPress={() => toggleTabs(true, false)}
                                style={[styles.tab, filters.isChartsOpen && styles.activeTab]}
                            >
                                <FontAwesome6
                                    name="chart-area"
                                    size={14}
                                    color={filters.isChartsOpen ? 'white' : COLORS.textSecondary}
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={[styles.tabText, filters.isChartsOpen && styles.activeTabText]}>Analytics</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => toggleTabs(false, true)}
                                style={[styles.tab, filters.isSummaryOpen && styles.activeTab]}
                            >
                                <FontAwesome6
                                    name="boxes-stacked"
                                    size={14}
                                    color={filters.isSummaryOpen ? 'white' : COLORS.textSecondary}
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={[styles.tabText, filters.isSummaryOpen && styles.activeTabText]}>Inventory</Text>
                            </Pressable>
                        </View>

                        {filters.isChartsOpen && (
                            <View style={styles.chartSection}>
                                <View style={styles.statsGrid}>
                                    <ReportStatusCard label="Total SKU Count" value="2,750" icon="warehouse" color={COLORS.primary} />
                                    <ReportStatusCard label="Critical Low" value="14 Items" icon="arrow-trend-down" color={COLORS.danger} />
                                </View>
                                <View style={styles.chartCard}>
                                    <ReportMockChart title="Stock Levels by Category" data={dummyData} type="bar" color={COLORS.primary} />
                                </View>
                            </View>
                        )}

                        {filters.isSummaryOpen && (
                            <View style={styles.summarySection}>
                                <View style={styles.tableCard}>
                                    <View style={styles.tableCardHeader}>
                                        <Text style={styles.tableCardTitle}>Bulk Stock Ledger</Text>
                                    </View>
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.headerCell, { flex: 2 }]}>Material Item</Text>
                                        <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Threshold</Text>
                                        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Inbound Stock</Text>
                                    </View>
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <View key={i} style={styles.tableRow}>
                                            <View style={{ flex: 2 }}>
                                                <Text style={styles.cellMainText}>Material Logistics #{i}</Text>
                                                <Text style={styles.cellSubText}>ID: WH-092{i}</Text>
                                            </View>
                                            <Text style={[styles.cellText, { flex: 1, textAlign: 'center' }]}>100 Units</Text>
                                            <Text style={[styles.cellAmountText, { flex: 1.5, textAlign: 'right' }]}>{50 + (i * 20)} Units</Text>
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

export default WarehouseStockReportScreen;
