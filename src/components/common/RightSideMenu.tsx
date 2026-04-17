import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { MenuTab } from './MenuTab';

const RightSideMenu: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isPortrait = height > width;

  const isRightMenuOpen = useUIStore((state) => state.isRightMenuOpen);
  const toggleRightMenu = useUIStore((state) => state.toggleRightMenu);
  const setScreen = useUIStore((state) => state.setScreen);

  const currentUser = useAuthStore((state) => state.currentUser);
  const signOutRequest = useAuthStore((state) => state.signOut);

  const [isSigningOut, setIsSigningOut] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isRightMenuOpen ? 1 : 0,
      useNativeDriver: true,
      friction: 9,
      tension: 40,
    }).start();
  }, [isRightMenuOpen]);

  const slideX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutRequest();
      toggleRightMenu(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSigningOut(false);
    }
  };

  const navigateTo = (screen: any) => {
    setScreen(screen);
    toggleRightMenu(false);
  };

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 2100, elevation: 2100 }]} pointerEvents={isRightMenuOpen ? 'auto' : 'none'}>
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity }
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => toggleRightMenu(false)} />
      </Animated.View>
      <Animated.View
        style={[
          styles.drawerContainer,
          {
            transform: [{ translateX: slideX }],
            width: isPortrait ? width * 0.85 : width * 0.35
          },
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, '#4c1d95']}
          style={styles.gradient}
        >
          <View style={[styles.mainWrapper, { paddingTop: insets.top + 20 }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {/* Header / Close */}
              <View style={styles.drawerHeader}>
                <Pressable
                  onPress={() => toggleRightMenu(false)}
                  style={({ pressed }) => [
                    styles.closeButton,
                    { backgroundColor: pressed ? 'rgba(255,255,255,0.1)' : 'transparent' }
                  ]}
                >
                  <FontAwesome6 name="xmark" size={24} color="white" />
                </Pressable>
                <Text style={styles.headerLabel}>MENU</Text>
              </View>

              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  <FontAwesome6 name="circle-user" size={54} color="white" />
                </View>
                <View style={styles.profileTextWrapper}>
                  <Text style={styles.userName}>{currentUser?.username || 'Administrator'}</Text>
                  <Text style={styles.userDetails}>
                    {currentUser?.email || 'Store Staff'}
                  </Text>
                </View>
              </View>

              {/* Main Navigation Items */}
              <View style={styles.menuItems}>
                <Text style={styles.sectionLabel}>OPERATIONS</Text>

                <MenuTab
                  title="Dashboard"
                  subtitle="Primary controls"
                  icon="gauge"
                  onTap={() => navigateTo('DEFAULT')}
                />

                <MenuTab
                  title="Shift Details"
                  subtitle="Work shift status"
                  icon="user-check"
                  onTap={() => navigateTo('SHIFT_DETAILS')}
                />

                <MenuTab
                  title="Sales History"
                  subtitle="View past sales"
                  icon="address-card"
                  onTap={() => navigateTo('SALES')}
                />

                <MenuTab
                  title="Orders"
                  subtitle="Pending orders"
                  icon={<MaterialIcons name="receipt-long" size={22} color="white" />}
                  onTap={() => navigateTo('ORDER_REVIEW')}
                />

                <MenuTab
                  title="Daily Cash Report"
                  subtitle="Summary of today's cash"
                  icon="file-invoice-dollar"
                  onTap={() => navigateTo('DAILY_REPORT')}
                />

                <View style={styles.sectionDivider} />
                <Text style={styles.sectionLabel}>MANAGEMENT</Text>

                <MenuTab
                  title="Hold Sales"
                  subtitle="Recall paused sales"
                  icon="hand-holding-dollar"
                  onTap={() => navigateTo('HOLD_SALES')}
                />

                <MenuTab
                  title="Expenses"
                  subtitle="Record store costs"
                  icon="money-bills"
                  onTap={() => navigateTo('POS_EXPENSE')}
                />

                <MenuTab
                  title="Restaurant"
                  subtitle="Floor management"
                  icon={<MaterialIcons name="table-restaurant" size={22} color="white" />}
                  onTap={() => navigateTo('RESTAURANT_FLOORS')}
                />

                <View style={styles.sectionDivider} />
                <Text style={styles.sectionLabel}>UTILITIES</Text>

                <MenuTab
                  title="Profile"
                  subtitle="Account info"
                  icon="circle-user"
                  isSmall
                  onTap={() => navigateTo('PROFILE')}
                />

                <MenuTab
                  title="Settings"
                  subtitle="Terminal config"
                  icon="gear"
                  isSmall
                  onTap={() => navigateTo('POS_SETTINGS')}
                />

                <MenuTab
                  title="Offline Sync"
                  subtitle="Manage local sales"
                  icon={<MaterialIcons name="signal-wifi-off" size={22} color="white" />}
                  isSmall
                  onTap={() => navigateTo('OFFLINE_SALES')}
                />

                <View style={styles.sectionDivider} />

                <Pressable
                  onPress={handleSignOut}
                  style={({ pressed }) => [
                    styles.signOutButton,
                    { backgroundColor: pressed ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)' }
                  ]}
                >
                  <FontAwesome6 name="arrow-right-from-bracket" size={20} color="#ef4444" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
              </View>


              {isSigningOut && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator color="white" size="large" />
                </View>
              )}
            </ScrollView>
          </View>
        </LinearGradient>
      </Animated.View>
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
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    zIndex: 2200,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: -10, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 3000,
  },
  gradient: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerLabel: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    letterSpacing: 3,
    marginRight: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  profileTextWrapper: {
    marginLeft: 15,
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: 'white',
  },
  userDetails: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  menuItems: {
    flex: 1,
  },
  sectionLabel: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 12,
    marginLeft: 5,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    gap: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  signOutText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#ef4444',
  },
  loadingOverlay: {
    marginTop: 20,
    alignItems: 'center',
  }
});

export default RightSideMenu;
