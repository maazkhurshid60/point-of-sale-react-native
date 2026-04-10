import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, FlatList } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BaseSlipData } from '../../store/useDialogStore';
import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';

interface InvoiceDialogProps {
  slipData: BaseSlipData;
  onClose?: () => void;
}

export default function InvoiceDialog({ slipData, onClose }: InvoiceDialogProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const handlePrint = () => {
    // Printing to be implemented later or via a separate print service
    console.log('Print invoice functionality to be implemented');
  };

  const renderProductRow = (item: any, index: number) => (
    <View key={index} style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.product?.sku || item.sku || item.barcode || ''}</Text>
      <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={1}>
        {item.product?.product_name || item.product_name || item.product?.name || item.name || ''}
      </Text>
      <Text style={[styles.tableCell, styles.cellBold]}>{item.qty || item.quantity || 0}</Text>
      <Text style={[styles.tableCell, styles.cellBold]}>{item.price || item.actual_price || item.selling_price || item.unit_price || 0}</Text>
      <Text style={[styles.tableCell, styles.cellBold]}>{item.discount || 0}</Text>
      <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{item.subtotal || 0}</Text>
    </View>
  );

  const customerName = slipData.customerData?.name ||
    (slipData.customerData?.first_name ? `${slipData.customerData.first_name} ${slipData.customerData.last_name || ''}` : 'N/A');

  const salesmanName = slipData.salesmanData?.name ||
    (slipData.salesmanData?.first_name ? `${slipData.salesmanData.first_name} ${slipData.salesmanData.last_name || ''}` : 'N/A');

  return (
    <View style={[styles.dialogCard, { width: isPortrait ? '95%' : 910, maxHeight: isPortrait ? height * 0.9 : 700 }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={styles.title}>Sale Invoice</Text>

        {/* Header Information */}
        <View style={styles.headerBlock}>
          <View style={styles.headerRow}>
            <Text style={styles.companyName} numberOfLines={1}>{slipData.companyData?.company_name || 'Owner Inventory'}</Text>
            <Text style={styles.issuedAt}>
              <Text style={{ fontWeight: '400' }}>Issued at: </Text>
              {slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at), true) : ''}
            </Text>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.companyAddress} numberOfLines={1}>
              {slipData.companyData?.lead_street || slipData.companyData?.street || ''} {slipData.companyData?.lead_city || slipData.companyData?.city || ''}
            </Text>
            <Text style={styles.billTo}>Bill to: </Text>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.companyContact}>{slipData.companyData?.lead_contact || slipData.companyData?.mobile || 'N/A'}</Text>
            <View style={{ alignItems: 'flex-end', flex: 1.5 }}>
              <Text style={styles.customerAddress} numberOfLines={1}>
                Address: {slipData.customerData?.company_street || slipData.customerData?.street || ''} {slipData.customerData?.company_city || slipData.customerData?.city || ''}
              </Text>
              <Text style={styles.customerText} numberOfLines={1}>
                Name: {customerName}
              </Text>
              <Text style={styles.customerText}>ID: {slipData.customerData?.customer_id || slipData.customerData?.id || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.headerRow}>
            <View />
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.customerText} numberOfLines={1}>Salesman: {salesmanName}</Text>
              <Text style={styles.customerText}>Salesman ID: {slipData.salesmanData?.user_id || slipData.salesmanData?.id || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Invoice Banner Info */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            <Text style={{ fontWeight: '400' }}>Invoice No: </Text>
            {slipData.saleData?.invoice_no || 'N/A'}
          </Text>
          <Text style={styles.infoBannerText}>
            <Text style={{ fontWeight: '400' }}>Cashier: </Text>
            {slipData.cashierData?.name || slipData.cashierData?.first_name || 'N/A'}
          </Text>
          <Text style={styles.infoBannerText}>
            <Text style={{ fontWeight: '400' }}>Status: </Text>
            {slipData.saleData?.status || slipData.saleData?.payment_status || ''}
          </Text>
        </View>

        {/* Product Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>SKU</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Product</Text>
            <Text style={[styles.tableHeaderText, { textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.tableHeaderText, { textAlign: 'center' }]}>Price</Text>
            <Text style={[styles.tableHeaderText, { textAlign: 'center' }]}>Disc</Text>
            <Text style={[styles.tableHeaderText, { textAlign: 'right' }]}>Total</Text>
          </View>

          {(slipData.saleItemsData || []).map((item, index) => renderProductRow(item, index))}

          {/* Footer Rows */}
          <View style={styles.tableFooterRow}>
            <Text style={{ flex: 6.5 }}></Text>
            <Text style={[styles.tableCell, styles.cellBold]}>Discount</Text>
            <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{slipData.saleData?.total_discount || 0}</Text>
          </View>
          <View style={styles.tableFooterRow}>
            <Text style={{ flex: 6.5 }}></Text>
            <Text style={[styles.tableCell, styles.cellBold]}>Sub-Total</Text>
            <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{slipData.saleData?.actual_bill || slipData.saleData?.amount_paid || 0}</Text>
          </View>
          <View style={styles.tableFooterRow}>
            <Text style={{ flex: 6.5 }}></Text>
            <Text style={[styles.tableCell, styles.cellBold]}>Tax</Text>
            <Text style={[styles.tableCell, styles.cellBold, { textAlign: 'right' }]}>{slipData.saleData?.total_tax || 0}</Text>
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.totalsContainer}>
          <Text style={styles.totalsText}>
            <Text style={{ fontWeight: '400', color: COLORS.textDark, fontSize: 16 }}>Total: </Text>
            {slipData.saleData?.total_bill || 0}
          </Text>
          <Text style={styles.totalsText}>
            <Text style={{ fontWeight: '400', color: COLORS.textDark, fontSize: 16 }}>Paid: </Text>
            {slipData.saleData?.amount_paid || 0}
          </Text>
          <Text style={styles.totalsText}>
            <Text style={{ fontWeight: '400', color: COLORS.textDark, fontSize: 16 }}>Balance: </Text>
            {slipData.saleData?.balance || 0}
          </Text>
        </View>

        {/* Notes */}
        {slipData.saleData?.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{slipData.saleData.notes}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
            <Text style={styles.printBtnText}>Print Invoice</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignSelf: 'center',
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  headerBlock: {
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
  },
  companyAddress: {
    fontSize: 14,
    color: COLORS.textDark,
    flex: 1,
  },
  companyContact: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  issuedAt: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  billTo: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  customerAddress: {
    fontSize: 13,
    color: COLORS.textDark,
    textAlign: 'right',
  },
  customerText: {
    fontSize: 13,
    color: COLORS.textDark,
    textAlign: 'right',
  },
  infoBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginBottom: 20,
  },
  infoBannerText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  tableFooterRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#444',
  },
  cellBold: {
    fontWeight: '600',
  },
  totalsContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingRight: 10,
  },
  totalsText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  notesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  closeBtn: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
  printBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  printBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
