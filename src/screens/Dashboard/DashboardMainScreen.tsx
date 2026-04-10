import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
  Easing,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useDialogStore } from '../../store/useDialogStore';
import { COLORS } from '../../constants/colors';

interface StatCardProps {
  title: string;
  amount: string;
  icon: string;
  gradientColors: string[];
  delay: number;
  width: number | string;
}

const StatCard = ({ title, amount, icon, gradientColors, delay, width }: StatCardProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      delay: delay,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 800,
      delay: delay,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          width: width as any,
          opacity: scaleAnim,
          transform: [
            { scale: scaleAnim },
            { rotate: spin },
            {
              translateY: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
              })
            }
          ]
        }
      ]}
    >
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <FontAwesome6 name={icon} size={18} color="white" />
      </LinearGradient>
      <View style={styles.statInfo}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statAmount}>{amount}</Text>
      </View>
    </Animated.View>
  );
};

interface NavCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  gradientColors: string[];
  delay: number;
  width: number | string;
}

const NavCard = ({ title, subtitle, icon, onPress, gradientColors, delay, width }: NavCardProps) => {
  const popAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(popAnim, {
      toValue: 1,
      tension: 40,
      friction: 6,
      delay: delay,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      delay: delay + 100,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          opacity: popAnim,
          transform: [
            {
              scale: popAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            },
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 50],
              })
            }
          ]
        }
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.navCard,
          { transform: [{ scale: pressed ? 0.96 : 1 }] }
        ]}
      >
        <View style={styles.navContent}>
          <Animated.View style={{
            transform: [{
              rotate: popAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['-45deg', '0deg']
              })
            }]
          }}>
            <LinearGradient
              colors={gradientColors as [string, string, ...string[]]}
              style={styles.navIconBg}
            >
              <FontAwesome6 name={icon} size={26} color="white" />
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[
            styles.navTextContainer,
            {
              opacity: popAnim,
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}>
            <Text style={styles.navCardTitle}>{title}</Text>
            <Text style={styles.navCardSubtitle} numberOfLines={2}>{subtitle}</Text>
          </Animated.View>

          <View style={styles.arrowIcon}>
            <FontAwesome6 name="chevron-right" size={12} color="#CBD5E1" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function DashboardMainScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isTabletOrLaptop = screenWidth > 800;

  const isShiftOpened = useAuthStore((state) => state.isShiftOpened);
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentStore = useAuthStore((state) => state.currentStore);
  const fetchShiftDetails = useAuthStore((state) => state.fetchShiftDetails);
  const fetchDailyCashReports = useAuthStore((state) => state.fetchDailyCashReports);
  const setScreen = useUIStore((state) => state.setScreen);
  const showDialog = useDialogStore((state) => state.showDialog);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchShiftDetails(),
        fetchDailyCashReports()
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setRefreshing(false), 800);
    }
  }, []);

  const handlePOSClick = () => {
    if (isShiftOpened) {
      setScreen('POS_BILLING');
    } else {
      showDialog('OPEN_SHIFT', {});
    }
  };

  const statCardWidth = isTabletOrLaptop ? (screenWidth - 80) / 4 : (screenWidth - 52) / 2;
  const navCardWidth = isTabletOrLaptop ? (screenWidth - 88) / 3 : (screenWidth - 40);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, isTabletOrLaptop && { alignSelf: 'center', width: '100%', maxWidth: 1400 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#6366F1']}
          tintColor="#6366F1"
        />
      }
    >
      <View style={[styles.heroSection, isTabletOrLaptop && { marginBottom: 40 }]}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={[styles.userNameText, isTabletOrLaptop && { fontSize: 32 }]}>{currentUser?.name || 'Administrator'}</Text>
          <Text style={styles.storeText}>
            <FontAwesome6 name="shop" size={12} color="#64748B" /> {currentStore?.store_name || 'Main Branch'}
          </Text>
        </View>
        <View style={styles.heroRight}>
          {isTabletOrLaptop && (
            <Pressable style={styles.dateSelectorContainerTablet}>
              <View style={styles.dateSelector}>
                <View style={styles.dateSelectorInner}>
                  <FontAwesome6 name="calendar-days" size={14} color="#6366F1" />
                  <Text style={styles.dateText}>Apr 10 - Apr 17, 2024</Text>
                </View>
                <View style={styles.filterBadge}>
                  <FontAwesome6 name="sliders" size={12} color="white" />
                </View>
              </View>
            </Pressable>
          )}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              style={styles.avatarGradient}
            >
              <FontAwesome6 name="user" size={20} color="white" />
            </LinearGradient>
          </View>
        </View>
      </View>

      {!isTabletOrLaptop && (
        <Pressable style={styles.dateSelectorContainer}>
          <View style={styles.dateSelector}>
            <View style={styles.dateSelectorInner}>
              <FontAwesome6 name="calendar-days" size={14} color="#6366F1" />
              <Text style={styles.dateText}>Apr 10 - Apr 17, 2024</Text>
            </View>
            <View style={styles.filterBadge}>
              <FontAwesome6 name="sliders" size={12} color="white" />
            </View>
          </View>
        </Pressable>
      )}


      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.viewAllBadge}>
          <Text style={styles.sectionAction}>Weekly Stats</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="PURCHASES"
          amount="9.9M"
          icon="cart-shopping"
          gradientColors={['#6366F1', '#818CF8']}
          delay={100}
          width={statCardWidth}
        />
        <StatCard
          title="PROFIT"
          amount="2.4M"
          icon="arrow-trend-up"
          gradientColors={['#22C55E', '#4ADE80']}
          delay={200}
          width={statCardWidth}
        />
        <StatCard
          title="SALES"
          amount="12.8M"
          icon="chart-simple"
          gradientColors={['#F59E0B', '#FBBF24']}
          delay={300}
          width={statCardWidth}
        />
        <StatCard
          title="EXPENSES"
          amount="1.1M"
          icon="wallet"
          gradientColors={['#EF4444', '#F87171']}
          delay={400}
          width={statCardWidth}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>

      <View style={[styles.navContainer, isTabletOrLaptop && { flexDirection: 'row', flexWrap: 'wrap' }]}>
        <NavCard
          title="Point of Sale"
          subtitle="Process transactions quickly with our cloud-powered POS system"
          icon="laptop"
          onPress={handlePOSClick}
          gradientColors={['#6366F1', '#4F46E5']}
          delay={500}
          width={navCardWidth}
        />
        <NavCard
          title="Analytics Hub"
          subtitle="Explore detailed reports and visualize your business growth"
          icon="magnifying-glass-chart"
          onPress={() => setScreen('REPORTS_MENU')}
          gradientColors={['#22C55E', '#16A34A']}
          delay={650}
          width={navCardWidth}
        />
        <NavCard
          title="Kitchen Display"
          subtitle="Monitor and manage orders efficiently in real-time"
          icon="fire-burner"
          onPress={() => setScreen('ORDER_REVIEW')}
          gradientColors={['#F59E0B', '#D97706']}
          delay={800}
          width={navCardWidth}
        />
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  storeText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    padding: 2,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateSelectorContainer: {
    marginBottom: 28,
  },
  dateSelectorContainerTablet: {
    marginRight: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  dateSelectorInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
  },
  filterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  viewAllBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sectionAction: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  navContainer: {
    gap: 14,
  },
  navCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 4,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIconBg: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTextContainer: {

    flex: 1,
    paddingRight: 8,
  },
  navCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 0,
  },
  navCardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  arrowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});
