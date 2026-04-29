import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image as RNImage,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfileController } from './hooks/useProfileController';
import { styles } from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const {
    isTablet,
    isPortrait,
    currentUser,
    currentStore,
    setScreen,
  } = useProfileController();

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
        <LinearGradient
          colors={[COLORS.primary, '#4c1d95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBackground}
        />

        <View style={styles.contentWrapper}>
          <View style={styles.headerNav}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setScreen('DEFAULT')}
            >
              <FontAwesome6 name="arrow-left" size={18} color="white" />
              <Text style={styles.backText}>Dashboard</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.mainLayout, (isTablet || !isPortrait) && styles.landscapeLayout]}>
            <View style={[styles.identityCard, (isTablet || !isPortrait) && styles.landscapeIdentity]}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarBorder}>
                  {currentUser?.image ? (
                    <RNImage
                      source={{ uri: `${currentUser.image_url}${currentUser.image}` }}
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

export default ProfileScreen;
