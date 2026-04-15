import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BaseSlipData } from '../../store/useDialogStore';
import { TRANSFORM_DATE_TIME_TO_STRING } from '../../utils/helpers';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface GoodsDeliverySlipDialogProps {
  slipData: BaseSlipData;
  onClose?: () => void;
}

export default function GoodsDeliverySlipDialog({ slipData, onClose }: GoodsDeliverySlipDialogProps) {
  const { width, height } = useWindowDimensions();

  // Responsive breakpoints
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  const isMobile = !isTablet;

  // Dynamic values

  const dialogWidth = isLargeTablet ? 1000 : isTablet ? width * 0.85 : width * 0.95;
  const dialogMaxHeight = height * 0.95;
  const padding = isTablet ? 40 : 20;

  // Responsive font scaling
  const scaleFont = (size: number) => {
    const scale = isLargeTablet ? 1.2 : isTablet ? 1.1 : 1;
    return size * scale;
  };
  const generateHTML = () => {
    const productsHTML = (slipData.saleItemsData || []).map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${item.product?.sku || ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0;">${item.product?.product_name || ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: center;">${item.qty || 0}</td>
        <td style="padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: center;"></td>
      </tr>
    `).join('');

    return `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 40px; color: #1E293B;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="margin: 0; color: ${COLORS.primary}; text-transform: uppercase;">Goods Delivery Slip</h1>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div>
              <h2 style="margin: 0;">${slipData.companyData?.company_name || ''}</h2>
              <p style="margin: 5px 0; font-size: 14px;">${slipData.companyData?.lead_street || ''}</p>
              <p style="margin: 5px 0; font-size: 14px;">${slipData.companyData?.lead_contact || ''}</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0;">${slipData.customerData?.name || ''}</h2>
              <p style="margin: 5px 0; font-size: 14px;">Customer ID: ${slipData.customerData?.customer_id || ''}</p>
              <p style="margin: 5px 0; font-size: 14px;">Invoice No: <b>${slipData.saleData?.invoice_no || ''}</b></p>
            </div>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 60px;">
            <thead>
              <tr style="background-color: #F8FAFC;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #E2E8F0;">SKU</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #E2E8F0;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #E2E8F0;">Ordered Qty</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #E2E8F0;">Received Qty</th>
              </tr>
            </thead>
            <tbody>
              ${productsHTML}
            </tbody>
          </table>
          <div style="display: flex; justify-content: space-between; margin-top: 100px;">
            <div style="width: 200px; text-align: center; border-top: 1px solid #94A3B8; padding-top: 10px;">
              Receiver Signature
            </div>
            <div style="width: 200px; text-align: center; border-top: 1px solid #94A3B8; padding-top: 10px;">
              Dispatcher Signature
            </div>
          </div>
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
  const renderProductRow = ({ item, index }: { item: any, index: number }) => {
    return (
      <View key={index} style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 1.5, fontSize: scaleFont(14) }]}>{item.product?.sku || ''}</Text>
        <Text style={[styles.tableCell, { flex: 3, fontSize: scaleFont(14) }]} numberOfLines={1}>{item.product?.product_name || ''}</Text>
        <Text style={[styles.tableCell, styles.cellBold, { flex: 2, textAlign: 'center', fontSize: scaleFont(14) }]}>{item.qty || 0}</Text>
        <Text style={[styles.tableCell, styles.cellBold, { flex: 2, textAlign: 'center', fontSize: scaleFont(14) }]}></Text>
      </View>
    );
  };

  return (
    <View style={[styles.dialogCard, { width: dialogWidth, maxHeight: dialogMaxHeight, padding }]}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        style={{ flexGrow: 0 }}
      >

        {/* Title */}
        <Text style={[styles.title, { fontSize: scaleFont(26), marginBottom: isTablet ? 30 : 20 }]}>Goods Delivery Slip</Text>

        {/* Header Information */}
        <View style={styles.headerBlock}>
          <View style={styles.headerRow}>
            <Text style={[styles.companyName, { fontSize: scaleFont(22) }]} numberOfLines={1}>{slipData.companyData?.company_name}</Text>
            <Text style={[styles.companyName, { textAlign: 'right', fontSize: scaleFont(22) }]} numberOfLines={1}>{slipData.customerData?.name}</Text>
          </View>

          <View style={styles.headerRow}>
            <Text style={[styles.companyAddress, { fontSize: scaleFont(15) }]} numberOfLines={2}>
              {slipData.companyData?.lead_street || ''} {slipData.companyData?.lead_city || ''}
            </Text>
            <Text style={[styles.customerText, { textAlign: 'right', fontSize: scaleFont(15) }]}>
              Customer ID: {slipData.customerData?.customer_id || ''}
            </Text>
          </View>

          <View style={styles.headerRow}>
            <Text style={[styles.companyContact, { fontSize: scaleFont(15) }]}>{slipData.companyData?.lead_contact || 'N/A'}</Text>
          </View>

          <View style={[styles.headerRow, { justifyContent: 'flex-end', marginTop: 10 }]}>
            <Text style={[styles.customerText, { fontSize: scaleFont(14) }]}>
              Status: <Text style={{ fontWeight: '700', color: COLORS.primary }}>{slipData.saleData?.status || ''}</Text>
            </Text>
          </View>

          <View style={[styles.headerRow, { justifyContent: 'flex-end' }]}>
            <Text style={[styles.customerText, { fontWeight: '500', fontSize: scaleFont(14) }]}>
              Date: {slipData.saleData?.created_at ? TRANSFORM_DATE_TIME_TO_STRING(new Date(slipData.saleData.created_at), true) : ''}
            </Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={[styles.infoBanner, { paddingVertical: isTablet ? 15 : 12, marginBottom: isTablet ? 25 : 20 }]}>
          <Text style={[styles.infoBannerText, { fontSize: scaleFont(14) }]}>
            <Text style={{ fontWeight: '400' }}>Invoice No: </Text>
            {slipData.saleData?.invoice_no}
          </Text>
        </View>

        {/* Product Table */}
        <View style={[styles.tableContainer, { padding: isTablet ? 20 : 15 }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.5, fontSize: scaleFont(15) }]}>SKU</Text>
            <Text style={[styles.tableHeaderText, { flex: 3, fontSize: scaleFont(15) }]}>Product</Text>
            <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'center', fontSize: scaleFont(15) }]}>Ordered Qty</Text>
            <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'center', fontSize: scaleFont(15) }]}>Received Qty</Text>
          </View>

          {slipData.saleItemsData?.map((item: any, index: number) => (
            <React.Fragment key={index}>
              {renderProductRow({ item, index })}
            </React.Fragment>
          ))}
        </View>

        {/* Actions & Signatures */}
        <View style={[styles.bottomBlock, { flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 30 : 0 }]}>
          <View style={[styles.signaturesRow, { width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-start' }]}>
            <View style={[styles.signatureBox, { width: isTablet ? 180 : 140, marginRight: isTablet ? 30 : 10 }]}>
              <View style={styles.signatureLine} />
              <Text style={[styles.signatureText, { fontSize: scaleFont(13) }]}>Receiver Signature</Text>
            </View>
            <View style={[styles.signatureBox, { width: isTablet ? 180 : 140 }]}>
              <View style={styles.signatureLine} />
              <Text style={[styles.signatureText, { fontSize: scaleFont(13) }]}>Dispatcher Signature</Text>
            </View>
          </View>

          <View style={[styles.actions, { gap: 10, flexDirection: isMobile ? 'column' : 'row' }]}>
            <TouchableOpacity
              style={[styles.closeBtn, { paddingVertical: scaleFont(12), flex: isMobile ? 0 : 1, minHeight: 45 }]}
              onPress={onClose}
            >
              <Text style={[styles.closeBtnText, { fontSize: scaleFont(14) }]}>Close</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10, width: isMobile ? '100%' : 'auto', flex: isMobile ? 0 : 1.5 }}>
              <TouchableOpacity
                style={[styles.shareBtn, { paddingVertical: scaleFont(12), flex: 1, minHeight: 45 }]}
                onPress={handleShare}
              >
                <Text style={[styles.shareBtnText, { fontSize: scaleFont(14) }]}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.printBtn, { paddingVertical: scaleFont(12), flex: 1.2, minHeight: 45 }]}
                onPress={handlePrint}
              >
                <Text style={[styles.printBtnText, { fontSize: scaleFont(14) }]}>Print</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: 'Montserrat',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  headerBlock: {
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 15,
  },
  companyName: {
    fontWeight: '800',
    color: '#1E293B',
    fontFamily: 'Montserrat',
    flex: 1,
  },
  companyAddress: {
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'Montserrat',
    flex: 1,
    lineHeight: 22,
  },
  companyContact: {
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'Montserrat',
  },
  customerText: {
    fontWeight: '500',
    color: '#1E293B',
    fontFamily: 'Montserrat',
  },
  infoBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 3,
  },
  infoBannerText: {
    color: COLORS.white,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    marginBottom: 30,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableCell: {
    flex: 1,
    color: '#334155',
    fontFamily: 'Montserrat',
  },
  cellBold: {
    fontWeight: '700',
  },
  bottomBlock: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  signaturesRow: {
    flexDirection: 'row',
  },
  signatureBox: {
    alignItems: 'center',
  },
  signatureLine: {
    borderBottomWidth: 2,
    borderBottomColor: '#94A3B8',
    width: '100%',
    marginBottom: 12,
  },
  signatureText: {
    color: '#475569',
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
  },
  closeBtn: {
    backgroundColor: COLORS.posRed,
    borderRadius: 12,
    elevation: 4,
    justifyContent: 'center',
  },
  closeBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  printBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    elevation: 4,
    justifyContent: 'center',
  },
  printBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  shareBtn: {
    backgroundColor: '#475569',
    borderRadius: 12,
    elevation: 4,
    justifyContent: 'center',
  },
  shareBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
});
