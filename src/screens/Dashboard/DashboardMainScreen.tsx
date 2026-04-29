import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { styles } from './DashboardMainScreen.styles';
import { useDashboardMainController } from './hooks/useDashboardMainController';

interface StatCardProps {
  title: string;
  amount: string;
  icon: string;
  gradientColors: string[];
  delay: number;
  width: number | string;
}

const StatCard = ({ title, amount, icon, gradientColors, delay, width }: StatCardProps) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
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
  }, [delay, rotateAnim, scaleAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  return (
    <Animated.View
      style={StyleSheet.flatten([
        styles.statCard,
        {
          width: width as any,
          opacity: scaleAnim as any,
          transform: [
            { scale: scaleAnim as any },
            { rotate: spin as any },
            {
              translateY: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
              }) as any
            }
          ]
        }
      ])}
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
  const popAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
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
  }, [delay, popAnim, slideAnim]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        {
          width: width as any,
          opacity: popAnim as any,
          transform: [
            {
              scale: popAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }) as any
            },
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 50],
              }) as any
            }
          ]
        }
      ])}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => StyleSheet.flatten([
          styles.navCard,
          { transform: [{ scale: pressed ? 0.96 : 1 }] }
        ])}
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

          <Animated.View style={StyleSheet.flatten([
            styles.navTextContainer,
            {
              opacity: popAnim as any,
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                }) as any
              }]
            }
          ])}>
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
  const {
    isTabletOrLaptop,
    refreshing,
    currentUser,
    currentStore,
    statCardWidth,
    navCardWidth,
    onRefresh,
    handlePOSClick,
    setScreen,
  } = useDashboardMainController();

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={StyleSheet.flatten([
          styles.contentContainer,
          isTabletOrLaptop && { alignSelf: 'center', width: '100%', maxWidth: 1400 }
        ])}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor="white"
          />
        }
      >
        <View style={styles.scrollingHeader}>
          <LinearGradient
            colors={[COLORS.primary, '#4c1d95']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradientScroll}
          />

          <View style={styles.heroSection}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={StyleSheet.flatten([styles.userNameText, isTabletOrLaptop && { fontSize: 32 }])}>
                {currentUser?.name || 'Administrator'}
              </Text>
              <View style={styles.storeBadge}>
                <FontAwesome6 name="shop" size={10} color="white" style={{ opacity: 0.8 }} />
                <Text style={styles.storeText}>{currentStore?.store_name || 'Main Branch'}</Text>
              </View>
            </View>
            <View style={styles.heroRight}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarInner}>
                  <FontAwesome6 name="user" size={20} color={COLORS.primary} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.mainFeed}>
          <Pressable style={isTabletOrLaptop ? styles.dateSelectorContainerTablet : styles.dateSelectorContainer}>
            <View style={styles.dateSelector}>
              <View style={styles.dateSelectorInner}>
                <FontAwesome6 name="calendar-days" size={14} color={COLORS.primary} />
                <Text style={styles.dateText}>April 14, 2026</Text>
              </View>
              <View style={StyleSheet.flatten([styles.filterBadge, { backgroundColor: COLORS.primary }])}>
                <FontAwesome6 name="sliders" size={12} color="white" />
              </View>
            </View>
          </Pressable>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Business Overview</Text>
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
            <Text style={styles.sectionTitle}>Main Terminals</Text>
          </View>

          <View style={StyleSheet.flatten([styles.navContainer, isTabletOrLaptop && { flexDirection: 'row', flexWrap: 'wrap' }])}>
            <NavCard
              title="Point of Sale"
              subtitle="Process transactions quickly with our cloud-powered POS system"
              icon="laptop"
              onPress={handlePOSClick}
              gradientColors={[COLORS.primary, COLORS.primaryLight]}
              delay={500}
              width={navCardWidth}
            />
            <NavCard
              title="Analytics Hub"
              subtitle="Explore detailed reports and visualize your business growth"
              icon="magnifying-glass-chart"
              onPress={() => setScreen('REPORTS_MENU')}
              gradientColors={['#10B981', '#059669']}
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
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
