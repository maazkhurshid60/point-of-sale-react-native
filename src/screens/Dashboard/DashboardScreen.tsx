import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image, TouchableOpacity } from 'react-native';
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
import RestaurantFloorsScreen from '../Restaurant/RestaurantFloorsScreen';
import { OrderReviewScreen } from '../Orders/OrderReviewScreen';
import { OrdersScreen } from '../Orders/OrdersScreen';
import { POSExpenseScreen } from '../Expenses/POSExpenseScreen';
import { HoldSalesScreen } from '../Sales/HoldSalesScreen';
import SalesScreen from '../Sales/SalesScreen';
import OfflineSalesScreen from '../OfflineSales/OfflineSalesScreen';
import POSScreen from '../POS/POSScreen';
import EditSaleScreen from '../Sales/EditSaleScreen';
import PaymentScreen from '../Payment/PaymentScreen';
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
import { CustomButton } from '../../components/common/CustomButton';


export default function DashboardScreen() {
  const activeScreen = useUIStore((state) => state.activeScreen);
  const toggleLeftMenu = useUIStore((state) => state.toggleLeftMenu);
  const setScreen = useUIStore((state) => state.setScreen);
  const isShiftOpened = useAuthStore((state) => state.isShiftOpened);
  const showDialog = useDialogStore((state) => state.showDialog);

  // Fetch initial data
  useEffect(() => {
    if (isShiftOpened) {
      useAuthStore.getState().fetchSalesman();
      useAuthStore.getState().fetchCustomers();
      useAuthStore.getState().fetchBankAccounts();
      useAuthStore.getState().fetchCashAccounts();
      useAuthStore.getState().fetchCreditCardAccounts();
    }
  }, [isShiftOpened]);

  // Shift Protection Logic
  useEffect(() => {
    const exemptedScreens = ['DEFAULT', 'PROFILE', 'POS_SETTINGS', 'REPORTS_MENU', 'SHIFT_DETAILS', 'PRODUCT_REPORT', 'INVOICE_REPORT', 'CASHIER_REPORT', 'CREDIT_REPORT', 'WAREHOUSE_REPORT', 'STORE_REPORT', 'DAILY_REPORT'];

    console.log(`Current Screen: ${activeScreen}, Shift Opened: ${isShiftOpened}`);

    if (!exemptedScreens.includes(activeScreen) && !isShiftOpened) {
      console.log('Access restricted - open shift required for sales modules');
      showDialog('OPEN_SHIFT', {});
      setScreen('DEFAULT');
    }
  }, [activeScreen, isShiftOpened]);

  const renderContent = () => {
    switch (activeScreen) {
      case 'PROFILE':
        return <ProfileScreen />;
      case 'POS_SETTINGS':
        return <POSSettingsScreen />;
      case 'SHIFT_DETAILS':
        return <ShiftDetailsScreen />;
      case 'RESTAURANT_FLOORS':
        return <RestaurantFloorsScreen />;
      case 'RESTAURANT_TABLES':
        return <RestaurantTableScreen />;
      case 'ORDER_REVIEW':
        return <OrderReviewScreen />;
      case 'ORDER_VIEW':
        return <OrdersScreen />;
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
      case 'EDIT_SALE':
        return <EditSaleScreen />;
      case 'PAYMENT':
        return <PaymentScreen />;
      case 'DEFAULT':
      default:
        return <DashboardMainScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        {/* Left: Menu Toggle + Logo */}
        <Pressable
          onPress={() => toggleLeftMenu(true)}
          style={styles.headerLeft}
        >
          <Image
            source={require('../../../assets/svgs/poslogo.png')}
            style={styles.headerLogo}
          />
        </Pressable>

        {/* Center: Title */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {activeScreen === 'DEFAULT' ? 'Dashboard' : activeScreen.replace(/_/g, ' ')}
          </Text>
        </View>

        {activeScreen === "DEFAULT" ? (

          <CustomButton
            title="Sign Out"
            onPress={() => useAuthStore.getState().signOut()}
            style={styles.signOutButton}
            iconComponent={<FontAwesome6 name="right-from-bracket" size={16} color="white" />}
          />

        )
          : (
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <CustomButton
                onPress={() => useUIStore.getState().toggleRightMenu(true)}
                variant="primary"
                size="none"
                style={styles.menuButton}
                iconComponent={<FontAwesome6 name="bars" size={20} color={COLORS.white} />}
              />
            </View>

          )
        }
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
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Signature purple background
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
  },
  headerLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'capitalize',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    width: 150,
    justifyContent: "center",
  },
  signOutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },



});
