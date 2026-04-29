import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import LeftSideMenu from '../../components/common/LeftSideMenu';
import RightSideMenu from '../../components/common/RightSideMenu';
import GlobalDialogManager from '../../components/dialogs/GlobalDialogManager';

// Screens
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

import { styles } from './DashboardScreen.styles';
import { useDashboardController } from './hooks/useDashboardController';

export default function DashboardScreen() {
  const {
    activeScreen,
    toggleLeftMenu,
    toggleRightMenu,
    signOut,
  } = useDashboardController();

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
      <View style={styles.header}>
        <Pressable
          onPress={() => toggleLeftMenu(true)}
          style={styles.headerLeft}
        >
          <Image
            source={require('../../../assets/svgs/poslogo.png')}
            style={styles.headerLogo}
          />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {activeScreen === 'DEFAULT' ? 'Dashboard' : activeScreen.replace(/_/g, ' ')}
          </Text>
        </View>

        {activeScreen === "DEFAULT" ? (
          <CustomButton
            title="Sign Out"
            onPress={signOut}
            style={styles.signOutButton}
            iconComponent={<FontAwesome6 name="right-from-bracket" size={16} color="white" />}
          />
        ) : (
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <CustomButton
              onPress={() => toggleRightMenu(true)}
              variant="primary"
              size="none"
              style={styles.menuButton}
              iconComponent={<FontAwesome6 name="bars" size={20} color={COLORS.white} />}
            />
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      <LeftSideMenu />
      <RightSideMenu />
      <GlobalDialogManager />
    </SafeAreaView>
  );
}
