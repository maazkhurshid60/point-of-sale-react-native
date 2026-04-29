import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useReportsMenuController } from './hooks/useReportsMenuController';
import { styles } from './ReportsMenuScreen.styles';

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

export const ReportsMenuScreen: React.FC = () => {
  const { reports, setScreen } = useReportsMenuController();

  return (
    <View style={styles.container}>
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
};

export default ReportsMenuScreen;
