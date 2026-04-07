// import { create } from 'zustand';
// import { ProductModel, CartItemModel, Customer, Salesman, Coupon } from '../models';

// export interface BaseSlipData {
//   companyData?: any;
//   saleData?: any;
//   customerData?: any;
//   salesmanData?: any;
//   cashierData?: any;
//   saleItemsData?: any[];
//   [key: string]: any;
// }

// export type DialogType = 
//   | 'ERROR' 
//   | 'CUSTOM_QTY' 
//   | 'ADD_DISCOUNT' 
//   | 'WEB_NOTIFICATION' 
//   | 'OPEN_SHIFT'
//   | 'CLOSE_SHIFT'
//   | 'CUSTOMER_SELECTION'
//   | 'SALESMAN_SELECTION'
//   | 'APPLY_COUPON'
//   | 'HOLD_SALES'
//   | 'TAX_SELECTION'
//   | 'ADD_PRODUCT_BY'
//   | 'CASH_MANAGEMENT'
//   | 'POS_EXPENSE'
//   | 'INVOICE_SLIP'
//   | 'QUOTATION_SLIP'
//   | 'GOODS_DELIVERY_SLIP'
//   | 'GOODS_ISSUANCE_SLIP'
//   | 'SAMPLE_SALE_SLIP'
//   | 'RAW_BILL_SLIP'
//   | 'UPLOAD_OFFLINE_SALES'
//   | 'DASHBOARD_HELP'
//   | 'GENERATE_COUPON'
//   | 'HELP'
//   | 'PERSONAL_PROFILE'
//   | 'POS_SETTINGS'
//   | 'PRODUCT_DETAILS'
//   | 'RESTAURANT_HELP'
//   | 'SCAN_BARCODE_WEB';

// // Define expected props for each dialog type
// export interface DialogDataMap {
//   ERROR: { errorMessage: string; onClose?: () => void };
//   CUSTOM_QTY: { product: ProductModel };
//   ADD_DISCOUNT: { cartItem: CartItemModel };
//   WEB_NOTIFICATION: { message: string; title?: string };
//   OPEN_SHIFT: { onOpen?: (amount: number) => void };
//   CLOSE_SHIFT: { onConfirm?: (amount: number) => void };
//   CUSTOMER_SELECTION: { onSelect?: (customer: Customer) => void };
//   SALESMAN_SELECTION: { onSelect?: (salesman: Salesman) => void };
//   APPLY_COUPON: { onApply?: (coupon: Coupon) => void };
//   HOLD_SALES: { onHold?: (tag: string) => void };
//   TAX_SELECTION: { onApply?: () => void };
//   ADD_PRODUCT_BY: { onAdd?: () => void };
//   CASH_MANAGEMENT: { onSuccess?: (success: boolean) => void };
//   POS_EXPENSE: { onSuccess?: () => void };
//   INVOICE_SLIP: { slipData: BaseSlipData; onClose?: () => void };
//   QUOTATION_SLIP: { slipData: BaseSlipData; onClose?: () => void };
//   GOODS_DELIVERY_SLIP: { slipData: BaseSlipData; onClose?: () => void };
//   GOODS_ISSUANCE_SLIP: { slipData: BaseSlipData; onClose?: () => void };
//   SAMPLE_SALE_SLIP: { slipData: BaseSlipData; onClose?: () => void };
//   RAW_BILL_SLIP: { slipData: BaseSlipData; onClose?: () => void };
//   UPLOAD_OFFLINE_SALES: { onClose?: () => void };
//   DASHBOARD_HELP: { onClose?: () => void };
//   GENERATE_COUPON: { onGenerate?: (coupon: Coupon) => void };
//   HELP: { onClose?: () => void };
//   PERSONAL_PROFILE: { onClose?: () => void };
//   POS_SETTINGS: { onUpdate?: () => void };
//   PRODUCT_DETAILS: { productId: number; onClose?: () => void };
//   RESTAURANT_HELP: { onClose?: () => void };
//   SCAN_BARCODE_WEB: { onScan?: (keyword: string) => void };
// }

// interface DialogState<T extends DialogType = any> {
//   activeDialog: T | null;
//   dialogProps: DialogDataMap[T] | null;
  
//   // Actions
//   showDialog: <K extends DialogType>(type: K, props: DialogDataMap[K]) => void;
//   hideDialog: () => void;
// }

// export const useDialogStore = create<DialogState>((set) => ({
//   activeDialog: null,
//   dialogProps: null,

//   showDialog: (type, props) => {
//     set({
//       activeDialog: type,
//       dialogProps: props,
//     });
//   },

//   hideDialog: () => {
//     set({
//       activeDialog: null,
//       dialogProps: null,
//     });
//   },
// }));
