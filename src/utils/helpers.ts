import { Dimensions, Platform } from 'react-native';
import { IMAGE_ASSETS } from '../constants/imageAssets';


export const S3_BUCKET_URL = 'https://ownerspos.s3.us-west-1.amazonaws.com';

export const TRANSFORM_DATE_TIME_TO_STRING = (date: Date, showMin = false) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (showMin) {
    return `${dateStr} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
  return dateStr;
};

export const IS_TABLET = () => {
  const { width, height } = Dimensions.get('window');
  const ratio = width / height;
  return ratio >= 0.75 && ratio <= 1.5;
};

export const IS_MOBILE = () => {
  const { width, height } = Dimensions.get('window');
  const ratio = width / height;
  return ratio < 0.75;
};

export const IS_WEB = () => {
  return Platform.OS === 'web';
};

export const DASHBOARD_SCREENS = [
  {
    id: 0,
    title: 'Point of Sale',
    description: 'Owners POS system can help boost your business and provide you with complete vision of the business insights',
    image: IMAGE_ASSETS.favicon,
    route: 'POS',
  },
  {
    id: 1,
    title: 'Reports',
    description: 'The Point of Sale Reports section provides comprehensive insights into sales transactions and revenue trends for informed business.',
    image: IMAGE_ASSETS.reports,
    route: 'Reports',
  },
  {
    id: 2,
    title: 'Orders',
    description: 'The Point of Sale Kitchen Order section efficiently manages and communicates orders from customers to the kitchen.',
    image: IMAGE_ASSETS.kitchenOrders,
    route: 'Orders',
  },
];

export const REPORTS_SCREENS = [
  {
    id: 0,
    title: 'Products Report',
    description: 'A comprehensive Point of Sale product report detailing sales, transactions, and inventory data for efficient business management.',
    image: IMAGE_ASSETS.productRep,
    route: 'ProductReport',
  },
  {
    id: 1,
    title: 'Invoice Payment Report',
    description: 'Invoice Report provide a concise report detailing payment transactions recorded in the Point of Sale invoice system.',
    image: IMAGE_ASSETS.invoiceRep,
    route: 'InvoiceReport',
  },
  {
    id: 2,
    title: 'Cashier Report',
    description: 'Cashier Report provides a summary of financial transactions processed by cashiers during a specific time period.',
    image: IMAGE_ASSETS.cashierRep,
    route: 'CashierReport',
  },
  {
    id: 3,
    title: 'Credit Sale Report',
    description: 'Credit Report provides a concise overview of credit transactions and payments made through a specific point of sale terminal or system.',
    image: IMAGE_ASSETS.creditRep,
    route: 'CreditReport',
  },
  {
    id: 4,
    title: 'Stock Warehouse Report',
    description: 'Comprehensive Warehouse Management Report providing detailed insights into inventory levels, movement, and storage efficiency.',
    image: IMAGE_ASSETS.warehouseRep,
    route: 'WarehouseReport',
  },
  {
    id: 5,
    title: 'Stock Store Report',
    description: 'Store Performance Report offering a comprehensive overview of sales, customer transactions, and inventory status.',
    image: IMAGE_ASSETS.storeRep,
    route: 'StoreReport',
  },
  {
    id: 6,
    title: 'Daily Cash Report',
    description: 'Store Performance Report offering a comprehensive overview of sales, customer transactions, and inventory status.',
    image: IMAGE_ASSETS.storeRep,
    route: 'DailyCashReport',
  },
];
