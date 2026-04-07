export * from './chat';
export interface Store {
  store_id: number;
  name: string;
  address?: string;
}

export interface POSId {
  fbr_pos_id: string;
  name: string;
}

export interface ShiftDetails {
  shift_id: number;
  store: Store;
  default_cash_account?: number;
  default_bank_account?: number;
  default_card_account?: number;
  salesman_id?: number;
}

export interface TaxModel {
  tax_id: number;
  name: string;
  tax: number;
  status?: boolean;
}

export interface ProductModel {
  product_id: number;
  product_name: string;
  product_brand?: string;
  product_type?: string;
  barcode: number;
  sku?: string;
  unit?: string;
  taxable: boolean;
  product_status: string;
  rack_no?: string;
  image?: string;
  discount?: any;
  alert_qty?: any;
  alert_qty_warehouse?: any;
  expiry_date?: string;
  product_details?: string;
  has_variant: boolean;
  group_id?: number;
  head_name?: string;
  head?: string;
  child_name?: string;
  child?: string;
  pos_platform: boolean;
  ecommerce_platform?: boolean;
  purchase_price: number;
  selling_price: number;
  whole_sale_price: number;
  default_supplier?: number;
  token_amount?: number;
  cat_id: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string;
  compare_at?: string;
  countinue_selling?: string;
  image_type?: string;
  online_category_id?: string;
  featured?: number;
  is_featured: boolean;
  slug?: string;
  meta_title?: string;
  meta_keyword?: string;
  meta_description?: string;
  design?: string;
  mfg_date?: string;
  made_in?: string;
  speed_limit?: string;
  stores?: any;
  productasset?: any;
  hs_code?: string;
  count: {
    total: number;
    [key: string]: any;
  };
}

export interface CartItemModel {
  product_id: number;
  product_name: string;
  product: ProductModel;
  quantity: number;
  selling_price: number;
  discount: number;
}

export interface CashAccount {
  id: number;
  name: string;
  status: boolean;
}

export interface BankAccount {
  id: number;
  name: string;
}

export interface CreditCardAccount {
  id: number;
  name: string;
}

export interface Customer {
  customer_id: number;
  name: string;
  mobile?: string;
}

export interface Salesman {
  user_id: number;
  name: string;
}

export interface Coupon {
  coupon_id: number;
  coupon_number: string;
  coupon_amount: string;
  coupon_amount_left?: string;
  coupon_amount_formated?: string;
  status?: string;
}

export interface AccountHead {
  id: number;
  name: string;
}

export interface POAccount {
  purchaseId: number;
  purchaseInvoice?: string;
}

export interface OfflineSaleItem {
  product_id: number;
  barcode: string | number;
  qty: number;
  price: number;
  total: number;
  tax?: number;
  discount?: number;
}

export interface OfflineSale {
  sale_id: number;
  discount_type: string;
  discount_policy: string;
  shift_id: number;
  customer_id: number;
  total: number;
  cash_account_id: number;
  store_id: number;
  cash_amount: number;
  overall_discount: number;
  overall_tax: number;
  salesman_id: number;
  draft_id: number | string;
  sale_items: OfflineSaleItem[];
  actual_products: ProductModel[];
  created_at: string;
}

export interface PaymentMethod {
  id: number;
  amount: number;
  method: string;
  account_id: number | null;
  type: 'Payment' | 'Refund';
  ref: string | null;
}

export interface SoftwareSettings {
  software_setting_id: number;
  invoice_serial_no: number;
  discount_type: 'amount' | 'percentage';
  discount_policy: 'overall' | 'product-wise' | 'discounted_price';
  tax_enabled: boolean;
  pos_screen_layout?: string;
  rounding?: 'no' | 'next' | 'floor';
  [key: string]: any;
}

export interface TicketData {
  crtStoreName: string;
  crtStoreCompleteAddress: string;
  crtStoreContact: string;
  date: string;
  customerName: string;
  customerId: string;
  saleId: string;
  userName: string;
  salesmanName: string;
  ticketNo: string;
  subtotal: string;
  totalTax: string;
  totalBill: string;
  totalDiscount: string;
  amountPaid: string;
  balance: string;
  saleItems: string[][];
  tax: string;
}

export interface InvoiceData {
  saleData: any;
  saleItemsData: any[];
  salesmanData: any;
  cashierData: any;
  customerData: any;
  companyData: any;
  settingsInvoiceFields: any;
}

export interface CategoryModel {
  cat_id: number | string;
  cat_name: string;
  parent: number;
  image?: string;
  status?: boolean;
}

export interface FloorModel {
  floorId: number;
  floorName: string;
  storeid: number;
  floorNo: string;
  noOfTable: number;
}

export interface TableModel {
  tableId: number;
  tableName: string;
  floorid: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isRounded: boolean;
  rotation: number;
  chairsCount: number;
  listofChairs: number[]; // [side1, side2, side3, side4]
  isSelected: boolean;
}

export interface DecorationModel {
  id: number;
  floor: number;
  title: string;
  pic?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
}

export interface SaleHistoryItem {
  sale_id: number;
  customer_id: number;
  created_at: string;
  total_bill: number;
  total_tax: number;
  total_discount: number;
  amount_paid: number;
  balance: number;
  actual_bill: number;
}

export interface SaleDetails {
  sale: any;
  sale_items: any[];
  customer: any;
  user: any;
  salesman?: any;
  company?: any;
  settings?: any;
}

export interface KitchenProduct {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  quntity: number;
  pic?: string;
  status: 'pending' | 'accepted' | 'done';
}

export interface KitchenOrder {
  orderId: number;
  waiterName: string;
  customerID: number;
  tableId: number;
  createdTime: string;
  items: KitchenProduct[];
  selected: boolean;
  status: 'pending' | 'accepted' | 'done' | '';
  tableName: string;
}
