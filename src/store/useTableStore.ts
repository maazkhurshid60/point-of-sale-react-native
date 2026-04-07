// import { create } from 'zustand';
// import { FloorModel, TableModel, DecorationModel } from '../models';

// interface TableState {
//   allFloors: FloorModel[];
//   allTables: TableModel[];
//   allDecorations: DecorationModel[];
//   currentFloor: FloorModel | null;
//   currentTable: TableModel | null;
//   currentDecoration: DecorationModel | null;
//   isTableLoading: boolean;

//   // Actions
//   addFloor: () => void;
//   removeFloor: () => void;
//   setCurrentFloor: (floor: FloorModel) => void;
//   changeFloorName: (name: string) => void;
//   changeFloorCapacity: (capacity: string) => void;

//   addTable: () => void;
//   removeTable: () => void;
//   setCurrentTable: (table: TableModel) => void;
//   updateTablePosition: (x: number, y: number) => void;
//   updateTableSize: (height: number, width: number) => void;
//   toggleTableRounded: () => void;
//   updateTableRotation: (rotation: number) => void;
//   updateTableName: (name: string) => void;

//   addChair: () => void;
//   removeChair: () => void;

//   addDecoration: () => void;
//   removeDecoration: () => void;
//   setCurrentDecoration: (decoration: DecorationModel) => void;
//   updateDecorationPosition: (x: number, y: number) => void;
//   updateDecorationSize: (height: number, width: number) => void;
//   updateDecorationName: (name: string) => void;

//   // Initialization Helper
//   initializeSomeData: () => void;
// }

// export const useTableStore = create<TableState>((set, get) => ({
//   allFloors: [],
//   allTables: [],
//   allDecorations: [],
//   currentFloor: null,
//   currentTable: null,
//   currentDecoration: null,
//   isTableLoading: false,

//   initializeSomeData: () => {
//     const defaultFloor: FloorModel = {
//       floorId: 1,
//       floorName: "Floor 1",
//       storeid: 1,
//       floorNo: "1",
//       noOfTable: 10
//     };
//     set({
//       allFloors: [defaultFloor],
//       currentFloor: defaultFloor
//     });
//   },

//   // --- Floor Management ---
//   addFloor: () => {
//     set((state) => {
//       const newId = state.allFloors.length + 1;
//       const newFloor: FloorModel = {
//         floorId: newId,
//         floorName: `Floor ${newId}`,
//         storeid: 1,
//         floorNo: newId.toString(),
//         noOfTable: 10,
//       };
//       const updatedFloors = [...state.allFloors, newFloor];
//       return {
//         allFloors: updatedFloors,
//         currentFloor: newFloor,
//       };
//     });
//   },

//   removeFloor: () => {
//     set((state) => {
//       if (state.allFloors.length <= 1) return state;
//       const updatedFloors = state.allFloors.slice(0, -1);
//       return {
//         allFloors: updatedFloors,
//         currentFloor: updatedFloors[0] || null,
//       };
//     });
//   },

//   setCurrentFloor: (floor) => {
//     set({ currentFloor: floor });
//   },

//   changeFloorName: (name) => {
//     set((state) => {
//       if (!state.currentFloor) return state;
//       const updatedFloor = { ...state.currentFloor, floorName: name };
//       return {
//         currentFloor: updatedFloor,
//         allFloors: state.allFloors.map(f => f.floorId === updatedFloor.floorId ? updatedFloor : f)
//       };
//     });
//   },

//   changeFloorCapacity: (capacity) => {
//     const cap = parseInt(capacity) || 0;
//     set((state) => {
//       if (!state.currentFloor) return state;
//       const updatedFloor = { ...state.currentFloor, noOfTable: cap };
//       return {
//         currentFloor: updatedFloor,
//         allFloors: state.allFloors.map(f => f.floorId === updatedFloor.floorId ? updatedFloor : f)
//       };
//     });
//   },

//   // --- Table Management ---
//   addTable: () => {
//     const { currentFloor, allTables } = get();
//     if (!currentFloor) return;

//     const tablesInFloor = allTables.filter(t => t.floorid === currentFloor.floorId);
//     if (tablesInFloor.length >= currentFloor.noOfTable) {
//         // Replicating snackbar warning - for now just return
//         return;
//     }

//     const newTable: TableModel = {
//       tableId: allTables.length + 1,
//       tableName: `Table ${tablesInFloor.length + 1}`,
//       floorid: currentFloor.floorId,
//       x: 0,
//       y: 0,
//       width: 0,
//       height: 0,
//       isRounded: false,
//       rotation: 0.0,
//       chairsCount: 0,
//       listofChairs: [0, 0, 0, 0],
//       isSelected: true,
//     };

//     set({
//       allTables: [...allTables, newTable],
//       currentTable: newTable
//     });
//   },

//   removeTable: () => {
//     set((state) => {
//       if (!state.currentTable) return state;
//       const updatedTables = state.allTables.filter(t => t.tableId !== state.currentTable?.tableId);
//       const floorTables = updatedTables.filter(t => t.floorid === state.currentFloor?.floorId);
      
//       return {
//         allTables: updatedTables,
//         currentTable: floorTables.length > 0 ? { ...floorTables[floorTables.length - 1], isSelected: true } : null,
//       };
//     });
//   },

//   setCurrentTable: (table) => {
//     set((state) => ({
//       allTables: state.allTables.map(t => ({
//         ...t,
//         isSelected: t.tableId === table.tableId
//       })),
//       currentTable: { ...table, isSelected: true }
//     }));
//   },

//   updateTablePosition: (x, y) => {
//     set((state) => {
//       if (!state.currentTable) return state;
//       const updatedTable = { ...state.currentTable, x, y };
//       return {
//         currentTable: updatedTable,
//         allTables: state.allTables.map(t => t.tableId === updatedTable.tableId ? updatedTable : t)
//       };
//     });
//   },

//   updateTableSize: (height, width) => {
//     set((state) => {
//       if (!state.currentTable) return state;
//       if (width <= 50 || height <= 50) return state;
//       const updatedTable = { ...state.currentTable, height, width };
//       return {
//         currentTable: updatedTable,
//         allTables: state.allTables.map(t => t.tableId === updatedTable.tableId ? updatedTable : t)
//       };
//     });
//   },

//   toggleTableRounded: () => {
//     set((state) => {
//       if (!state.currentTable) return state;
//       const updatedTable = { ...state.currentTable, isRounded: !state.currentTable.isRounded };
//       return {
//         currentTable: updatedTable,
//         allTables: state.allTables.map(t => t.tableId === updatedTable.tableId ? updatedTable : t)
//       };
//     });
//   },

//   updateTableRotation: (rotation) => {
//     set((state) => {
//       if (!state.currentTable) return state;
//       const updatedTable = { ...state.currentTable, rotation };
//       return {
//         currentTable: updatedTable,
//         allTables: state.allTables.map(t => t.tableId === updatedTable.tableId ? updatedTable : t)
//       };
//     });
//   },

//   updateTableName: (name) => {
//     set((state) => {
//       if (!state.currentTable) return state;
//       const updatedTable = { ...state.currentTable, tableName: name };
//       return {
//         currentTable: updatedTable,
//         allTables: state.allTables.map(t => t.tableId === updatedTable.tableId ? updatedTable : t)
//       };
//     });
//   },

//   // --- Chair Management ---
//   addChair: () => {
//     const { currentTable } = get();
//     if (!currentTable) return;

//     let listOfChairs = [...currentTable.listofChairs];
//     let totalChairsCount = currentTable.chairsCount;

//     const isEmptySpaceAvailable = listOfChairs.every(c => c === 0);
//     const isAllSpacesOccupied = listOfChairs.reduce((a, b) => a + b, 0) === 16;

//     if (isEmptySpaceAvailable) {
//       listOfChairs[0] += 1;
//       totalChairsCount += 1;
//     } else if (!isAllSpacesOccupied) {
//       if (listOfChairs[0] === 1 && listOfChairs[1] === 0 && listOfChairs[2] === 0 && listOfChairs[3] === 0) {
//         listOfChairs[1] += 1;
//       } else if (listOfChairs[0] === 1 && listOfChairs[1] === 1 && listOfChairs[2] === 0 && listOfChairs[3] === 0) {
//         listOfChairs[2] += 1;
//       } else if (listOfChairs[0] === 1 && listOfChairs[1] === 1 && listOfChairs[2] === 1 && listOfChairs[3] === 0) {
//         listOfChairs[3] += 1;
//       } else {
//         let index = listOfChairs.findIndex(c => c < 4);
//         if (index !== -1) listOfChairs[index] += 1;
//       }
//       totalChairsCount += 1;
//     }

//     const updatedTable = { ...currentTable, listofChairs: listOfChairs, chairsCount: totalChairsCount };
//     set((state) => ({
//       currentTable: updatedTable,
//       allTables: state.allTables.map(t => t.tableId === updatedTable.tableId ? updatedTable : t)
//     }));
//   },

//   removeChair: () => {
//     const { currentTable } = get();
//     if (!currentTable || currentTable.chairsCount === 0) return;

//     let listOfChairs = [...currentTable.listofChairs];
//     let totalChairsCount = currentTable.chairsCount;

//     let index = listOfChairs.findIndex(c => c > 0);
//     if (index !== -1) {
//       listOfChairs[index] -= 1;
//       totalChairsCount -= 1;
//     }

//     const updatedTable = { ...currentTable, listofChairs: listOfChairs, chairsCount: totalChairsCount };
//     set((state) => ({
//       currentTable: updatedTable,
//       allTables: state.allTables.map(t => t.tableId === updatedTable.tableId ? updatedTable : t)
//     }));
//   },

//   // --- Decoration Management ---
//   addDecoration: () => {
//     const { currentFloor, allDecorations } = get();
//     if (!currentFloor) return;

//     const newId = allDecorations.length + 1;
//     const newDeco: DecorationModel = {
//       id: newId,
//       floor: currentFloor.floorId,
//       title: "Leaf",
//       x: 0,
//       y: 0,
//       width: 0,
//       height: 0,
//       isSelected: true,
//       pic: "https://example.com/leaf.png" // Replace with actual default asset if known
//     };

//     set({
//       allDecorations: [...allDecorations, newDeco],
//       currentDecoration: newDeco
//     });
//   },

//   removeDecoration: () => {
//     set((state) => {
//       if (!state.currentDecoration) return state;
//       const updatedDecos = state.allDecorations.filter(d => d.id !== state.currentDecoration?.id);
//       const floorDecos = updatedDecos.filter(d => d.floor === state.currentFloor?.floorId);

//       return {
//         allDecorations: updatedDecos,
//         currentDecoration: floorDecos.length > 0 ? { ...floorDecos[floorDecos.length - 1], isSelected: true } : null,
//       };
//     });
//   },

//   setCurrentDecoration: (deco) => {
//     set((state) => ({
//       allDecorations: state.allDecorations.map(d => ({
//         ...d,
//         isSelected: d.id === deco.id
//       })),
//       currentDecoration: { ...deco, isSelected: true }
//     }));
//   },

//   updateDecorationPosition: (x, y) => {
//     set((state) => {
//       if (!state.currentDecoration) return state;
//       const updatedDeco = { ...state.currentDecoration, x, y };
//       return {
//         currentDecoration: updatedDeco,
//         allDecorations: state.allDecorations.map(d => d.id === updatedDeco.id ? updatedDeco : d)
//       };
//     });
//   },

//   updateDecorationSize: (height, width) => {
//     set((state) => {
//       if (!state.currentDecoration) return state;
//       if (width <= 30 || height <= 30) return state;
//       const updatedDeco = { ...state.currentDecoration, height, width };
//       return {
//         currentDecoration: updatedDeco,
//         allDecorations: state.allDecorations.map(d => d.id === updatedDeco.id ? updatedDeco : d)
//       };
//     });
//   },

//   updateDecorationName: (name) => {
//     set((state) => {
//       if (!state.currentDecoration) return state;
//       const updatedDeco = { ...state.currentDecoration, title: name };
//       return {
//         currentDecoration: updatedDeco,
//         allDecorations: state.allDecorations.map(d => d.id === updatedDeco.id ? updatedDeco : d)
//       };
//     });
//   }
// }));
