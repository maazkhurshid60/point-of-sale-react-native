// import * as FileSystem from 'expo-file-system/legacy';
// import * as Sharing from 'expo-sharing';
// import * as DocumentPicker from 'expo-document-picker';
// import { OfflineSale } from '../models';
// // import { useOfflineSalesStore } from '../store/useOfflineSalesStore';

// export const exportOfflineSalesToJSON = async () => {
//   // const sales = useOfflineSalesStore.getState().sales;

//   if (sales.length === 0) {
//     throw new Error('No offline sales are available to download.');
//   }

//   const exportData = {
//     sales: sales,
//   };

//   const fileName = `Offline_Sales_Owners_POS_${new Date().getTime()}.json`;
//   const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

//   try {
//     const jsonContent = JSON.stringify(exportData, null, 2);
//     await FileSystem.writeAsStringAsync(fileUri, jsonContent, {
//       encoding: FileSystem.EncodingType.UTF8,
//     });

//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(fileUri, {
//         mimeType: 'application/json',
//         dialogTitle: 'Export Offline Sales',
//         UTI: 'public.json',
//       });
//     } else {
//       throw new Error('Sharing is not available on this device.');
//     }
//   } catch (error) {
//     console.error('Export failed:', error);
//     throw error;
//   }
// };

// export const importOfflineSalesFromJSON = async () => {
//   try {
//     const result = await DocumentPicker.getDocumentAsync({
//       type: 'application/json',
//       copyToCacheDirectory: true,
//     });

//     if (result.canceled) return null;

//     const fileUri = result.assets[0].uri;
//     const fileContent = await FileSystem.readAsStringAsync(fileUri);
//     const parsedData = JSON.parse(fileContent);

//     if (!parsedData.sales || !Array.isArray(parsedData.sales)) {
//       throw new Error('Invalid JSON file format. Missing "sales" array.');
//     }

//     const newSales: OfflineSale[] = [];
//     const requiredFields = [
//       'sale_id', 'shift_id', 'customer_id', 'total',
//       'sale_items', 'actual_products', 'created_at'
//     ];

//     for (const sale of parsedData.sales) {
//       const hasAllFields = requiredFields.every(field => field in sale);
//       if (hasAllFields) {
//         newSales.push(sale);
//       }
//     }

//     if (newSales.length === 0) {
//       throw new Error('No valid offline sales found in the file.');
//     }

//     // Merge into local store
//     const currentSales = useOfflineSalesStore.getState().sales;
//     const mergedSales = [...currentSales];

//     newSales.forEach(newSale => {
//       // Prevent duplicates by sale_id
//       if (!mergedSales.some(s => s.sale_id === newSale.sale_id)) {
//         mergedSales.push(newSale);
//       }
//     });

//     useOfflineSalesStore.setState({ sales: mergedSales });
//     return newSales.length;

//   } catch (error) {
//     console.error('Import failed:', error);
//     throw error;
//   }
// };
