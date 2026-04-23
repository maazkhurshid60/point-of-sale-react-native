import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { FloorModel } from '../../models';

export default function RestaurantFloorsScreen() {
  const { width } = useWindowDimensions();
  const setScreen = useUIStore((state) => state.setScreen);
  const { fetchFloors, listOfFloors, setCurrentFloor, fetchFloorDetails } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleAddFloor = async () => {
    setIsLoading(true);
    const store = useAuthStore.getState();
    const newFloor = store.addFloor();
    const result = await store.saveFloorLayout();

    if (result.success) {
      // Re-fetch everything to ensure all IDs are server-confirmed
      await fetchFloors();
      // Find the floor we just added in the refreshed list
      //@ts-ignore
      const refreshedFloor = useAuthStore.getState().listOfFloors.find(f => f.floorNo === newFloor.floorNo);
      if (refreshedFloor) {
        await store.fetchFloorDetails(refreshedFloor.floorId);
        store.setCurrentFloor(refreshedFloor);
      }
      setIsLoading(false);
      setScreen('RESTAURANT_TABLES');
    } else {
      setIsLoading(false);
      Alert.alert("Error", "Could not create floor: " + (result.message || "Server Error"));
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    await fetchFloors();
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFloors();
    setRefreshing(false);
  };

  const handleSelectFloor = async (floor: FloorModel) => {
    setIsLoading(true);
    const success = await fetchFloorDetails(floor.floorId);
    setIsLoading(false);
    if (success) {
      setCurrentFloor(floor);
      setScreen('RESTAURANT_TABLES');
    }
  };

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {

    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 18,
    color: '#1A202C',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  floorCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#C6F6D5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 10,
    color: '#2F855A',
  },
  floorName: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 4,
  },
  floorNo: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 12,
    color: '#718096',
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F7FAFC',
    paddingTop: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 12,
    color: '#4A5568',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 15,
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#718096',
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 20,
    color: '#2D3748',
    marginTop: 20,
  },
  emptySub: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 10,
  },
  createBtn: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  createBtnText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 16,
  },
});
