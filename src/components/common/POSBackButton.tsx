import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScreenUtil } from '../../utils/ScreenUtil';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface POSBackButtonProps {
  onPress: (index: number) => void;
  index: number;
}

/**
 * A responsive Back button component migrated from Flutter.
 * optimized for both Mobile and Tablet layouts.
 */
export const POSBackButton: React.FC<POSBackButtonProps> = ({ onPress, index }) => {
  const { width } = useWindowDimensions();
  
  // Responsive check mirroring the Flutter logic (< 610px)
  const isSmallWidth = width < 610;

  // Base font size - Adjusted to look better on phones
  const baseFontSize = isSmallWidth ? 18 : 20;
  
  return (
    <Pressable
      onPress={() => onPress(index)}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.7 : 1 }
      ]}
      hitSlop={10} // Makes it easier to tap on mobile
    >
      <View style={styles.row}>
        <FontAwesome6 
          name="chevron-left" 
          size={isSmallWidth ? 16 : 18} 
          color="rgba(100, 100, 100, 1)" 
        />
        
        <View style={styles.spacer} />
        
        <Text 
          style={[
            styles.text,
            { fontSize: ScreenUtil.setSpText(baseFontSize) }
          ]}
        >
          Back
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    width: 10,
  },
  text: {
    fontFamily: TYPOGRAPHY.fontFamily,
    color: 'rgba(100, 100, 100, 1)',
  },
});
