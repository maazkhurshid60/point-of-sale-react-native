import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import ReportFilterSection from './components/ReportFilterSection';
import ReportMockChart from './components/ReportMockCharts';
import ReportStatusCard from './components/ReportStatusCard';
import { useStoreStockReportController } from './hooks/useStoreStockReportController';
import { styles } from './StoreStockReportScreen.styles';

export const StoreStockReportScreen: React.FC = () => {
    const {
        filters,
        isLoading,
        dummyData,
        setScreen,
        toggleTabs,
    } = useStoreStockReportController();

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
                    <Text style={styles.headerTitle}>Store Inventory</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.filterWrapper}>
                    <ReportFilterSection type="STORE" />
                </View>

                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loaderText}>Fetching store stock levels...</Text>
                    </View>
                ) : (
                    <View style={styles.reportContent}>
                        <View style={styles.tabContainer}>
                            <Pressable 
                                onPress={() => toggleTabs(true, false)}
                                style={[styles.tab, filters.isChartsOpen && styles.activeTab]}
                            >
                                <FontAwesome6 
                                    name="chart-bar" 
                                    size={14} 
                                    color={filters.isChartsOpen ? 'white' : COLORS.textSecondary} 
                                    style={{ marginRight: 8 }} 
                                />
                                <Text style={[styles.tabText, filters.isChartsOpen && styles.activeTabText]}>Performance</Text>
                            </Pressable>
                            <Pressable 
                                onPress={() => toggleTabs(false, true)}
                                style={[styles.tab, filters.isSummaryOpen && styles.activeTab]}
                            >
                                <FontAwesome6 
                                    name="shop" 
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
                                    <ReportStatusCard label="Total SKU Value" value="PKR 420k" icon="bag-shopping" color={COLORS.primary} />
                                    <ReportStatusCard label="Active Items" value="156 SKUs" icon="barcode" color={COLORS.success} />
                                </View>
                                <View style={styles.chartCard}>
                                    <ReportMockChart title="Stock Valuation by Branch" data={dummyData} type="bar" color={COLORS.primary} />
                                </View>
                            </View>
                        )}

                        {filters.isSummaryOpen && (
                            <View style={styles.summarySection}>
                                <View style={styles.tableCard}>
                                    <View style={styles.tableCardHeader}>
                                        <Text style={styles.tableCardTitle}>In-Store Stock Summary</Text>
                                    </View>
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.headerCell, { flex: 2 }]}>Branch Store</Text>
                                        <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Units</Text>
                                        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Stock Value</Text>
                                    </View>
                                    {dummyData.map((item, i) => (
                                        <View key={i} style={styles.tableRow}>
                                            <View style={{ flex: 2 }}>
                                                <Text style={styles.cellMainText}>{item.label}</Text>
                                                <Text style={styles.cellSubText}>Main Marketplace</Text>
                                            </View>
                                            <Text style={[styles.cellText, { flex: 1, textAlign: 'center' }]}>{120 + (i * 10)}</Text>
                                            <Text style={[styles.cellAmountText, { flex: 1.5, textAlign: 'right' }]}>PKR {(item.value * 10).toLocaleString()}</Text>
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

export default StoreStockReportScreen;
