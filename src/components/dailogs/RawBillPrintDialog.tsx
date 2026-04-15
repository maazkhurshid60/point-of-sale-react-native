import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BaseSlipData, useDialogStore } from '../../store/useDialogStore';
import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';
import { useCartStore } from '../../store/useCartStore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface RawBillPrintDialogProps {
  slipData: BaseSlipData;
  onClose?: () => void;
}

export default function RawBillPrintDialog({ slipData, onClose }: RawBillPrintDialogProps) {
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = React.useState(false);
  const makeSale = useCartStore(state => state.makeSale);
  const showDialog = useDialogStore(state => state.showDialog);

  // Responsive breakpoints
  const isTablet = width >= 768;
  const isMobile = !isTablet;

  // Dynamic values
  const dialogWidth = isTablet ? 900 : width * 0.95;
  const dialogMaxHeight = height * 0.9;

  const scaleFont = (size: number) => {
    const scale = isTablet ? 1.2 : 1;
    return size * scale;
  };

  const handleTicket = async () => {
    setIsLoading(true);
    const result = await makeSale('cash');
    setIsLoading(false);
    if (result) {
      if (onClose) onClose();
      // After cash sale, flutter shows the ticket/invoice
      showDialog('INVOICE_SLIP', { 
        slipData: {
          saleData: result.sale || result.cashSaleData?.sale || result,
          companyData: result.company || result.cashSaleData?.company,
          customerData: result.customer || result.cashSaleData?.customer || slipData.customerData,
          salesmanData: result.salesman || result.cashSaleData?.salesman || slipData.salesmanData,
          cashierData: result.cashier || result.cashSaleData?.cashier || slipData.cashierData,
          saleItemsData: result.sale_items || result.cashSaleData?.sale?.sale_items || [],
          ...result
        }
      });
    }
  };

  const renderProductRow = (item: any, index: number) => (
    <View key={index} style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1.5, fontSize: scaleFont(12) }]}>{item.sku || ''}</Text>
      <Text style={[styles.tableCell, { flex: 3, fontSize: scaleFont(12) }]}>{item.name || item.product_name || ''}</Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', fontSize: scaleFont(12) }]}>{item.qty || 0}</Text>
      <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'center', fontSize: scaleFont(12) }]}>{item.selling_price || item.price || 0}</Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', fontSize: scaleFont(12) }]}>{item.discount || 0}</Text>
      <Text style={[styles.tableCell, styles.cellBold, { flex: 1.5, textAlign: 'right', fontSize: scaleFont(12) }]}>{item.subtotal || 0}</Text>
    </View>
  );

  const customerName = slipData.customerData?.name || slipData.usersData?.customer_name || 'N/A';
  const salesmanName = slipData.salesmanData?.name || slipData.usersData?.salesman_name || 'N/A';
  const cashierName = slipData.cashierData?.name || slipData.usersData?.sale_person || 'N/A';

  return (
    <View style={[styles.dialogCard, { width: dialogWidth, maxHeight: dialogMaxHeight }]}>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollContent}>
        
        {/* Purple Header Title */}
        <Text style={[styles.mainTitle, { fontSize: scaleFont(30) }]}>Raw Bill Print</Text>

        <View style={styles.headerInfo}>
          <View style={styles.headerRow}>
            <Text style={[styles.companyName, { fontSize: scaleFont(24) }]}>{slipData.companyData?.company_name || ''}</Text>
            <Text style={[styles.customerName, { fontSize: scaleFont(24) }]}>{customerName}</Text>
          </View>
          
          <View style={styles.headerRow}>
            <Text style={[styles.subInfo, { fontSize: scaleFont(15) }]}>
              {slipData.companyData?.lead_street || ''} {slipData.companyData?.lead_country || ''}
            </Text>
            <Text style={[styles.subInfo, { fontSize: scaleFont(15) }]}>Customer Id: {slipData.customerData?.id || slipData.usersData?.customer_id || ''}</Text>
          </View>

          <View style={styles.headerRow}>
            <Text style={[styles.subInfo, { fontSize: scaleFont(15), fontWeight: '500' }]}>{slipData.companyData?.lead_contact || ''}</Text>
            {salesmanName !== 'N/A' && (
              <Text style={[styles.subInfo, { fontSize: scaleFont(15) }]}>Salesman: {salesmanName}</Text>
            )}
          </View>

          <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
            <Text style={[styles.dateText, { fontSize: scaleFont(15) }]}>
              Date: {slipData.saleData?.created_at || TRANSFORM_DATE_TIME_TO_STRING(new Date(), true)}
            </Text>
          </View>
        </View>

        {/* Sales Person Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Sale Person: <Text style={{ fontWeight: '700' }}>{cashierName}</Text>
          </Text>
          <Text style={styles.bannerText}>
            Issued at: <Text style={{ fontWeight: '700' }}>{slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at), true) : ''}</Text>
          </Text>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>SKU</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Product</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'center' }]}>Price</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Disc</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'right' }]}>Sub-Total</Text>
          </View>
          {(slipData.products || slipData.saleItemsData || []).map((item: any, index: number) => renderProductRow(item, index))}
          
          {/* Total Row */}
          <View style={styles.totalSummaryRow}>
            <View style={{ flex: 7 }} />
            <Text style={[styles.totalSummaryCell, { flex: 1.5, fontWeight: '700' }]}>Total</Text>
            <Text style={[styles.totalSummaryCell, { flex: 1.5, textAlign: 'right', fontWeight: '700' }]}>{slipData.saleData?.actual_bill || 0}</Text>
          </View>
          
          <View style={styles.totalSummaryRow}>
            <View style={{ flex: 7 }} />
            <Text style={[styles.totalSummaryCell, { flex: 1.5, fontWeight: '700' }]}>GST (18%)</Text>
            <Text style={[styles.totalSummaryCell, { flex: 1.5, textAlign: 'right', fontWeight: '700' }]}>{slipData.saleData?.total_tax || 0}</Text>
          </View>
        </View>

        {/* Warning Note */}
        <Text style={styles.warningNote}>
          Note: Raw Bill Print Only. No sale has made against this bill
        </Text>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.ticketBtn} onPress={handleTicket} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.btnText}>Ticket</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Grand Total </Text>
            <Text style={styles.totalValue}>{slipData.saleData?.total_bill || 0}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: '#ebebeb',
    borderRadius: 15,
    padding: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  mainTitle: {
    color: COLORS.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Montserrat-Bold',
  },
  headerInfo: {
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  companyName: {
    fontWeight: '700',
    color: '#334155',
  },
  customerName: {
    fontWeight: '700',
    color: '#334155',
  },
  subInfo: {
    color: '#475569',
  },
  dateText: {
    fontWeight: '500',
    color: '#334155',
  },
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bannerText: {
    color: 'white',
    fontSize: 14,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 15,
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontWeight: '700',
    color: COLORS.primary,
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableCell: {
    color: '#64748b',
  },
  totalSummaryRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  totalSummaryCell: {
    color: '#334155',
  },
  warningNote: {
    color: COLORS.posRed,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  closeBtn: {
    backgroundColor: COLORS.posRed,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  ticketBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 18,
    color: '#334155',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cellBold: {
    fontWeight: '700',
  },
});
