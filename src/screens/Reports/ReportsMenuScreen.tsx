import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  ImageSourcePropType,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useUIStore, AppScreen } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

const { width } = Dimensions.get('window');

interface ReportCardProps {
  title: string;
  description: string;
  imagePath: ImageSourcePropType;
  onPress: () => void;
}

const ReportCard = ({ title, description, imagePath, onPress }: ReportCardProps) => (
  <Pressable 
    onPress={onPress} 
    style={({ pressed }) => [
      styles.card,
      { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
    ]}
  >
    <View style={styles.imageContainer}>
      <Image source={imagePath} style={styles.image} resizeMode="contain" />
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
    </View>
    <View style={styles.arrowContainer}>
      <View style={styles.arrowCircle}>
        <FontAwesome6 name="chevron-right" size={12} color={COLORS.primary} />
      </View>
    </View>
  </Pressable>
);

export default function ReportsMenuScreen() {
  const setScreen = useUIStore((state) => state.setScreen);

  const reports = [
    {
      id: 0,
      title: 'Products Report',
      description: 'Detailed insights into sales transactions and inventory movements.',
      imagePath: require('../../../assets/images/product_rep.png'),
      screen: 'PRODUCT_REPORT' as AppScreen,
    },
    {
      id: 1,
      title: 'Invoice Payment Report',
      description: 'Track payment transactions and records within your POS system.',
      imagePath: require('../../../assets/images/invoice_rep.png'),
      screen: 'INVOICE_REPORT' as AppScreen,
    },
    {
      id: 2,
      title: 'Cashier Performance',
      description: 'Summarized financial metrics processed by individual cashiers.',
      imagePath: require('../../../assets/images/cashier_rep.png'),
      screen: 'CASHIER_REPORT' as AppScreen,
    },
    {
      id: 3,
      title: 'Credit Sale Report',
      description: 'Concise overview of credit-based transactions and collections.',
      imagePath: require('../../../assets/images/credit_rep.png'),
      screen: 'CREDIT_REPORT' as AppScreen,
    },
    {
      id: 4,
      title: 'Warehouse Stock',
      description: 'Inventory levels and logistics across your primary warehouses.',
      imagePath: require('../../../assets/images/warehouse_rep.png'),
      screen: 'WAREHOUSE_REPORT' as AppScreen,
    },
    {
      id: 5,
      title: 'Store Inventory',
      description: 'Direct visibility into stock levels at your local branch.',
      imagePath: require('../../../assets/images/store_rep.png'),
      screen: 'STORE_REPORT' as AppScreen,
    },
    {
      id: 6,
      title: 'Daily Cash Flow',
      description: 'Daily operational summary of sales and customer transactions.',
      imagePath: require('../../../assets/images/store_rep.png'),
      screen: 'DAILY_REPORT' as AppScreen,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Clean Header with Back Button */}
      <View style={styles.header}>
        <Pressable onPress={() => setScreen('DEFAULT')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Analytics Hub</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <View style={styles.sectionLabelContainer}>
             <Text style={styles.sectionLabel}>AVAILABLE REPORTS</Text>
          </View>
          
          <View style={styles.grid}>
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.title}
                description={report.description}
                imagePath={report.imagePath}
                onPress={() => setScreen(report.screen)}
              />
            ))}
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: '#1A202C',
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContent: {
    padding: 20,
  },
  sectionLabelContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: '#64748B',
    letterSpacing: 1.5,
  },
  grid: {
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  image: {
    width: 35,
    height: 35,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  description: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  arrowContainer: {
    marginLeft: 10,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
