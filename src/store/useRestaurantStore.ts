// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FloorModel, TableModel, DecorationModel } from '../models';

// interface RestaurantState {
//   listOfFloors: FloorModel[];
//   listOfTables: TableModel[];
//   listOfDecorations: DecorationModel[];
//   currentFloorId: number;
  
//   // Actions
//   setCurrentFloor: (floorId: number) => void;
//   addFloor: (storeId: number) => void;
//   removeFloor: () => void;
//   updateFloor: (floorId: number, data: Partial<FloorModel>) => void;
  
//   addTable: (floorId: number) => void;
//   removeTable: (tableId: number) => void;
//   updateTable: (tableId: number, data: Partial<TableModel>) => void;
//   setSelectedTable: (tableId: number) => void;
  
//   addChair: (tableId: number) => void;
//   removeChair: (tableId: number) => void;
  
//   addDecoration: (floorId: number) => void;
//   removeDecoration: (id: number) => void;
//   updateDecoration: (id: number, data: Partial<DecorationModel>) => void;
  
//   resetRestaurantState: () => void;
// }

// export const useRestaurantStore = create<RestaurantState>()(
//   persist(
//     (set, get) => ({
//       listOfFloors: [{
//         floorId: 1,
//         floorName: "Floor 1",
//         storeid: 1,
//         floorNo: "1",
//         noOfTable: 10
//       }],
//       listOfTables: [],
//       listOfDecorations: [],
//       currentFloorId: 1,

//       setCurrentFloor: (floorId) => set({ currentFloorId: floorId }),

//       addFloor: (storeId) => {
//         const { listOfFloors } = get();
//         const nextId = listOfFloors.length + 1;
//         const newFloor: FloorModel = {
//           floorId: nextId,
//           floorName: `Floor ${nextId}`,
//           storeid: storeId,
//           floorNo: nextId.toString(),
//           noOfTable: 10
//         };
//         set({ 
//           listOfFloors: [...listOfFloors, newFloor],
//           currentFloorId: nextId
//         });
//       },

//       removeFloor: () => {
//         const { listOfFloors } = get();
//         if (listOfFloors.length > 1) {
//           const newList = [...listOfFloors];
//           newList.pop();
//           set({ 
//             listOfFloors: newList,
//             currentFloorId: newList[newList.length - 1].floorId
//           });
//         }
//       },

//       updateFloor: (floorId, data) => {
//         set({
//           listOfFloors: get().listOfFloors.map(f => f.floorId === floorId ? { ...f, ...data } : f)
//         });
//       },

//       addTable: (floorId) => {
//         const { listOfTables, listOfFloors } = get();
//         const floor = listOfFloors.find(f => f.floorId === floorId);
//         const floorTables = listOfTables.filter(t => t.floorid === floorId);
        
//         if (floor && floorTables.length >= floor.noOfTable) {
//           throw new Error(`Can't place more than ${floor.noOfTable} tables in each floor`);
//         }

//         const nextId = (Math.max(0, ...listOfTables.map(t => t.tableId))) + 1;
//         const newTable: TableModel = {
//           tableId: nextId,
//           tableName: `Table ${floorTables.length + 1}`,
//           floorid: floorId,
//           x: 50,
//           y: 50,
//           width: 80,
//           height: 80,
//           isRounded: false,
//           rotation: 0,
//           chairsCount: 0,
//           listofChairs: [0, 0, 0, 0],
//           isSelected: true
//         };

//         // Deselect others on this floor
//         const updatedTables = listOfTables.map(t => 
//           t.floorid === floorId ? { ...t, isSelected: false } : t
//         );

//         set({ listOfTables: [...updatedTables, newTable] });
//       },

//       removeTable: (tableId) => {
//         const { listOfTables } = get();
//         const updatedTables = listOfTables.filter(t => t.tableId !== tableId);
//         if (updatedTables.length > 0) {
//           const lastTable = updatedTables[updatedTables.length - 1];
//           lastTable.isSelected = true;
//         }
//         set({ listOfTables: updatedTables });
//       },

//       updateTable: (tableId, data) => {
//         set({
//           listOfTables: get().listOfTables.map(t => t.tableId === tableId ? { ...t, ...data } : t)
//         });
//       },

//       setSelectedTable: (tableId) => {
//         set({
//           listOfTables: get().listOfTables.map(t => ({
//             ...t,
//             isSelected: t.tableId === tableId
//           }))
//         });
//       },

//       addChair: (tableId) => {
//         const { listOfTables } = get();
//         const updatedTables = listOfTables.map(table => {
//           if (table.tableId === tableId) {
//             const list = [...table.listofChairs];
//             const total = table.chairsCount;

//             if (list.reduce((a, b) => a + b, 0) === 16) return table;

//             if (list.reduce((a, b) => a + b, 0) === 0) {
//               list[0] = 1;
//             } else {
//               // Sequence: [1,0,0,0] -> [1,1,0,0] -> [1,1,1,0] -> [1,1,1,1] -> [2,1,1,1] etc.
//               // Looking for first slot that is < 4
//               let index = 0;
//               if (list[0] === 1 && list[1] === 0) index = 1;
//               else if (list[1] === 1 && list[2] === 0) index = 2;
//               else if (list[2] === 1 && list[3] === 0) index = 3;
//               else {
//                 for (let i = 0; i < list.length; i++) {
//                   if (list[i] < 4) {
//                     index = i;
//                     break;
//                   }
//                 }
//               }
//               list[index]++;
//             }
//             return { ...table, listofChairs: list, chairsCount: total + 1 };
//           }
//           return table;
//         });
//         set({ listOfTables: updatedTables });
//       },

//       removeChair: (tableId) => {
//         const { listOfTables } = get();
//         const updatedTables = listOfTables.map(table => {
//           if (table.tableId === tableId && table.chairsCount > 0) {
//             const list = [...table.listofChairs];
//             let index = -1;
//             for (let i = 0; i < list.length; i++) {
//               if (list[i] > 0) {
//                 index = i;
//                 break;
//               }
//             }
//             if (index !== -1) {
//               list[index]--;
//               return { ...table, listofChairs: list, chairsCount: table.chairsCount - 1 };
//             }
//           }
//           return table;
//         });
//         set({ listOfTables: updatedTables });
//       },

//       addDecoration: (floorId) => {
//         const { listOfDecorations } = get();
//         const nextId = (Math.max(0, ...listOfDecorations.map(d => d.id))) + 1;
//         const newDec: DecorationModel = {
//           id: nextId,
//           floor: floorId,
//           title: "Leaf",
//           x: 100,
//           y: 100,
//           width: 50,
//           height: 50,
//           isSelected: true
//         };
//         const updated = listOfDecorations.map(d => ({ ...d, isSelected: false }));
//         set({ listOfDecorations: [...updated, newDec] });
//       },

//       removeDecoration: (id) => {
//         set({ listOfDecorations: get().listOfDecorations.filter(d => d.id !== id) });
//       },

//       updateDecoration: (id, data) => {
//         set({
//           listOfDecorations: get().listOfDecorations.map(d => d.id === id ? { ...d, ...data } : d)
//         });
//       },

//       resetRestaurantState: () => {
//         set({
//           listOfFloors: [{ floorId: 1, floorName: "Floor 1", storeid: 1, floorNo: "1", noOfTable: 10 }],
//           listOfTables: [],
//           listOfDecorations: [],
//           currentFloorId: 1
//         });
//       },
//     }),
//     {
//       name: 'restaurant-floor-storage',
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );
