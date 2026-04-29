import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { CartItemRow } from '../../components/billing/CartItemRow';
import { ProductsListing } from '../../components/catalog/ProductsListing';
import { CustomButton } from '../../components/common/CustomButton';
import { styles } from './POSScreen.styles';
import { usePOSController } from './hooks/usePOSController';

const MoreOptionsModal = ({ visible, onClose, onAction }: { visible: boolean, onClose: () => void, onAction: (type: string) => void }) => (
  <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.moreOptionsContent}>
        <CustomButton
          onPress={() => onAction('print-invoice')}
          variant="none"
          size="none"
          style={styles.optionItem}
          textStyle={styles.optionText}
          iconComponent={<FontAwesome6 name="file-invoice" size={20} color="white" style={styles.optionIcon} />}
          title="Print Invoice"
        />
        <CustomButton
          onPress={() => onAction('print-bill')}
          variant="none"
          size="none"
          style={styles.optionItem}
          textStyle={styles.optionText}
          iconComponent={<FontAwesome6 name="receipt" size={20} color="white" style={styles.optionIcon} />}
          title="Print Bill"
        />
        <CustomButton
          onPress={() => onAction('print-quotation')}
          variant="none"
          size="none"
          style={styles.optionItem}
          textStyle={styles.optionText}
          iconComponent={<FontAwesome6 name="file-contract" size={20} color="white" style={styles.optionIcon} />}
          title="Print Quotation"
        />
        <View style={styles.optionDivider} />
        <CustomButton
          onPress={() => onAction('print-sample')}
          variant="none"
          size="none"
          style={styles.optionItem}
          textStyle={styles.optionText}
          iconComponent={<FontAwesome6 name="vial" size={20} color="white" style={styles.optionIcon} />}
          title="Sample"
        />
        <CustomButton
          onPress={() => onAction('coupon')}
          variant="none"
          size="none"
          style={styles.optionItem}
          textStyle={styles.optionText}
          iconComponent={<FontAwesome6 name="ticket" size={20} color="white" style={styles.optionIcon} />}
          title="Coupon"
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

export default function POSScreen() {
  const {
    isLandscape,
    isTablet,
    cartItems,
    totalToPay,
    discountAmount,
    taxAmount,
    selectedCustomer,
    currentShift,
    selectedSalesman,
    showMoreOptions,
    isHolding,
    setShowMoreOptions,
    handleMoreAction,
    handleHold,
    clearCart,
    showDialog,
    navigateToPayment,
  } = usePOSController();

  const renderBillingUI = () => (
    <View style={styles.billingSection}>
      <MoreOptionsModal 
        visible={showMoreOptions} 
        onClose={() => setShowMoreOptions(false)} 
        onAction={handleMoreAction} 
      />

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
          <CustomButton
            onPress={() => showDialog('CUSTOMER_SELECTION', {})}
            variant="none" size="none" style={styles.iconButton}
            iconComponent={<FontAwesome6 name="user" size={18} color="white" />}
          />
          <CustomButton
            onPress={() => showDialog('SALESMAN_SELECTION', {})}
            variant="none" size="none" style={styles.iconButton}
            iconComponent={<FontAwesome6 name="user-tie" size={18} color="white" />}
          />
          <CustomButton
            onPress={() => showDialog('ADD_PRODUCT_BY', {})}
            variant="none" size="none" style={styles.iconButton}
            iconComponent={<FontAwesome6 name="barcode" size={20} color="white" />}
          />
          <CustomButton
            onPress={() => showDialog('SCAN_BARCODE_WEB', {})}
            variant="none" size="none" style={styles.scanButton}
            iconComponent={<FontAwesome6 name="expand" size={16} color="white" />}
            title="Scan Barcode" textStyle={styles.scanButtonText}
          />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.placeholderText}>Name/SKU/UPC</Text>
        </View>
      </View>

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
          <CustomButton
            onPress={() => setShowMoreOptions(true)}
            variant="none" size="none" style={styles.moreButton}
            iconComponent={<FontAwesome6 name="ellipsis-vertical" size={20} color="#6b7280" />}
          />

          <CustomButton
            title="Cancel" onPress={clearCart}
            variant="none" size="none" style={[styles.actionBtn, { backgroundColor: '#ff6b52' }]}
            textStyle={styles.btnText}
          />

          <CustomButton
            title={isHolding ? '...' : 'Hold'}
            onPress={handleHold} disabled={isHolding}
            variant="none" size="none" style={[styles.actionBtn, { backgroundColor: '#ffbb44' }]}
            textStyle={styles.btnText}
          />

          <CustomButton
            title="Order" onPress={() => { }}
            variant="none" size="none" style={[styles.actionBtn, { backgroundColor: '#7b1fa2' }]}
            textStyle={styles.btnText}
          />

          <CustomButton
            title="Payment" onPress={navigateToPayment}
            variant="none" size="none" style={[styles.actionBtn, { backgroundColor: '#0288d1' }]}
            textStyle={styles.btnText}
          />

          <TouchableOpacity style={styles.cashButton} onPress={() => handleMoreAction('print-invoice')}>
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
