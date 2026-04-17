import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import type { DialogType } from '../../store/useDialogStore';
import { useDialogStore } from '../../store/useDialogStore';
import ErrorDialog from './ErrorDialog';
import CustomProductQuantityModal from './AddCustomProductQuantityDialog';
import WebNotificationDialogbox from './WebNotificationDialogbox';
import AddDiscountDialog from './AddDiscountDialog';
import OpenShiftDialog from './OpenShiftDialog';
import CloseShiftDialog from './CloseShiftDialog';
import CashManagementDialog from './CashManagementDialog';
import InvoiceDialog from './InvoiceDialog';
import GoodsDeliverySlipDialog from './GoodsDeliverySlipDialog';
import GoodsIssuanceSlipDialog from './GoodsIssuanceSlipDialog';
import SampleSaleSlipDialog from './SampleSaleSlipDialog';
import QuotationDialog from './QuotationDialog';
import RawBillPrintDialog from './RawBillPrintDialog';
import TicketDialog from './TicketDialog';
import AddProductByDialog from './AddProductByDialog';
import ScanBarcodeForWebDialog from './ScanBarcodeForWebDialog';
import SalesmanDialog from './SalesmanDialog';
import CustomerDialog from './CustomerDialog';
import GenerateCouponDialog from './GenerateCouponDialog';

// DialogComponents uses Partial to allow for incremental migration and to avoid ReferenceErrors
// for components that are defined inDialogType but not yet imported/implemented here.
const DialogComponents: Partial<Record<DialogType, any>> = {
  ERROR: ErrorDialog,
  CUSTOM_QTY: CustomProductQuantityModal,
  WEB_NOTIFICATION: WebNotificationDialogbox,
  ADD_DISCOUNT: AddDiscountDialog,
  OPEN_SHIFT: OpenShiftDialog,
  CLOSE_SHIFT: CloseShiftDialog,
  CASH_MANAGEMENT: CashManagementDialog,
  INVOICE_SLIP: InvoiceDialog,
  GOODS_DELIVERY_SLIP: GoodsDeliverySlipDialog,
  GOODS_ISSUANCE_SLIP: GoodsIssuanceSlipDialog,
  SAMPLE_SALE_SLIP: SampleSaleSlipDialog,
  QUOTATION_SLIP: QuotationDialog,
  RAW_BILL_SLIP: RawBillPrintDialog,
  TICKET_SLIP: TicketDialog,
  ADD_PRODUCT_BY: AddProductByDialog,
  SCAN_BARCODE_WEB: ScanBarcodeForWebDialog,
  SALESMAN_SELECTION: SalesmanDialog,
  CUSTOMER_SELECTION: CustomerDialog,
  GENERATE_COUPON: GenerateCouponDialog,
};

export default function GlobalDialogManager() {
  const { activeDialog, dialogProps, hideDialog } = useDialogStore();

  if (!activeDialog) return null;

  const ActiveComponent = DialogComponents[activeDialog as DialogType];
  if (!ActiveComponent) {
    console.warn(`No component found for dialog type: ${activeDialog}`);
    return null;
  }

  // Open Shift is usually non-dismissable to force the user to open a shift
  const isDismissable = activeDialog !== 'OPEN_SHIFT';

  return (
    <Modal
      visible={!!activeDialog}
      transparent
      animationType="fade"
      onRequestClose={isDismissable ? hideDialog : undefined}
      statusBarTranslucent
    >
      {/* 
        Pattern: Absolute backdrop (handles dismiss tap) + independent dialog container.
        This avoids ALL gesture responder conflicts with ScrollViews inside dialog content.
      */}
      <View style={styles.overlay}>
        {/* Backdrop — tapping it dismisses the dialog */}
        {isDismissable && (
          <TouchableWithoutFeedback onPress={hideDialog}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
        )}
        {/* Dialog content — no gesture wrappers, ScrollView works freely */}
        <View style={styles.container} pointerEvents="box-none">
          <ActiveComponent {...dialogProps} onClose={hideDialog} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxHeight: '95%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
