import { useUIStore, AppScreen } from '../../../store/useUIStore';

export const useReportsMenuController = () => {
  const setScreen = useUIStore((state) => state.setScreen);

  const reports = [
    {
      id: 0,
      title: 'Products Report',
      description: 'Detailed insights into sales transactions and inventory movements.',
      imagePath: require('../../../../assets/images/product_rep.png'),
      screen: 'PRODUCT_REPORT' as AppScreen,
    },
    {
      id: 1,
      title: 'Invoice Payment Report',
      description: 'Track payment transactions and records within your POS system.',
      imagePath: require('../../../../assets/images/invoice_rep.png'),
      screen: 'INVOICE_REPORT' as AppScreen,
    },
    {
      id: 2,
      title: 'Cashier Performance',
      description: 'Summarized financial metrics processed by individual cashiers.',
      imagePath: require('../../../../assets/images/cashier_rep.png'),
      screen: 'CASHIER_REPORT' as AppScreen,
    },
    {
      id: 3,
      title: 'Credit Sale Report',
      description: 'Concise overview of credit-based transactions and collections.',
      imagePath: require('../../../../assets/images/credit_rep.png'),
      screen: 'CREDIT_REPORT' as AppScreen,
    },
    {
      id: 4,
      title: 'Warehouse Stock',
      description: 'Inventory levels and logistics across your primary warehouses.',
      imagePath: require('../../../../assets/images/warehouse_rep.png'),
      screen: 'WAREHOUSE_REPORT' as AppScreen,
    },
    {
      id: 5,
      title: 'Store Inventory',
      description: 'Direct visibility into stock levels at your local branch.',
      imagePath: require('../../../../assets/images/store_rep.png'),
      screen: 'STORE_REPORT' as AppScreen,
    },
    {
      id: 6,
      title: 'Daily Cash Flow',
      description: 'Daily operational summary of sales and customer transactions.',
      imagePath: require('../../../../assets/images/store_rep.png'),
      screen: 'DAILY_REPORT' as AppScreen,
    },
  ];

  return {
    reports,
    setScreen,
  };
};
