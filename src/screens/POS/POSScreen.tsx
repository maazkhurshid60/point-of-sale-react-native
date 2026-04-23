import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePaymentStore } from '../../store/usePaymentStore';
import { useUIStore } from '../../store/useUIStore';
import { CartItemRow } from '../../components/billing/CartItemRow';
import { useDialogStore } from '../../store/useDialogStore';
import { ProductsListing } from '../../components/catalog/ProductsListing';
import { COLORS } from '../../constants/colors';
import { formatSaleResponseToSlipData } from '../../utils/invoiceMapping';

export default function POSScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const isTablet = windowWidth > 900;

  const setScreen = useUIStore((state) => state.setScreen);
  const setPaymentScreenValues = usePaymentStore((state) => state.setPaymentScreenValues);

  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalToPay = useCartStore((state) => state.totalToPay);
  const discountAmount = useCartStore((state) => state.discountAmount);
  const taxAmount = useCartStore((state) => state.taxAmount);
  const selectedCustomer = useCartStore((state) => state.selectedCustomer);
  const currentShift = useAuthStore((state) => state.currentShift);
  const selectedSalesman = useAuthStore((state) => state.selectedSalesman);
  const showDialog = useDialogStore((state) => state.showDialog);

  const [showMoreOptions, setShowMoreOptions] = React.useState(false);
  const makeSale = useCartStore((state) => state.makeSale);

  const handleMoreAction = async (type: string) => {
    setShowMoreOptions(false);

    // special cases for navigation or specific dialogs
    if (type === 'coupon') {
      showDialog('GENERATE_COUPON', {});
      return;
    }

    // Print Invoice in Flutter goes to payment screen
    // For now, we'll maintain the current logic of triggering a direct sale if no payment screen exists,
    // or we can map it to show a "Coming Soon" or open the Checkout Dialog if available.
    // However, following Flutter exactly if possible:
    if (type === 'print-invoice') {
      // In Flutter this is moveScreenToPayments()
      // If we don't have a payment screen, we'll keep it as a raw checkout for now
      // but ideally we should have a checkout/payment UI.
    }

    const result = await makeSale(type);
    if (result) {
      const slipData = formatSaleResponseToSlipData(result);
      if (!slipData) return;

      console.log(`[POSScreen] Final standardized slipData for dialog:`, JSON.stringify(slipData));

      switch (type) {
        case 'print-invoice':
          showDialog('TICKET_SLIP', { slipData });
          break;
        case 'print-bill':
          showDialog('RAW_BILL_SLIP', { slipData });
          break;
        case 'print-quotation':
          showDialog('QUOTATION_SLIP', { slipData });
          break;
        case 'print-sample':
          showDialog('SAMPLE_SALE_SLIP', { slipData });
          break;
      }
    }
  };

  const [isHolding, setIsHolding] = React.useState(false);
  const holdCurrentSale = useCartStore((state) => state.holdCurrentSale);

  const handleHold = async () => {
    if (cartItems.length === 0) return;
    setIsHolding(true);
    const success = await holdCurrentSale();
    setIsHolding(false);
    if (success) {
      // Show success or just clear cart (clearCart is handled in store)
    }
  };

  const renderBillingUI = () => (
    <View style={styles.billingSection}>
      {/* More Options Modal */}
      <Modal
        visible={showMoreOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMoreOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMoreOptions(false)}
        >
          <View style={styles.moreOptionsContent}>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleMoreAction('print-invoice')}>
              <FontAwesome6 name="file-invoice" size={20} color="white" style={styles.optionIcon} />
              <Text style={styles.optionText}>Print Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleMoreAction('print-bill')}>
              <FontAwesome6 name="receipt" size={20} color="white" style={styles.optionIcon} />
              <Text style={styles.optionText}>Print Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleMoreAction('print-quotation')}>
              <FontAwesome6 name="file-contract" size={20} color="white" style={styles.optionIcon} />
              <Text style={styles.optionText}>Print Quotation</Text>
            </TouchableOpacity>
            <View style={styles.optionDivider} />
            <TouchableOpacity style={styles.optionItem} onPress={() => handleMoreAction('print-sample')}>
              <FontAwesome6 name="vial" size={20} color="white" style={styles.optionIcon} />
              <Text style={styles.optionText}>Sample</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleMoreAction('coupon')}>
              <FontAwesome6 name="ticket" size={20} color="white" style={styles.optionIcon} />
              <Text style={styles.optionText}>Coupon</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Top Header - Matches Screenshot */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 12 }}>
            <Text style={styles.title}>Billing</Text>
            <Text style={styles.customerName}>{selectedCustomer}</Text>
            {(selectedSalesman || currentShift?.salesman_name) && (
              <Text style={styles.salesmanInfo}>| {selectedSalesman?.name || currentShift?.salesman_name}</Text>
            )}
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => showDialog('CUSTOMER_SELECTION', {})}
          >
            <FontAwesome6 name="user" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => showDialog('SALESMAN_SELECTION', {})}
          >
            <FontAwesome6 name="user-tie" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => showDialog('ADD_PRODUCT_BY', {})}
          >
            <FontAwesome6 name="barcode" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => showDialog('SCAN_BARCODE_WEB', {})}
          >
            <FontAwesome6 name="expand" size={16} color="white" />
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.placeholderText}>Name/SKU/UPC</Text>
        </View>
      </View>

      {/* List Area */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product_id?.toString() || Math.random().toString()}
        renderItem={({ item }) => <CartItemRow item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="cart-shopping" size={64} color="#f3f4f6" />
            <Text style={styles.emptyText}>No items in cart</Text>
          </View>
        }
      />

      {/* Operation Footer - From Screenshot */}
      <View style={styles.operationFooter}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Paying</Text>
            <Text style={styles.summaryValuePrimary}>{totalToPay.toFixed(2)}/-</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Discount(£)</Text>
            <Text style={styles.summaryValueSecondary}>{discountAmount.toFixed(2)}/-</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Change</Text>
            <Text style={styles.summaryValueTertiary}>0.0/-</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValueTertiary}>{taxAmount.toFixed(2)}/-</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setShowMoreOptions(true)}
          >
            <FontAwesome6 name="ellipsis-vertical" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ff6b52' }]} onPress={clearCart}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#ffbb44' }]}
            onPress={handleHold}
            disabled={isHolding}
          >
            <Text style={styles.btnText}>{isHolding ? '...' : 'Hold'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#7b1fa2' }]}>
            <Text style={styles.btnText}>Order</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#0288d1' }]}
            onPress={() => {
              if (cartItems.length > 0) {
                setPaymentScreenValues(totalToPay, totalToPay);
                setScreen('PAYMENT');
              } else {
                // Ignore or could show an alert
              }
            }}
          >
            <Text style={styles.btnText}>Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cashButton}
            onPress={() => handleMoreAction('print-invoice')}
          >
            <View style={styles.cashLeft}>
              <Text style={styles.cashText}>Cash</Text>
              <FontAwesome6 name="chevron-right" size={14} color="white" />
            </View>
            <Text style={styles.cashAmount}>{totalToPay.toFixed(2)}/-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );


  if (isLandscape && isTablet) {
    return (
      <View style={styles.landscapeContainer}>
        <View style={styles.productLane}>
          <ProductsListing isGridView={true} columns={2} />
        </View>
        <View style={styles.billingLane}>
          {renderBillingUI()}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderBillingUI()}
    </View>
  );
}

const styles = StyleSheet.create({
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  productLane: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#f3f4f6',
    padding: 10,
  },
  billingLane: {
    width: '70%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  billingSection: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4b5563',
  },
  customerName: {
    fontSize: 16,
    color: '#a855f7',
    marginBottom: 4,
  },
  salesmanInfo: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Montserrat',
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7b1fa2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7b1fa2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    marginLeft: 4,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 250,
  },
  emptyContainer: {
    flex: 1,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
  },
  operationFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    padding: 16,
    zIndex: 10,
  },
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValuePrimary: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0288d1',
  },
  summaryValueSecondary: {
    fontSize: 22,
    fontWeight: '700',
    color: '#10b981',
  },
  summaryValueTertiary: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9ca3af',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  cashButton: {
    flex: 2,
    height: 50,
    backgroundColor: '#7b1fa2',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cashLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cashText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  cashAmount: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreOptionsContent: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 10,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  optionIcon: {
    width: 28,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  optionDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 5,
    marginHorizontal: 10,
  },
});
