import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useProductStore } from '../../store/useProductStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { ScreenUtil } from '../../utils/ScreenUtil';

export const ProductSearchBar: React.FC = () => {
  const searchQuery = useProductStore((state) => state.searchQuery);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Products"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles.iconButton}>
        <FontAwesome6 name="magnifying-glass" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eee',
    height: 40,
    flex: 1,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.montserrat.regular,
    fontSize: ScreenUtil.setSpText(14),
    color: COLORS.textDark,
    paddingVertical: 8,
  },
  iconButton: {
    paddingLeft: 10,
  },
});
