import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FloorModel } from '../../models';
import { useRestaurantFloorsController } from './hooks/useRestaurantFloorsController';
import { styles } from './RestaurantFloorsScreen.styles';

export default function RestaurantFloorsScreen() {
  const {
    width,
    setScreen,
    listOfFloors,
    isLoading,
    refreshing,
    handleAddFloor,
    onRefresh,
    handleSelectFloor,
  } = useRestaurantFloorsController();

  const renderFloorItem = ({ item }: { item: FloorModel }) => {
    const numColumns = width > 700 ? 3 : 2;
    const itemWidth = (width - 60) / numColumns;

    return (
      <TouchableOpacity
        style={[styles.floorCard, { width: itemWidth }]}
        onPress={() => handleSelectFloor(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="layers-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        <Text style={styles.floorName} numberOfLines={1}>{item.floorName}</Text>
        <Text style={styles.floorNo}>Floor No: {item.floorNo}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.statItem}>
            <Ionicons name="cube-outline" size={14} color="#718096" />
            <Text style={styles.statText}>{item.noOfTable} Tables</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('DEFAULT')}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Floors</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddFloor}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Loading Floors...</Text>
        </View>
      ) : (
        <FlatList
          data={listOfFloors}
          keyExtractor={(item) => item.floorId.toString()}
          renderItem={renderFloorItem}
          numColumns={width > 700 ? 3 : 2}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="floor-plan" size={80} color="#E2E8F0" />
              <Text style={styles.emptyTitle}>No Floors Found</Text>
              <Text style={styles.emptySub}>Add a new floor to start managing your restaurant tables.</Text>
              <TouchableOpacity style={styles.createBtn} onPress={handleAddFloor}>
                <Text style={styles.createBtnText}>Create First Floor</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}
