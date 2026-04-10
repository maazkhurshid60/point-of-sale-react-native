import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useDialogStore } from '../../store/useDialogStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  amount: string;
  icon: string;
  gradientColors: string[];
}

const StatCard = ({ title, amount, icon, gradientColors }: StatCardProps) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.iconContainer}
    >
      <FontAwesome6 name={icon} size={20} color="white" />
    </LinearGradient>
    <View style={styles.statInfo}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statAmount}>{amount}</Text>
    </View>
  </View>
);

interface NavCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  gradientColors: string[];
}

const NavCard = ({ title, subtitle, icon, onPress, gradientColors }: NavCardProps) => (
  <Pressable onPress={onPress} style={styles.navCard}>
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      style={styles.navIconBg}
    >
      <FontAwesome6 name={icon} size={32} color="white" />
    </LinearGradient>
    <Text style={styles.navCardTitle}>{title}</Text>
    <Text style={styles.navCardSubtitle}>{subtitle}</Text>
  </Pressable>
);

export default function DashboardMainScreen() {
  const isShiftOpened = useAuthStore((state) => state.isShiftOpened);
  const setScreen = useUIStore((state) => state.setScreen);
  const showDialog = useDialogStore((state) => state.showDialog);

  const handlePOSClick = () => {
    if (isShiftOpened) {
      setScreen('POS_BILLING'); // Go to dedicated POS Billing screen
    } else {
      showDialog('OPEN_SHIFT', {});
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Date Range Selector Placeholder */}
      <View style={styles.dateSelectorContainer}>
        <LinearGradient
          colors={['#6A1B9A', '#6A1B9A']}
          style={styles.dateSelector}
        >
          <FontAwesome6 name="calendar-days" size={16} color="white" />
          <Text style={styles.dateText}>Select Date Range</Text>
          <FontAwesome6 name="chevron-down" size={12} color="white" />
        </LinearGradient>
      </View>

      {/* Statistics Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="PURCHASES"
          amount="9,985,358.00"
          icon="cart-shopping"
          gradientColors={['#6A1DBA', '#FFD600']}
        />
        <StatCard
          title="PROFIT"
          amount="9,985,358.00"
          icon="cloud"
          gradientColors={['#6A1DBA', '#FFD600']}
        />
        <StatCard
          title="SALES"
          amount="9,985,358.00"
          icon="chart-simple"
          gradientColors={['#6A1DBA', '#FFD600']}
        />
        <StatCard
          title="EXPENSES"
          amount="9,985,358.00"
          icon="wallet"
          gradientColors={['#6A1DBA', '#FFD600']}
        />
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navContainer}>
        <NavCard
          title="Point of Sale"
          subtitle="Owners POS system can help boost your business and provide you with complete vision of the business insights"
          icon="circle-dot"
          onPress={handlePOSClick}
          gradientColors={['#6A1BB9', '#FFD600']}
        />
        <NavCard
          title="Reports"
          subtitle="The Point of Sale Reports section provides comprehensive insights into sales transactions and revenue trends"
          icon="magnifying-glass-chart"
          onPress={() => setScreen('REPORTS_MENU')}
          gradientColors={['#6A1BB9', '#FFD600']}
        />
        <NavCard
          title="Orders"
          subtitle="The Point of Sale Kitchen Order section efficiently manages and communicates orders from customers"
          icon="bell"
          onPress={() => setScreen('ORDER_REVIEW')}
          gradientColors={['#6A1BB9', '#FFD600']}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
  },
  dateSelectorContainer: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  dateText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold', // Assuming fonts are loaded
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 60) / 2, // 2-column on mobile
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  navContainer: {
    gap: 20,
  },
  navCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#6A1BB9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  navIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  navCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  navCardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
});
