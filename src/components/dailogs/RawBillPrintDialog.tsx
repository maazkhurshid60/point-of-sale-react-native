import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BaseSlipData } from '../../store/useDialogStore';
import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface RawBillPrintDialogProps {
  slipData: BaseSlipData;
  onClose?: () => void;
}

export default function RawBillPrintDialog({ slipData, onClose }: RawBillPrintDialogProps) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const generateHTML = () => {
    const productsHTML = (slipData.saleItemsData || []).map((item: any) => `
      <tr>
        <td style="padding: 5px 0;">${item.product?.sku || item.sku || ''}<br>${item.product_name || item.name || ''}</td>
        <td style="text-align: center;">${item.qty || item.quantity || 0}</td>
        <td style="text-align: right;">${item.price || item.actual_price || item.selling_price || 0}</td>
        <td style="text-align: right;">${item.subtotal || 0}</td>
      </tr>
    `).join('');

    return `
      <html>
        <body style="font-family: 'Courier New', Courier, monospace; padding: 20px; width: 300px; margin: auto;">
          <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px;">
            <h2 style="margin: 0;">${slipData.companyData?.company_name || 'Owner Inventory'}</h2>
            <p style="margin: 5px 0; font-size: 12px;">${slipData.companyData?.lead_street || ''}</p>
            <p style="margin: 5px 0; font-size: 12px;">${slipData.companyData?.lead_contact || ''}</p>
          </div>
          <div style="text-align: center; margin: 10px 0;">
            <h3 style="margin: 0; text-transform: uppercase;">Raw Bill / Ticket</h3>
          </div>
          <div style="font-size: 12px; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px;">
            <p style="margin: 2px 0;"><b>Date:</b> ${slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at), true) : ''}</p>
            <p style="margin: 2px 0;"><b>Ticket No:</b> ${slipData.saleData?.ticket_no || slipData.saleData?.invoice_no || 'N/A'}</p>
            <p style="margin: 2px 0;"><b>Customer:</b> ${customerName}</p>
            <p style="margin: 2px 0;"><b>Cashier:</b> ${cashierName}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="border-bottom: 1px dashed #000;">
                <th style="text-align: left; padding-bottom: 5px;">Item</th>
                <th style="text-align: center; padding-bottom: 5px;">Qty</th>
                <th style="text-align: right; padding-bottom: 5px;">Price</th>
                <th style="text-align: right; padding-bottom: 5px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsHTML}
            </tbody>
          </table>
          <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 10px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between;">
              <span>Sub-Total</span>
              <span>${slipData.saleData?.actual_bill || 0}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Discount</span>
              <span>${slipData.saleData?.total_discount || 0}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Tax</span>
              <span>${slipData.saleData?.total_tax || 0}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 5px; font-size: 14px;">
              <span>GRAND TOTAL</span>
              <span>${slipData.saleData?.total_bill || 0}</span>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 10px;">
            <p style="margin: 0; font-weight: bold; color: #cc0000;">*** RAW BILL PRINT ONLY ***</p>
            <p style="margin: 0;">No sale has been made against this bill</p>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    try {
      await Print.printAsync({
        html: generateHTML(),
      });
    } catch (error) {
      console.error('Print Error:', error);
    }
  };

  const handleShare = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: generateHTML(),
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Share Error:', error);
    }
  };

  const renderProductRow = (item: any, index: number) => {
    return (
      <View key={index} style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.product?.sku || item.sku || item.barcode || ''}</Text>
        <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={1}>
          {item.product?.product_name || item.product_name || item.product?.name || item.name || ''}
        </Text>
        <Text style={[styles.tableCell, styles.cellBold, { flex: 1, textAlign: 'center' }]}>{item.qty || item.quantity || 0}</Text>
        <Text style={[styles.tableCell, styles.cellBold, { flex: 1.5, textAlign: 'right' }]}>{item.price || item.actual_price || item.selling_price || 0}</Text>
        <Text style={[styles.tableCell, styles.cellBold, { flex: 1.5, textAlign: 'right' }]}>{item.subtotal || 0}</Text>
      </View>
    );
  };

  const customerName = slipData.customerData?.name ||
    (slipData.customerData?.first_name ? `${slipData.customerData.first_name} ${slipData.customerData.last_name || ''}` : 'N/A');

  const cashierName = slipData.cashierData?.name || slipData.cashierData?.first_name || 'N/A';

  return (
    <View style={[styles.dialogCard, { width: isPortrait ? '95%' : 450, maxHeight: height * 0.9 }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header - Thermal Receipt Style */}
        <View style={styles.thermalHeader}>
          <Text style={styles.companyName}>{slipData.companyData?.company_name || 'Owner Inventory'}</Text>
          <Text style={styles.thermalText}>{slipData.companyData?.lead_street || slipData.companyData?.street || ''}</Text>
          <Text style={styles.thermalText}>{slipData.companyData?.lead_contact || slipData.companyData?.mobile || ''}</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>RAW BILL / TICKET</Text>
          <View style={styles.divider} />
        </View>

        {/* Info Rows */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at), true) : ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ticket No:</Text>
            <Text style={styles.infoValue}>{slipData.saleData?.ticket_no || slipData.saleData?.invoice_no || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer:</Text>
            <Text style={styles.infoValue}>{customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cashier:</Text>
            <Text style={styles.infoValue}>{cashierName}</Text>
          </View>
        </View>

        {/* Product Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>SKU</Text>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>Item</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
          <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'right' }]}>Price</Text>
          <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'right' }]}>Total</Text>
        </View>
        <View style={styles.dividerMinimal} />

        {(slipData.saleItemsData || []).map((item: any, index: number) => renderProductRow(item, index))}

        <View style={styles.divider} />

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sub-Total</Text>
            <Text style={styles.totalValue}>{slipData.saleData?.actual_bill || 0}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount</Text>
            <Text style={styles.totalValue}>{slipData.saleData?.total_discount || 0}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>{slipData.saleData?.total_tax || 0}</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 5 }]}>
            <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
            <Text style={styles.grandTotalValue}>{slipData.saleData?.total_bill || 0}</Text>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNoteContainer}>
          <Text style={styles.footerNote}>*** RAW BILL PRINT ONLY ***</Text>
          <Text style={styles.footerNoteMinimal}>No sale has been made against this bill</Text>
        </View>

        {/* Actions - Print and Share aligned with Flutter */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.shareBtnText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
              <Text style={styles.printBtnText}>Print</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  thermalHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
  },
  thermalText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
    marginVertical: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
  },
  dividerMinimal: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 5,
  },
  infoSection: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    color: '#000',
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 5,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  tableCell: {
    fontSize: 11,
    color: '#000',
  },
  cellBold: {
    fontWeight: '600',
  },
  totalsContainer: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  totalLabel: {
    fontSize: 12,
    color: '#444',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000',
  },
  grandTotalValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary,
  },
  footerNoteContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  footerNote: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.danger,
    textAlign: 'center',
  },
  footerNoteMinimal: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  closeBtn: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  closeBtnText: {
    color: '#333',
    fontWeight: '700',
  },
  printBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  printBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  shareBtn: {
    backgroundColor: '#4A5568',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
