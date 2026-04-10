import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { useReportStore, ReportType } from '../../../store/useReportStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ReportFilterSectionProps {
  type: ReportType;
}

const ReportFilterSection: React.FC<ReportFilterSectionProps> = ({ type }) => {
  const store = useReportStore();
  const filters = store.reports[type];

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    store.toggleFiltersMobile(type);
  };

  const renderDropdown = (label: string, field: any, options: string[]) => (
    <View style={styles.filterItem}>
      <Text style={styles.filterLabel}>{label}</Text>
      <Pressable style={styles.dropdownBtn}>
        <Text style={styles.dropdownValue}>{filters[field as keyof typeof filters] as string}</Text>
        <FontAwesome6 name="chevron-down" size={12} color={COLORS.greyText} />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={toggleExpand}>
        <View style={styles.headerLeft}>
          <FontAwesome6 name="filter" size={16} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Filters</Text>
        </View>
        <FontAwesome6 
          name={filters.isFiltersExpandedForMobile ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={COLORS.greyText} 
        />
      </Pressable>

      {filters.isFiltersExpandedForMobile && (
        <View style={styles.content}>
          <View style={styles.grid}>
            {renderDropdown("Store/Branch", "selectedStoreAndBranch", store.listOfStoreAndBranches)}
            {renderDropdown("Category", "selectedCategory", store.listOfCategories)}
            {renderDropdown("Product", "selectedProduct", store.listOfProducts)}
            {renderDropdown("Customer", "selectedCustomer", store.listOfCustomers)}
            {renderDropdown("Salesman", "selectedSalesman", store.listOfSalesmen)}
            {renderDropdown("Status", "selectedSalePaymentStatus", store.listOfPaymentStatuses)}
          </View>
          
          <View style={styles.actions}>
            <Pressable 
                style={[styles.actionBtn, styles.resetBtn]} 
                onPress={() => store.resetFilters(type)}
            >
              <Text style={styles.resetBtnText}>Reset</Text>
            </Pressable>
            <Pressable 
                style={[styles.actionBtn, styles.applyBtn]} 
                onPress={() => {
                    store.fetchReportData(type);
                    toggleExpand();
                }}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: COLORS.black,
  },
  content: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    backgroundColor: '#fcfcfd',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterItem: {
    width: '47%',
    marginBottom: 12,
  },
  filterLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: COLORS.greyText,
    marginBottom: 6,
  },
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownValue: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 13,
    color: COLORS.black,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtn: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  resetBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#495057',
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
  },
  applyBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#fff',
  },
});

export default ReportFilterSection;
