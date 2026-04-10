import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { ScreenUtil } from '../../utils/ScreenUtil';

export const ProfileScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const isPortrait = height > width;

  const currentUser = useAuthStore((state) => state.currentUser);
  const currentStore = useAuthStore((state) => state.currentStore);
  const setScreen = useUIStore((state) => state.setScreen);

  const ProfileItem = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View style={[styles.itemContainer, isTablet && styles.tabletItem]}>
      <View style={styles.iconCircle}>
        <FontAwesome6 name={icon} size={18} color={COLORS.primary} />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemValue} numberOfLines={2}>{value || 'Not available'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setScreen('DEFAULT')}
          >
            <FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />
            <Text style={styles.backText}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, isTablet && styles.tabletCard]}>
          {/* Top Identity Section */}
          <View style={styles.identitySection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBackground}>
                <FontAwesome6 name="circle-user" size={ScreenUtil.width(180)} color="white" />
              </View>
            </View>
            <Text style={styles.userName}>{currentUser?.username || 'User Profile'}</Text>
            <Text style={styles.userRole}>{currentUser?.employee_type || 'POS Administrator'}</Text>
          </View>

          <View style={styles.cardDivider} />

          {/* Details Section */}
          <View style={[styles.detailsSection, isTablet && styles.tabletDetailsGrid]}>
            <ProfileItem 
              label="User ID" 
              value={`#${currentUser?.id || '001'}`} 
              icon="id-card" 
            />
            <ProfileItem 
              label="Active Store" 
              value={currentStore?.store_name || 'Main Branch'} 
              icon="store" 
            />
            <ProfileItem 
              label="Contact Number" 
              value={currentUser?.contact || 'N/A'} 
              icon="phone" 
            />
            <ProfileItem 
              label="Email Address" 
              value={currentUser?.email || 'N/A'} 
              icon="envelope" 
            />
          </View>
          
          <View style={styles.cardFooter}>
             <Text style={styles.footerNote}>POS Terminal v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  headerNav: {
    width: '100%',
    maxWidth: 900,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 10,
  },
  profileCard: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tabletCard: {
    padding: 40,
  },
  identitySection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    marginBottom: 20,
  },
  avatarBackground: {
    width: ScreenUtil.width(260),
    height: ScreenUtil.width(260),
    borderRadius: ScreenUtil.width(130),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  userName: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 28,
    color: '#212529',
    textAlign: 'center',
  },
  userRole: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 16,
    color: '#6C757D',
    marginTop: 5,
    textAlign: 'center',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    width: '100%',
    marginVertical: 10,
  },
  detailsSection: {
    paddingVertical: 20,
  },
  tabletDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
    width: '100%',
  },
  tabletItem: {
    width: '48%',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(106, 27, 154, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemLabel: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#ADB5BD',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemValue: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 16,
    color: '#343A40',
    marginTop: 3,
  },
  cardFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerNote: {
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: 12,
    color: '#DEE2E6',
  }
});
