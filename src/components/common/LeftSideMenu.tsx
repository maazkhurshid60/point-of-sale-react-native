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
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { ProductsListing } from '../catalog/ProductsListing';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { MenuTab } from './MenuTab';
import { LeftSideMenuDropdown } from './LeftSideMenuDropdown';

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

  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (!isPortrait && isLeftMenuOpen) {
      fetchCashAccounts();
    }
  }, [isPortrait, isLeftMenuOpen]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isLeftMenuOpen ? 0 : -width,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [isLeftMenuOpen, width]);

  // Mobile (Portrait) Layout - Drawer for Products Listing
  if (isPortrait) {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents={isLeftMenuOpen ? 'auto' : 'none'}>
        <Pressable
          style={[styles.backdrop, { opacity: isLeftMenuOpen ? 1 : 0 }]}
          onPress={() => toggleLeftMenu(false)}
        />
        <Animated.View
          style={[
            styles.drawerContainer,
            { transform: [{ translateX: slideAnim }], width: width * 0.9 },
          ]}
        >
          <View style={[styles.drawerHeader, { paddingTop: insets.top + 10 }]}>
            <Pressable
              onPress={() => toggleLeftMenu(false)}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.6 : 1 }
              ]}
            >
              <FontAwesome6 name="xmark" size={24} color={COLORS.primary} />
            </Pressable>
            <Text style={styles.drawerTitle}>Product Catalog</Text>
          </View>

          <View style={styles.listingWrapper}>
            <ProductsListing isGridView={true} />
          </View>
        </Animated.View>
      </View>
    );
  }

  // Tablet/Web (Landscape) Layout - Side Navigation Bar
  return (
    <Animated.View
      style={[
        styles.sideBarContainer,
        {
          width: isLeftMenuOpen ? width * 0.28 : 0,
          opacity: isLeftMenuOpen ? 1 : 0,
          transform: [{ translateX: isLeftMenuOpen ? 0 : -width * 0.28 }]
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

        {/* Footer info or version */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <Text style={styles.versionText}>POS v2.0.4 - Premium</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 20,
    paddingHorizontal: 20,
    zIndex: 2000,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 22,
  },
  drawerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 22,
    marginLeft: 15,
    color: '#1C1B1F',
  },
  listingWrapper: {
    flex: 1,
    marginTop: 10,
  },
  sideBarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
    zIndex: 2000,
  },
  sideBarInner: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContent: {
    paddingVertical: 10,
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
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 2,
  },
  sectionDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 20,
  },
  dropdownWrapper: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  footer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  versionText: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
});

export default LeftSideMenu;
