import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import ReportFilterSection from './components/ReportFilterSection';
import ReportMockChart from './components/ReportMockCharts';
import ReportStatusCard from './components/ReportStatusCard';
import { useCashierReportController } from './hooks/useCashierReportController';
import { styles } from './CashierReportScreen.styles';

export const CashierReportScreen: React.FC = () => {
    const {
        filters,
        isLoading,
        dummyData,
        setScreen,
        toggleTabs,
    } = useCashierReportController();

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
                    <Text style={styles.headerTitle}>Cashier Performance</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.filterWrapper}>
                    <ReportFilterSection type="CASHIER" />
                </View>

                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loaderText}>Compiling cashier data...</Text>
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
                                <Text style={[styles.tabText, filters.isChartsOpen && styles.activeTabText]}>Performance</Text>
                            </Pressable>
                            <Pressable 
                                onPress={() => toggleTabs(false, true)}
                                style={[styles.tab, filters.isSummaryOpen && styles.activeTab]}
                            >
                                <FontAwesome6 
                                    name="table-list" 
                                    size={14} 
                                    color={filters.isSummaryOpen ? 'white' : COLORS.textSecondary} 
                                    style={{ marginRight: 8 }} 
                                />
                                <Text style={[styles.tabText, filters.isSummaryOpen && styles.activeTabText]}>Ledger</Text>
                            </Pressable>
                        </View>

                        {filters.isChartsOpen && (
                            <View style={styles.chartSection}>
                                <View style={styles.statsGrid}>
                                    <ReportStatusCard label="Active Cashiers" value="4 Personnel" icon="users" color={COLORS.primary} />
                                    <ReportStatusCard label="Avg/Transaction" value="PKR 4.2k" icon="hand-holding-dollar" color={COLORS.success} />
                                </View>
                                <View style={styles.chartCard}>
                                    <ReportMockChart title="Sales Volume by Cashier" data={dummyData} type="bar" color={COLORS.primary} />
                                </View>
                            </View>
                        )}

                        {filters.isSummaryOpen && (
                            <View style={styles.summarySection}>
                                <View style={styles.tableCard}>
                                    <View style={styles.tableCardHeader}>
                                        <Text style={styles.tableCardTitle}>Performance Breakdown</Text>
                                    </View>
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.headerCell, { flex: 2 }]}>Cashier Name</Text>
                                        <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Orders</Text>
                                        <Text style={[styles.headerCell, { flex: 1.5, textAlign: 'right' }]}>Total Sales</Text>
                                    </View>
                                    {dummyData.map((item, i) => (
                                        <View key={i} style={styles.tableRow}>
                                            <View style={{ flex: 2 }}>
                                                <Text style={styles.cellMainText}>{item.label}</Text>
                                                <Text style={styles.cellSubText}>Senior Associate</Text>
                                            </View>
                                            <Text style={[styles.cellText, { flex: 1, textAlign: 'center' }]}>{15 + i}</Text>
                                            <Text style={[styles.cellAmountText, { flex: 1.5, textAlign: 'right' }]}>PKR {item.value.toLocaleString()}</Text>
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

export default CashierReportScreen;
