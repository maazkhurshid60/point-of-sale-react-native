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
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useUIStore, AppScreen } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';

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
      { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }
    ]}
  >
    <View style={styles.imageContainer}>
      <Image source={imagePath} style={styles.image} resizeMode="contain" />
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={3}>{description}</Text>
    </View>
    <View style={styles.arrowContainer}>
      <FontAwesome6 name="chevron-right" size={16} color={COLORS.primary} />
    </View>
  </Pressable>
);

export default function ReportsMenuScreen() {
  const setScreen = useUIStore((state) => state.setScreen);

  const reports = [
    {
      id: 0,
      title: 'Products Report',
      description: 'A comprehensive Point of Sale product report detailing sales, transactions, and inventory data.',
      imagePath: require('../../../assets/images/product_rep.png'),
      screen: 'PRODUCT_REPORT' as AppScreen,
    },
    {
      id: 1,
      title: 'Invoice Payment Report',
      description: 'Invoice Report provide a concise report detailing payment transactions recorded in the system.',
      imagePath: require('../../../assets/images/invoice_rep.png'),
      screen: 'INVOICE_REPORT' as AppScreen,
    },
    {
      id: 2,
      title: 'Cashier Report',
      description: 'Cashier Report provides a summary of financial transactions processed by cashiers.',
      imagePath: require('../../../assets/images/cashier_rep.png'),
      screen: 'CASHIER_REPORT' as AppScreen,
    },
    {
      id: 3,
      title: 'Credit Sale Report',
      description: 'Credit Report provides a concise overview of credit transactions and payments.',
      imagePath: require('../../../assets/images/credit_rep.png'),
      screen: 'CREDIT_REPORT' as AppScreen,
    },
    {
      id: 4,
      title: 'Stock Warehouse Report',
      description: 'Comprehensive Warehouse Management Report providing detailed insights into inventory levels.',
      imagePath: require('../../../assets/images/warehouse_rep.png'),
      screen: 'WAREHOUSE_REPORT' as AppScreen,
    },
    {
      id: 5,
      title: 'Stock Store Report',
      description: 'Store Performance Report offering a comprehensive overview of sales and inventory status.',
      imagePath: require('../../../assets/images/store_rep.png'),
      screen: 'STORE_REPORT' as AppScreen,
    },
    {
      id: 6,
      title: 'Daily Cash Report',
      description: 'Store Performance Report offering a comprehensive overview of sales, customer transactions, and inventory status.',
      imagePath: require('../../../assets/images/store_rep.png'),
      screen: 'DAILY_REPORT' as AppScreen,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => setScreen('DEFAULT')} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={20} color="#1C1B1F" />
        </Pressable>
        <Text style={styles.headerTitle}>All Reports</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            title={report.title}
            description={report.description}
            imagePath={report.imagePath}
            onPress={() => setScreen(report.screen)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1B1F',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  image: {
    width: 40,
    height: 40,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1B1F',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  arrowContainer: {
    marginLeft: 8,
  },
});
