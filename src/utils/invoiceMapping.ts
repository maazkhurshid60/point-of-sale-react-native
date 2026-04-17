import { useAuthStore } from "../store/useAuthStore";

/**
 * Standardizes any sale/invoice API response into a common structure
 * used by all slip dialogs (Invoices, Bills, etc.)
 */
export const formatSaleResponseToSlipData = (result: any) => {
  if (!result) return null;

  const authState = useAuthStore.getState();

  const saleDataRaw = Array.isArray(result.sale) ? result.sale[0] : (result.sale || result.quotation || result.cashSaleData?.sale || result.saleData || result);
  
  // Normalize numeric fields in saleData
  const saleData = {
    ...saleDataRaw,
    actual_bill: saleDataRaw?.actual_bill || saleDataRaw?.subtotal || 0,
    total_tax: saleDataRaw?.total_tax || saleDataRaw?.tax || 0,
    total_bill: saleDataRaw?.total_bill || saleDataRaw?.total || saleDataRaw?.amount || 0,
  };

  // 2. Items List
  const itemsRaw = result.sale_items || 
    result.saleItemsData ||
    result.sale_details || 
    result.products || 
    result.items || 
    saleDataRaw?.sale_items || 
    saleDataRaw?.sale_details || 
    result.cashSaleData?.sale?.sale_items ||
    [];

  const saleItemsData = Array.isArray(itemsRaw) ? itemsRaw.map((item: any) => ({
    ...item,
    sku: item.sku || item.product?.sku || '',
    product_name: item.product_name || item.name || item.product?.product_name || item.product?.name || '',
    name: item.name || item.product_name || item.product?.name || item.product?.product_name || '',
    price: item.price || item.selling_price || item.product?.selling_price || 0,
    subtotal: item.subtotal || item.total || 0,
  })) : [];

  // 3. Customer Mapping
  const customerData = result.customerData || 
    result.customer || 
    result.customer_details || 
    result.cashSaleData?.customer || 
    saleData?.customer || 
    { name: result.usersData?.customer_name || 'Walk-in-customer' };

  // 4. Company Mapping
  const companyData = result.companyData || 
    result.company || 
    result.business || 
    result.lead ||
    result.cashSaleData?.company || 
    authState.currentStore || 
    {};

  // 5. Salesman Mapping
  const salesmanData = result.salesmanData || 
    result.salesman || 
    result.sales_man || 
    result.sale_person || 
    result.cashSaleData?.salesman || 
    saleData?.salesman || 
    { name: result.usersData?.salesman_name || '' };

  // 6. Cashier Mapping
  const cashierData = result.cashierData || 
    result.cashier || 
    result.user || 
    saleData?.user || 
    result.cashSaleData?.cashier || 
    authState.currentUser || 
    { name: result.usersData?.sale_person || 'N/A' };

  // 7. Metadata (usersData)
  const usersData = {
    sale_person: cashierData?.name || cashierData?.first_name || result.usersData?.sale_person || 'N/A',
    customer_name: customerData?.name || customerData?.first_name || result.usersData?.customer_name || 'Walk-in-customer',
    customer_id: customerData?.customer_id || customerData?.id || result.usersData?.customer_id,
    salesman_name: salesmanData?.name || salesmanData?.first_name || result.usersData?.salesman_name || '',
    ...result.usersData
  };

  return {
    saleData,
    saleItemsData,
    customerData,
    companyData,
    salesmanData,
    cashierData,
    usersData,
    settings: result.settings,
    settingsInvoiceFields: result.settings?.invoice_fields || result.settingsInvoiceFields,
    ...result // Keep original fields as well for compatibility
  };
};
