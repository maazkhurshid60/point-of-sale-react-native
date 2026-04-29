import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Image } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BaseSlipData } from '../../store/useDialogStore';
import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';
import { ReceiptService } from '../../services/ReceiptService';

interface TicketDialogProps {
  slipData: BaseSlipData;
  onClose?: () => void;
}

export default function TicketDialog({ slipData, onClose }: TicketDialogProps) {
  const { width, height } = useWindowDimensions();

  // Thermal tickets are usually fixed width (e.g. 300px on screen)
  const dialogWidth = 350;
  const dialogMaxHeight = height * 0.9;

  const handlePrint = async () => {
    try {
      const ticketData = mapToTicketData(slipData);
      await ReceiptService.printReceipt(ticketData, 'ticket', slipData.settings || null);
    } catch (error) {
      console.error('Print Error:', error);
    }
  };

  const handleShare = async () => {
    try {
      const ticketData = mapToTicketData(slipData);
      await ReceiptService.printReceipt(ticketData, 'ticket', slipData.settings || null);
    } catch (error) {
      console.error('Share Error:', error);
    }
  };

  const mapToTicketData = (data: BaseSlipData) => {
    return {
      crtStoreName: data.companyData?.company_name || '',
      crtStoreCompleteAddress: data.companyData?.lead_street || '',
      crtStoreContact: data.companyData?.lead_contact || '',
      date: data.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(data.saleData.created_at), true) : '',
      customerName: data.customerData?.name || data.usersData?.customer_name || 'Walk-in Customer',
      customerId: data.customerData?.id || data.usersData?.customer_id || '',
      saleId: data.saleData?.sale_id?.toString() || data.saleData?.id?.toString() || '',
      userName: data.cashierData?.name || data.usersData?.sale_person || 'N/A',
      salesmanName: data.salesmanData?.name || data.usersData?.salesman_name || '',
      ticketNo: data.saleData?.invoice_no || data.saleData?.ticket_no || '',
      subtotal: data.saleData?.actual_bill?.toString() || '0',
      totalTax: data.saleData?.total_tax?.toString() || '0',
      totalBill: data.saleData?.total_bill?.toString() || '0',
      totalDiscount: data.saleData?.total_discount?.toString() || '0',
      amountPaid: data.saleData?.amount_paid?.toString() || data.saleData?.total_bill?.toString() || '0',
      balance: data.saleData?.balance?.toString() || '0',
      tax: '18', // Default or from settings
      saleItems: (data.saleItemsData || []).map(item => [
        item.sku || '',
        item.product_name || item.name || '',
        item.qty?.toString() || '0',
        item.price?.toString() || '0',
        item.discount?.toString() || '0',
        '0', // GST %
        '0', // GST Amount
        item.subtotal?.toString() || '0'
      ])
    };
  };

  const renderProductRow = (item: any, index: number) => (
    <View key={index} style={styles.tableRow}>
      <View style={{ flex: 3 }}>
        <Text style={styles.productName}>{item.product_name || item.name || ''}</Text>
        <Text style={styles.skuText}>{item.sku || ''}</Text>
      </View>
      <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.qty || 0}</Text>
      <Text style={[styles.tableCell, { flex: 2, textAlign: 'right' }]}>{item.subtotal || 0}</Text>
    </View>
  );

  const customerName = slipData.customerData?.name || slipData.usersData?.customer_name || 'Walk-in Customer';
  const cashierName = slipData.cashierData?.name || slipData.usersData?.sale_person || 'N/A';

  return (
    <View style={[styles.dialogCard, { width: dialogWidth, maxHeight: dialogMaxHeight }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header - Centered Thermal Style */}
        <View style={styles.header}>
          <Text style={styles.storeName}>{slipData.companyData?.company_name || 'Store Name'}</Text>
          <Text style={styles.addressText}>{slipData.companyData?.lead_street || ''}</Text>
          <Text style={styles.addressText}>Contact: {slipData.companyData?.lead_contact || ''}</Text>
        </View>

        <View style={styles.dividerDashed} />

        {/* Info Area */}
        <View style={styles.infoArea}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at), true) : ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer:</Text>
            <Text style={styles.infoValue}>{customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Invoice No:</Text>
            <Text style={styles.infoValue}>{slipData.saleData?.invoice_no || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cashier:</Text>
            <Text style={styles.infoValue}>{cashierName}</Text>
          </View>
        </View>

        <View style={styles.dividerDashed} />

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>Product</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
          <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'right' }]}>Total</Text>
        </View>

        {/* Items */}
        {(slipData.saleItemsData || []).map((item, index) => renderProductRow(item, index))}

        <View style={styles.dividerDashed} />

        {/* Totals */}
        <View style={styles.totalsArea}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sub-Total:</Text>
            <Text style={styles.totalValue}>{slipData.saleData?.actual_bill || 0}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>{slipData.saleData?.total_tax || 0}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount:</Text>
            <Text style={styles.totalValue}>{slipData.saleData?.total_discount || 0}</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 10 }]}>
            <Text style={[styles.totalLabel, { fontSize: 20, fontWeight: '800' }]}>GRAND TOTAL:</Text>
            <Text style={[styles.totalValue, { fontSize: 20, fontWeight: '800', color: COLORS.primary }]}>{slipData.saleData?.total_bill || 0}</Text>
          </View>
        </View>

        <View style={styles.dividerDashed} />

        {/* Barcode Section (On-screen preview) */}
        <View style={styles.barcodeContainer}>
          <Image
            source={{ uri: `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(slipData.saleData?.invoice_no || slipData.saleData?.ticket_no || 'TICKET')}&scale=2&rotate=N&includetext` }}
            style={styles.barcodeImage}
          />
        </View>

        {/* Footer Text */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business!</Text>
          <Text style={styles.footerSubText}>Software by Red Star Technologies</Text>
        </View>

        {/* Desktop Buttons UI - Not part of the receipt itself */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.posRed }]} onPress={onClose}>
            <Text style={styles.btnText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#4b5563' }]} onPress={handleShare}>
            <Text style={styles.btnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.primary }]} onPress={handlePrint}>
            <Text style={styles.btnText}>Print</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 18,
  },
  dividerDashed: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#000',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  infoArea: {
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  infoValue: {
    fontSize: 12,
    color: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  skuText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  tableCell: {
    fontSize: 12,
    color: '#000',
  },
  totalsArea: {
    paddingVertical: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 11,
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  barcodeContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  barcodeImage: {
    width: 700,
    height: 100,
    resizeMode: 'contain',
  },
});
