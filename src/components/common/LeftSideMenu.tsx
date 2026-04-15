import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { ProductsListing } from '../catalog/ProductsListing';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { MenuTab } from './MenuTab';
import { LeftSideMenuDropdown } from './LeftSideMenuDropdown';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const LeftSideMenu: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isPortrait = height > width;

  const isLeftMenuOpen = useUIStore((state) => state.isLeftMenuOpen);
  const toggleLeftMenu = useUIStore((state) => state.toggleLeftMenu);
  const setScreen = useUIStore((state) => state.setScreen);

  const currentStore = useAuthStore((state) => state.currentStore);
  const leadSettings = useAuthStore((state) => state.leadSettings);
  const cashAccounts = useAuthStore((state) => state.cashAccounts);
  const fetchCashAccounts = useAuthStore((state) => state.fetchCashAccounts);
  const updateCashAccount = useAuthStore((state) => state.updateCashAccount);

  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isLeftMenuOpen ? 1 : 0,
      useNativeDriver: true,
      friction: 9,
      tension: 40,
    }).start();
  }, [isLeftMenuOpen]);

  const slideX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  });

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (isPortrait) {
    return (
      <View style={[StyleSheet.absoluteFill, { zIndex: 10000, elevation: 10000 }]} pointerEvents={isLeftMenuOpen ? 'auto' : 'none'}>
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity }
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => toggleLeftMenu(false)} />
        </Animated.View>
        <Animated.View
          style={[
            styles.drawerContainer,
            { transform: [{ translateX: slideX }], width: width * 0.85 },
          ]}
        >
          <View style={[styles.drawerHeader, { paddingTop: insets.top + 10 }]}>
            <View style={styles.headerTop}>
              <Pressable
                onPress={() => toggleLeftMenu(false)}
                style={styles.closeButton}
              >
                <FontAwesome6 name="chevron-left" size={20} color={COLORS.primary} />
              </Pressable>
              <Text style={styles.drawerTitle}>Menu</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.drawerScrollContent}
          >
            <View style={styles.listingWrapper}>
              <ProductsListing isGridView={true} />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 10000, elevation: 10000 }]} pointerEvents={isLeftMenuOpen ? 'auto' : 'none'}>
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity }
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => toggleLeftMenu(false)} />
      </Animated.View>
      <AnimatedLinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        style={[
          styles.sideBarContainer,
          {
            width: width * 0.32,
            transform: [{ translateX: slideX }]
          },
        ]}
      >
        <View style={[styles.sideBarInner, { paddingTop: insets.top + 20 }]}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerLabel}>NAVIGATION</Text>
              <Pressable
                onPress={() => toggleLeftMenu(false)}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.6 : 1 }
                ]}
              >
                <FontAwesome6 name="chevron-left" size={20} color="white" />
              </Pressable>
            </View>

            {/* Nav Items */}
            <MenuTab
              title="Dashboard"
              subtitle="Central overview"
              icon="gauge"
              onTap={() => {
                setScreen('DEFAULT');
                toggleLeftMenu(false);
              }}
            />

            <View style={styles.sectionDivider} />

            <MenuTab
              title={leadSettings?.[0]?.company_name || 'Store Name'}
              subtitle={currentStore?.store_name || 'Branch Office'}
              icon="store"
              onTap={() => { }}
            />

            <View style={styles.sectionDivider} />

            <View style={styles.dropdownWrapper}>
              <LeftSideMenuDropdown
                label="CASH ACCOUNT"
                value={currentStore?.default_cash_account_name || 'Select Account'}
                items={cashAccounts.map((acc: any) => ({ name: acc.name, value: acc.id }))}
                onSelect={(item) => updateCashAccount(item.name, item.value)}
              />
            </View>

            <View style={styles.sectionDivider} />

            <MenuTab
              title="Add Customer"
              subtitle="Register new clients"
              icon="user-plus"
              onTap={() => {
                setScreen('CUSTOMERS');
                toggleLeftMenu(false);
              }}
            />

          </ScrollView>

        </View>
      </AnimatedLinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F8FAFC',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    zIndex: 2000,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  drawerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: '#1E293B',
  },
  drawerScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  listingWrapper: {
    flex: 1,
  },
  sideBarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 25,
    zIndex: 2000,
  },
  sideBarInner: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  headerLabel: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    letterSpacing: 3,
  },
  sectionDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 15,
  },
  dropdownWrapper: {
    marginTop: 5,
  },
  footer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 20,
  },
  versionText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
});

export default LeftSideMenu;
