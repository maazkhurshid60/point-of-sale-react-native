import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BaseSlipData } from '../../store/useDialogStore';
import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface SampleSaleSlipDialogProps {
  slipData: BaseSlipData;
  onClose?: () => void;
}

export default function SampleSaleSlipDialog({ slipData, onClose }: SampleSaleSlipDialogProps) {
  const { width, height } = useWindowDimensions();

  // Responsive breakpoints
  const isTablet = width >= 768;
  
  // Dynamic values
  const dialogWidth = isTablet ? 900 : width * 0.95;
  const dialogMaxHeight = height * 0.9;

  const scaleFont = (size: number) => {
    const scale = isTablet ? 1.2 : 1;
    return size * scale;
  };

  const generateHTML = () => {
    const productsHTML = (slipData.saleItemsData || []).map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${item.sku || ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${item.name || item.product_name || ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">${item.qty || 0}</td>
      </tr>
    `).join('');

    return `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 40px; color: #1E293B;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; color: ${COLORS.primary}; text-transform: uppercase;">Sample Sale Slip</h1>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <h2 style="margin: 0;">${slipData.companyData?.company_name || 'Owner Inventory'}</h2>
              <p style="margin: 5px 0; font-size: 14px;">${slipData.companyData?.lead_street || ''}</p>
              <p style="margin: 5px 0; font-size: 14px;">${slipData.companyData?.lead_contact || ''}</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; color: ${COLORS.primary};">Customer:</h2>
              <p style="margin: 5px 0; font-size: 16px;"><b>${customerName}</b></p>
              <p style="margin: 5px 0; font-size: 14px;">ID: ${slipData.customerData?.id || ''}</p>
            </div>
          </div>
          <p style="margin: 5px 0; font-size: 14px;"><b>Sample No: ${slipData.saleData?.invoice_no || 'N/A'}</b></p>
          <p style="margin: 5px 0; font-size: 14px;">Date: ${slipData.saleData?.created_at || TRANSFORM_DATE_TIME_TO_STRING(new Date(), true)}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #F8FAFC; color: ${COLORS.primary};">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid ${COLORS.primary};">SKU</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid ${COLORS.primary};">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid ${COLORS.primary};">Qty</th>
              </tr>
            </thead>
            <tbody>
              ${productsHTML}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    try {
      await Print.printAsync({ html: generateHTML() });
    } catch (error) {
      console.error('Print Error:', error);
    }
  };

  const handleShare = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: generateHTML() });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Share Error:', error);
    }
  };

  const renderProductRow = (item: any, index: number) => (
    <View key={index} style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 1.5, fontSize: scaleFont(12) }]}>{item.sku || ''}</Text>
      <Text style={[styles.tableCell, { flex: 3, fontSize: scaleFont(12) }]}>{item.name || item.product_name || ''}</Text>
      <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', fontSize: scaleFont(12) }]}>{item.qty || 0}</Text>
    </View>
  );

  const customerName = slipData.customerData?.name || slipData.usersData?.customer_name || 'N/A';
  const cashierName = slipData.cashierData?.name || slipData.usersData?.sale_person || 'N/A';

  return (
    <View style={[styles.dialogCard, { width: dialogWidth, maxHeight: dialogMaxHeight }]}>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollContent}>
        
        <Text style={[styles.mainTitle, { fontSize: scaleFont(30) }]}>Sample Sale Slip</Text>

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

          <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
            <Text style={[styles.dateText, { fontSize: scaleFont(15) }]}>
              Date: {slipData.saleData?.created_at || TRANSFORM_DATE_TIME_TO_STRING(new Date(), true)}
            </Text>
          </View>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Sample No: <Text style={{ fontWeight: '700' }}>{slipData.saleData?.invoice_no || 'N/A'}</Text>
          </Text>
          <Text style={styles.bannerText}>
            Sale Person: <Text style={{ fontWeight: '700' }}>{cashierName}</Text>
          </Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>SKU</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Product</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
          </View>
          {(slipData.saleItemsData || []).map((item: any, index: number) => renderProductRow(item, index))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.btnText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
              <Text style={styles.btnText}>Print</Text>
            </TouchableOpacity>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  shareBtn: {
    backgroundColor: '#475569',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  printBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  btnText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
});
