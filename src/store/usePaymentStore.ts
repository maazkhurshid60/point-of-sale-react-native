// import { create } from 'zustand';
// import { PaymentMethod } from '../models';

// interface PaymentState {
//   totalBill: number;
//   totalPaid: number;
//   totalBalance: number;
//   physicalInvoiceNo: string;
//   invoiceString: string;
//   invoiceNote: string;
//   invoiceDate: string;
//   paymentMethodsList: PaymentMethod[];
//   isPaidFieldEnabled: boolean;
//   isCouponPartialSale: boolean;

//   // Actions
//   setPaymentScreenValues: (totalBill: number, totalBalance: number) => void;
//   resetPaymentState: () => void;
//   addPaymentMethod: (method: string, amount: number, accountId: number | null) => void;
//   updatePaymentMethodAmount: (id: number, amount: number) => void;
//   deletePaymentMethod: (id: number) => void;
//   changePaidAmount: (amount: string, isFromPaidField: boolean) => void;
//   setInvoiceMetadata: (metadata: Partial<{ physicalInvoiceNo: string; invoiceString: string; invoiceNote: string; invoiceDate: string }>) => void;
//   setCouponPartialSale: (status: boolean) => void;
// }

// export const usePaymentStore = create<PaymentState>((set, get) => ({
//   totalBill: 0,
//   totalPaid: 0,
//   totalBalance: 0,
//   physicalInvoiceNo: '',
//   invoiceString: '',
//   invoiceNote: '',
//   invoiceDate: new Date().toISOString(),
//   paymentMethodsList: [],
//   isPaidFieldEnabled: true,
//   isCouponPartialSale: false,

//   setPaymentScreenValues: (totalBill, totalBalance) => {
//     set({
//       totalBill,
//       totalBalance,
//       invoiceDate: new Date().toISOString(),
//       paymentMethodsList: [],
//       totalPaid: 0,
//     });
//   },

//   resetPaymentState: () => {
//     set({
//       totalBill: 0,
//       totalPaid: 0,
//       totalBalance: 0,
//       physicalInvoiceNo: '',
//       invoiceString: '',
//       invoiceNote: '',
//       paymentMethodsList: [],
//       isPaidFieldEnabled: true,
//       isCouponPartialSale: false,
//     });
//   },

//   addPaymentMethod: (method, amount, accountId) => {
//     const { paymentMethodsList, totalBill } = get();
//     const newMethod: PaymentMethod = {
//       id: paymentMethodsList.length + 1,
//       method,
//       amount,
//       account_id: accountId,
//       type: amount >= 0 ? 'Payment' : 'Refund',
//       ref: null,
//     };

//     const newList = [...paymentMethodsList, newMethod];
//     const newTotalPaid = newList.reduce((sum, item) => sum + item.amount, 0);

//     set({
//       paymentMethodsList: newList,
//       totalPaid: newTotalPaid,
//       totalBalance: totalBill - newTotalPaid,
//       isPaidFieldEnabled: false,
//     });
//   },

//   updatePaymentMethodAmount: (id, amount) => {
//     const { paymentMethodsList, totalBill } = get();
//     const newList = paymentMethodsList.map((m) =>
//       m.id === id ? { ...m, amount, type: amount >= 0 ? ('Payment' as const) : ('Refund' as const) } : m
//     );
//     const newTotalPaid = newList.reduce((sum, item) => sum + item.amount, 0);

//     set({
//       paymentMethodsList: newList,
//       totalPaid: newTotalPaid,
//       totalBalance: totalBill - newTotalPaid,
//     });
//   },

//   deletePaymentMethod: (id) => {
//     const { paymentMethodsList, totalBill } = get();
//     const newList = paymentMethodsList.filter((m) => m.id !== id);
//     const newTotalPaid = newList.reduce((sum, item) => sum + item.amount, 0);

//     set({
//       paymentMethodsList: newList,
//       totalPaid: newTotalPaid,
//       totalBalance: totalBill - newTotalPaid,
//       isPaidFieldEnabled: newList.length === 0,
//     });
//   },

//   changePaidAmount: (amountStr, isFromPaidField) => {
//     const amount = parseFloat(amountStr) || 0;
//     const { paymentMethodsList, totalBill } = get();

//     if (paymentMethodsList.length === 0) {
//       // Logic from Flutter: if empty, add Cash method automatically
//       get().addPaymentMethod('Cash', amount, null);
//     } else if (paymentMethodsList.length === 1 && paymentMethodsList[0].method === 'Cash') {
//       // If only one method and it's Cash, update its amount
//       get().updatePaymentMethodAmount(paymentMethodsList[0].id, amount);
//     } else if (isFromPaidField) {
//       // If multiple methods but user edits the main "Paid" field, reset and use Cash
//       set({ paymentMethodsList: [] });
//       get().addPaymentMethod('Cash', amount, null);
//     }
//   },

//   setInvoiceMetadata: (metadata) => {
//     set((state) => ({ ...state, ...metadata }));
//   },

//   setCouponPartialSale: (status) => {
//     set({ isCouponPartialSale: status });
//   },
// }));
