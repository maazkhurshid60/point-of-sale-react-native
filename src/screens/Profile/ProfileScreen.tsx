import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Image as RNImage,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { LinearGradient } from 'expo-linear-gradient';

export const ProfileScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const isPortrait = height > width;

  const currentUser = useAuthStore((state) => state.currentUser);
  const currentStore = useAuthStore((state) => state.currentStore);
  const setScreen = useUIStore((state) => state.setScreen);

  console.log("Current store ", currentStore);
  console.log("Current user ", currentUser);

  const ProfileItem = ({ label, value, icon, fullWidth = false }: { label: string; value: string; icon: string; fullWidth?: boolean }) => (
    <View style={[styles.itemCard, (isTablet || !isPortrait) && !fullWidth && styles.halfWidthCard]}>
      <View style={styles.itemHeader}>
        <View style={styles.itemIconWrapper}>
          <FontAwesome6 name={icon} size={16} color={COLORS.primary} />
        </View>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <Text style={styles.itemValue} numberOfLines={1}>{value || 'Not available'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Animated Background Header */}
        <LinearGradient
          colors={[COLORS.primary, '#4c1d95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBackground}
        />

        <View style={styles.contentWrapper}>
          {/* Header Navigation */}
          <View style={styles.headerNav}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setScreen('DEFAULT')}
            >
              <FontAwesome6 name="arrow-left" size={18} color="white" />
              <Text style={styles.backText}>Dashboard</Text>
            </TouchableOpacity>
          </View>

          {/* Main Layout Grid */}
          <View style={[styles.mainLayout, (isTablet || !isPortrait) && styles.landscapeLayout]}>

            {/* Identity Card */}
            <View style={[styles.identityCard, (isTablet || !isPortrait) && styles.landscapeIdentity]}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarBorder}>
                  {currentUser?.image ? (
                    <RNImage
                      source={
                        { uri: `${currentUser.image_url}${currentUser.image}` }
                      }
                      style={styles.avatarImage}
                    />
                  ) : (
                    <FontAwesome6 name="user" size={40} color={COLORS.primary} />
                  )}
                </View>
                <View style={styles.statusDot} />
              </View>

              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{currentUser?.name || 'Administrator'}</Text>
                <View style={styles.badgeContainer}>
                  <FontAwesome6 name="crown" size={10} color="#FFD700" />
                  <Text style={styles.userRole}>{currentUser?.employee_type || 'System Admin'}</Text>
                </View>
                <Text style={styles.userUsername}>@{currentUser?.username || 'admin'}</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>1.2k</Text>
                  <Text style={styles.statLabel}>Sales</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>Active</Text>
                  <Text style={styles.statLabel}>Status</Text>
                </View>
              </View>
            </View>

            {/* Details Grid */}
            <View style={[styles.detailsContainer, (isTablet || !isPortrait) && styles.landscapeDetails]}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              <View style={styles.grid}>
                <ProfileItem
                  label="Reference ID"
                  value={`#${currentUser?.user_id || '1024'}`}
                  icon="fingerprint"
                />
                <ProfileItem
                  label="Assigned Store"
                  value={`${currentStore?.store_name || 'Main Warehouse'} ${currentStore?.store_branch ? `(${currentStore?.store_branch})` : ''}`}
                  icon="store"
                />
                <ProfileItem
                  label="AI Credits"
                  value={currentUser?.ai_credits?.toLocaleString() || '0'}
                  icon="microchip"
                />
                <ProfileItem
                  label="Store Status"
                  value={currentStore?.store_status || 'Active'}
                  icon="shield-check"
                />
                <ProfileItem
                  label="Contact Phone"
                  value={currentUser?.contact || 'Not provided'}
                  icon="phone-flip"
                />
                <ProfileItem
                  label="Email Information"
                  value={currentUser?.email || 'admin@ownerspos.com'}
                  icon="envelope-open"
                />
              </View>

              {currentUser?.pinned_modules && currentUser.pinned_modules.length > 0 && (
                <View style={styles.pinnedSection}>
                  <Text style={styles.subSectionTitle}>Pinned Modules</Text>
                  <View style={styles.tagCloud}>
                    {currentUser.pinned_modules.map((module: string, index: number) => (
                      <View key={index} style={styles.moduleTag}>
                        <FontAwesome6 name="circle-check" size={10} color={COLORS.primary} />
                        <Text style={styles.tagText}>{module.replace('-', ' ')}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <TouchableOpacity style={styles.editButton}>
                <FontAwesome6 name="pen-to-square" size={16} color="white" />
                <Text style={styles.editButtonText}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerNav: {
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
  mainLayout: {
    width: '100%',
    alignItems: 'center',
  },
  landscapeLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    gap: 24,
  },
  identityCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.08,
    shadowRadius: 25,
    elevation: 8,
    marginBottom: 24,
  },
  landscapeIdentity: {
    marginBottom: 0,
  },
  avatarContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    resizeMode: 'cover',
  },
  statusDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 4,
    borderColor: 'white',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  userName: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 4,
  },
  userUsername: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  userRole: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  statValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#1E293B',
  },
  statLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 10,
    color: '#94A3B8',
  },
  detailsContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 700,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.08,
    shadowRadius: 25,
    elevation: 8,
  },
  landscapeDetails: {
    flex: 2,
  },
  sectionTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  subSectionTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
    color: '#64748B',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  pinnedSection: {
    width: '100%',
  },
  tagCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moduleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 11,
    color: '#334155',
    textTransform: 'capitalize',
  },
  itemCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  halfWidthCard: {
    width: '47.5%', // Slightly less than 50 to account for gap
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  itemIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(76, 29, 149, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemValue: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 15,
    color: '#334155',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 18,
    marginTop: 30,
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  editButtonText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: 'white',
  },
  versionText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 30,
    letterSpacing: 2,
  }
});
