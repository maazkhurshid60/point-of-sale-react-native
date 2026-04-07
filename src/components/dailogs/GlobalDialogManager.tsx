// import React from 'react';
// import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
// import { useDialogStore, DialogType } from '../../store/useDialogStore';

// // Import dialog components
// import ErrorDialog from './ErrorDialog';
// import CustomProductQuantityModal from './AddCustomProductQuantityDialog';
// import WebNotificationDialogbox from './WebNotificationDialogbox';
// import AddDiscountDialog from './AddDiscountDialog';
// import OpenShiftDialog from './OpenShiftDialog';
// import CloseShiftDialog from './CloseShiftDialog';
// import CustomerDialog from './CustomerDialog';
// import SalesmanDialog from './SalesmanDialog';
// import ApplyCouponDialog from './ApplyCouponDialog';
// import HoldSalesDialog from './HoldSalesDialog';
// import TaxDialog from './TaxDialog';
// import AddProductByDialog from './AddProductByDialog';
// import CashManagementDialog from './CashManagementDialog';
// import PosExpenseDialog from './PosExpenseDialog';
// import InvoiceDialog from './InvoiceDialog';
// import QuotationDialog from './QuotationDialog';
// import GoodsDeliverySlipDialog from './GoodsDeliverySlipDialog';
// import GoodsIssuanceSlipDialog from './GoodsIssuanceSlipDialog';
// import SampleSaleSlipDialog from './SampleSaleSlipDialog';
// import RawBillPrintDialog from './RawBillPrintDialog';
// import UploadOfflineSalesDialog from './UploadOfflineSalesDialog';
// import DashboardHelpDialog from './DashboardHelpDialog';
// import GenerateCouponDialog from './GenerateCouponDialog';
// import HelpDialog from './HelpDialog';
// import PersonalProfileDialog from './PersonalProfileDialog';
// import PosSettingsDialog from './PosSettingsDialog';
// import ProductDetailsDialog from './ProductDetailsDialog';
// import RestaurantHelpDialog from './RestaurantHelpDialog';
// import ScanBarcodeForWebDialog from './ScanBarcodeForWebDialog';

// const DialogComponents: Record<DialogType, any> = {
//   ERROR: ErrorDialog,
//   CUSTOM_QTY: CustomProductQuantityModal,
//   WEB_NOTIFICATION: WebNotificationDialogbox,
//   ADD_DISCOUNT: AddDiscountDialog,
//   OPEN_SHIFT: OpenShiftDialog,
//   CLOSE_SHIFT: CloseShiftDialog,
//   CUSTOMER_SELECTION: CustomerDialog,
//   SALESMAN_SELECTION: SalesmanDialog,
//   APPLY_COUPON: ApplyCouponDialog,
//   HOLD_SALES: HoldSalesDialog,
//   TAX_SELECTION: TaxDialog,
//   ADD_PRODUCT_BY: AddProductByDialog,
//   CASH_MANAGEMENT: CashManagementDialog,
//   POS_EXPENSE: PosExpenseDialog,
//   INVOICE_SLIP: InvoiceDialog,
//   QUOTATION_SLIP: QuotationDialog,
//   GOODS_DELIVERY_SLIP: GoodsDeliverySlipDialog,
//   GOODS_ISSUANCE_SLIP: GoodsIssuanceSlipDialog,
//   SAMPLE_SALE_SLIP: SampleSaleSlipDialog,
//   RAW_BILL_SLIP: RawBillPrintDialog,
//   UPLOAD_OFFLINE_SALES: UploadOfflineSalesDialog,
//   DASHBOARD_HELP: DashboardHelpDialog,
//   GENERATE_COUPON: GenerateCouponDialog,
//   HELP: HelpDialog,
//   PERSONAL_PROFILE: PersonalProfileDialog,
//   POS_SETTINGS: PosSettingsDialog,
//   PRODUCT_DETAILS: ProductDetailsDialog,
//   RESTAURANT_HELP: RestaurantHelpDialog,
//   SCAN_BARCODE_WEB: ScanBarcodeForWebDialog,
// };

// export default function GlobalDialogManager() {
//   const { activeDialog, dialogProps, hideDialog } = useDialogStore();

//   if (!activeDialog) return null;

//   const ActiveComponent = DialogComponents[activeDialog as DialogType];
//   if (!ActiveComponent) {
//     console.warn(`No component found for dialog type: ${activeDialog}`);
//     return null;
//   }

//   return (
//     <ActiveComponent {...dialogProps} visible={!!activeDialog} onClose={hideDialog} />
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
