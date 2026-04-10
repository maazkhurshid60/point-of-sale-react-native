import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useDialogStore } from '../../store/useDialogStore';

import LeftSideMenu from '../../components/common/LeftSideMenu';
import RightSideMenu from '../../components/common/RightSideMenu';
import GlobalDialogManager from '../../components/dailogs/GlobalDialogManager';
import { ProfileScreen } from '../Profile/ProfileScreen';
import { POSSettingsScreen } from '../Settings/POSSettingsScreen';
import { ShiftDetailsScreen } from '../Shift/ShiftDetailsScreen';
import { RestaurantTableScreen } from '../Restaurant/RestaurantTableScreen';
import { OrderReviewScreen } from '../Orders/OrderReviewScreen';
import { POSExpenseScreen } from '../Expenses/POSExpenseScreen';
import { HoldSalesScreen } from '../Sales/HoldSalesScreen';
import SalesScreen from '../Sales/SalesScreen';
import OfflineSalesScreen from '../OfflineSales/OfflineSalesScreen';
import POSScreen from '../POS/POSScreen';
import ReportsMenuScreen from '../Reports/ReportsMenuScreen';
import ProductReportScreen from '../Reports/ProductReportScreen';
import InvoicePaymentReportScreen from '../Reports/InvoicePaymentReportScreen';
import CashierReportScreen from '../Reports/CashierReportScreen';
import CreditSaleReportScreen from '../Reports/CreditSaleReportScreen';
import WarehouseStockReportScreen from '../Reports/WarehouseStockReportScreen';
import StoreStockReportScreen from '../Reports/StoreStockReportScreen';
import DailyCashReportScreen from '../Reports/DailyCashReportScreen';
import AddCustomerScreen from '../Customer/AddCustomerScreen';
import DashboardMainScreen from './DashboardMainScreen';

import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const currentUser = useAuthStore((state: any) => state.currentUser);
  const activeScreen = useUIStore((state) => state.activeScreen);
  const toggleLeftMenu = useUIStore((state) => state.toggleLeftMenu);
  const toggleRightMenu = useUIStore((state) => state.toggleRightMenu);

  const renderContent = () => {
    switch (activeScreen) {
      case 'PROFILE':
        return <ProfileScreen />;
      case 'POS_SETTINGS':
        return <POSSettingsScreen />;
      case 'SHIFT_DETAILS':
        return <ShiftDetailsScreen />;
      case 'RESTAURANT_TABLES':
        return <RestaurantTableScreen />;
      case 'ORDER_REVIEW':
        return <OrderReviewScreen />;
      case 'POS_EXPENSE':
        return <POSExpenseScreen />;
      case 'HOLD_SALES':
        return <HoldSalesScreen />;
      case 'SALES':
        return <SalesScreen />;
      case 'OFFLINE_SALES':
        return <OfflineSalesScreen />;
      case 'DAILY_REPORT':
        return <DailyCashReportScreen />;
      case 'CUSTOMERS':
        return <AddCustomerScreen />;
      case 'POS_BILLING':
        return <POSScreen />;
      case 'REPORTS_MENU':
        return <ReportsMenuScreen />;
      case 'PRODUCT_REPORT':
        return <ProductReportScreen />;
      case 'INVOICE_REPORT':
        return <InvoicePaymentReportScreen />;
      case 'CASHIER_REPORT':
        return <CashierReportScreen />;
      case 'CREDIT_REPORT':
        return <CreditSaleReportScreen />;
      case 'WAREHOUSE_REPORT':
        return <WarehouseStockReportScreen />;
      case 'STORE_REPORT':
        return <StoreStockReportScreen />;
      case 'DEFAULT':
      default:
        return <DashboardMainScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={() => toggleLeftMenu(true)}
            style={({ pressed }) => [
              styles.menuButton,
              { backgroundColor: pressed ? '#ebebeb' : '#f8f9fa' }
            ]}
          >
            <FontAwesome6 name="boxes-stacked" size={20} color="#1C1B1F" />
          </Pressable>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.userName}>{currentUser?.username || 'Admin'}</Text>
          <Pressable
            onPress={() => toggleRightMenu(true)}
            style={({ pressed }) => [
              styles.menuButton,
              { backgroundColor: pressed ? '#ebebeb' : '#f8f9fa' }
            ]}
          >
            <FontAwesome6 name="bars" size={20} color="#1C1B1F" />
          </Pressable>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* Side Menus */}
      <LeftSideMenu />
      <RightSideMenu />

      {/* Global Dialog Manager - renders shift modals */}
      <GlobalDialogManager />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ca13e6ff', // Signature purple background
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.greyText,
    marginRight: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
