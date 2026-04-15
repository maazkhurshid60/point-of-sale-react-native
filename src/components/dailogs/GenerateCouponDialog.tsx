import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, TextInput, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuthStore } from '../../store/useAuthStore';

interface GenerateCouponDialogProps {
  onClose?: () => void;
}

export default function GenerateCouponDialog({ onClose }: GenerateCouponDialogProps) {
  const { width } = useWindowDimensions();
  const [isNewCoupon, setIsNewCoupon] = React.useState(true);
  const [amountOrCode, setAmountOrCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [couponData, setCouponData] = React.useState<any>(null);

  const generateCoupon = useAuthStore(state => state.generateCoupon);
  const validateCoupon = useAuthStore(state => state.validateCoupon);

  const isTablet = width >= 768;
  const dialogWidth = isTablet ? 600 : width * 0.9;

  const handleAction = async () => {
    if (!amountOrCode) return;
    setIsLoading(true);
    let result;
    if (isNewCoupon) {
      // Parse to number as generateCoupon expects a number
      const amount = parseFloat(amountOrCode);
      if (isNaN(amount)) {
        setIsLoading(false);
        return;
      }
      result = await generateCoupon(amount);
    } else {
      result = await validateCoupon(amountOrCode);
    }
    setIsLoading(false);
    if (result) {
      setCouponData(result);
    }
  };

  return (
    <View style={[styles.dialogCard, { width: dialogWidth }]}>
      <Text style={styles.title}>Coupons</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, isNewCoupon && styles.activeTab]} 
          onPress={() => { setIsNewCoupon(true); setCouponData(null); }}
        >
          <Text style={[styles.tabText, isNewCoupon && styles.activeTabText]}>New Coupon</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, !isNewCoupon && styles.activeTab]} 
          onPress={() => { setIsNewCoupon(false); setCouponData(null); }}
        >
          <Text style={[styles.tabText, !isNewCoupon && styles.activeTabText]}>Existing Coupon</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={isNewCoupon ? "enter coupon amount" : "enter coupon code"}
          placeholderTextColor="#9ca3af"
          value={amountOrCode}
          onChangeText={setAmountOrCode}
          keyboardType={isNewCoupon ? "numeric" : "default"}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleAction} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.actionBtnText}>{isNewCoupon ? "Generate Coupon" : "Get Coupon"}</Text>
          )}
        </TouchableOpacity>
      </View>

      {couponData && (
        <View style={styles.couponCard}>
          <View style={styles.couponLeft}>
            <Text style={styles.promoLabel}>promo code</Text>
            <Text style={styles.promoCode}>{couponData.coupon_number}</Text>
          </View>
          <View style={styles.couponRight}>
            <View style={styles.couponHeader}>
              <Text style={styles.storeName}>Store</Text>
              <Text style={styles.couponAmount}>Rs {couponData.coupon_amount}/-</Text>
            </View>
            <View style={styles.couponStats}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Used</Text>
                <Text style={[styles.statValue, { color: '#10b981' }]}>{(parseFloat(couponData.coupon_amount) - (parseFloat(couponData.coupon_amount_left) || 0)).toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Left</Text>
                <Text style={[styles.statValue, { color: COLORS.posRed }]}>{couponData.coupon_amount_left || 0}/-</Text>
              </View>
            </View>
            <Text style={styles.expiryText}>Expires: {couponData.expiry_date}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dialogCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Montserrat-Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 10,
    fontFamily: 'Montserrat-Bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cancelBtnText: {
    color: '#64748b',
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  actionBtnText: {
    color: 'white',
    fontWeight: '600',
  },
  couponCard: {
    marginTop: 30,
    backgroundColor: '#1e293b',
    borderRadius: 15,
    flexDirection: 'row',
    height: 150,
    overflow: 'hidden',
  },
  couponLeft: {
    width: '35%',
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  promoLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 5,
  },
  promoCode: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  couponRight: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  couponAmount: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: '700',
  },
  couponStats: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 5,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: 'white',
    fontSize: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  expiryText: {
    color: COLORS.posRed,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
});
