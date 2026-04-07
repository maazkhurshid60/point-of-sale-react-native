// import { create } from 'zustand';
// import { KitchenOrder, KitchenProduct } from '../models';

// interface KitchenState {
//   orders: KitchenOrder[];
//   selectedWaiter: string;
//   selectedView: string;
//   isFilterMenuExpanded: boolean;
//   isChartsOpen: boolean;
//   isSummaryOpen: boolean;

//   // Actions
//   setOrders: (orders: KitchenOrder[]) => void;
//   updateOrderStatus: (orderId: number, status: KitchenOrder['status']) => void;
//   updateItemStatus: (orderId: number, productId: number, status: KitchenProduct['status']) => void;
//   setWaiter: (waiter: string) => void;
//   setView: (view: string) => void;
//   toggleFilterMenu: () => void;
//   toggleTabs: () => void;
  
//   // Computed (Getters)
//   getToDoOrders: () => KitchenOrder[];
//   getInProgressOrders: () => KitchenOrder[];
//   getDoneOrders: () => KitchenOrder[];
// }

// export const useKitchenStore = create<KitchenState>((set, get) => ({
//   orders: [],
//   selectedWaiter: 'All',
//   selectedView: 'All',
//   isFilterMenuExpanded: false,
//   isChartsOpen: true,
//   isSummaryOpen: false,

//   setOrders: (orders) => set({ orders }),

//   updateOrderStatus: (orderId, status) => {
//     set((state) => ({
//       orders: state.orders.map((order) =>
//         order.orderId === orderId ? { ...order, status } : order
//       ),
//     }));
//   },

//   updateItemStatus: (orderId, productId, status) => {
//     set((state) => ({
//       orders: state.orders.map((order) =>
//         order.orderId === orderId
//           ? {
//               ...order,
//               items: order.items.map((item) =>
//                 item.id === productId ? { ...item, status } : item
//               ),
//             }
//           : order
//       ),
//     }));
//   },

//   setWaiter: (waiter) => set({ selectedWaiter: waiter }),
//   setView: (view) => set({ selectedView: view }),
//   toggleFilterMenu: () => set((state) => ({ isFilterMenuExpanded: !state.isFilterMenuExpanded })),
  
//   toggleTabs: () => set((state) => ({
//     isChartsOpen: !state.isChartsOpen,
//     isSummaryOpen: !state.isSummaryOpen,
//   })),

//   // Computed filters
//   getToDoOrders: () => get().orders.filter((o) => o.status === 'pending'),
//   getInProgressOrders: () => get().orders.filter((o) => o.status === 'accepted'),
//   getDoneOrders: () => get().orders.filter((o) => o.status === 'done'),
// }));

// /**
//  * Mock Data Generator (Replicating addSomeData from Flutter)
//  */
// export const getMockKitchenOrders = (): KitchenOrder[] => {
//   const mockProducts: KitchenProduct[] = [
//     { id: 1, name: "Burger", categoryId: 1, price: 10.0, quntity: 2, status: 'pending' },
//     { id: 2, name: "Fries", categoryId: 1, price: 5.0, quntity: 1, status: 'pending' },
//   ];

//   return [
//     {
//       orderId: 1,
//       waiterName: "Azaz",
//       customerID: 101,
//       tableId: 1,
//       tableName: "Table 1",
//       createdTime: new Date().toISOString(),
//       items: mockProducts,
//       selected: false,
//       status: 'pending',
//     },
//     {
//       orderId: 2,
//       waiterName: "Ali",
//       customerID: 102,
//       tableId: 2,
//       tableName: "Table 2",
//       createdTime: new Date().toISOString(),
//       items: mockProducts.map(p => ({ ...p, id: p.id + 2 })),
//       selected: false,
//       status: 'accepted',
//     }
//   ];
// };
