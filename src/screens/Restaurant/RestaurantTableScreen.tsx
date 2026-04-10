import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const RestaurantTableScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const {
    listOfFloors,
    listOfTables,
    currentFloor,
    setCurrentFloor,
    addFloor,
    addTable,
    removeTable,
  } = useAuthStore();
  const setScreen = useUIStore((state) => state.setScreen);

  useEffect(() => {
    if (listOfFloors.length === 0) {
      addFloor();
    }
  }, []);

  const tablesInCurrentFloor = listOfTables.filter(
    (t) => t.floorid === currentFloor?.floorId
  );

  const renderTable = ({ item }: { item: any }) => (
    <View
      style={[
        styles.tableCard,
        {
          width: isTablet ? 120 : '45%',
          aspectRatio: 1,
          backgroundColor: item.status === 'Occupied' ? '#FFF5F5' : '#F5FFF5',
          borderColor: item.status === 'Occupied' ? '#FEB2B2' : '#C6F6D5',
        },
      ]}
    >
      <View style={styles.tableHeader}>
        <FontAwesome6
          name="utensils"
          size={16}
          color={item.status === 'Occupied' ? '#C53030' : '#2F855A'}
        />
        <Text style={[
          styles.tableId,
          { color: item.status === 'Occupied' ? '#C53030' : '#2F855A' }
        ]}>
          #{item.tableName.split(' ')[1]}
        </Text>
      </View>

      <Text style={styles.tableName}>{item.tableName}</Text>
      <Text style={styles.tableCapacity}>{item.chairsCount} Seats</Text>

      <View style={[
        styles.statusBadge,
        { backgroundColor: item.status === 'Occupied' ? '#C53030' : '#2F855A' }
      ]}>
        <Text style={styles.statusText}>{item.status || 'Available'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen('DEFAULT')}
        >
          <FontAwesome6 name="arrow-left" size={20} color={COLORS.primary} />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Floors</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => currentFloor && addTable(currentFloor.floorId)}>
          <FontAwesome6 name="plus" size={14} color="white" />
          {isTablet && <Text style={styles.addButtonText}>Add Table</Text>}
        </TouchableOpacity>
      </View>

      <View style={[styles.mainBody, isTablet && styles.tabletMainBody]}>
        {/* Floor Selection Sidebar / TabBar */}
        <View style={[styles.floorNav, isTablet ? styles.sidebar : styles.tabBar]}>
          <Text style={styles.navTitle}>{isTablet ? 'Floors' : 'Floor Selection'}</Text>
          <ScrollView
            horizontal={!isTablet}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={!isTablet && styles.tabScrollContent}
          >
            {listOfFloors.map((floor) => (
              <TouchableOpacity
                key={floor.floorId}
                style={[
                  styles.floorItem,
                  currentFloor?.floorId === floor.floorId && styles.activeFloorItem,
                ]}
                onPress={() => setCurrentFloor(floor)}
              >
                <FontAwesome6
                  name="layer-group"
                  size={14}
                  color={currentFloor?.floorId === floor.floorId ? 'white' : COLORS.greyText}
                />
                <Text style={[
                  styles.floorItemText,
                  currentFloor?.floorId === floor.floorId && styles.activeFloorItemText,
                ]}>
                  {floor.floorName}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addFloorButton} onPress={addFloor}>
              <FontAwesome6 name="circle-plus" size={16} color={COLORS.primary} />
              {isTablet && <Text style={styles.addFloorText}>New Floor</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Table View Area */}
        <View style={styles.contentArea}>
          <View style={styles.contentHeader}>
            <Text style={styles.floorHeading}>
              {currentFloor?.floorName || 'Select a floor'}
              <Text style={styles.floorSubheading}> ({tablesInCurrentFloor.length} Tables)</Text>
            </Text>
          </View>

          {tablesInCurrentFloor.length > 0 ? (
            <FlatList
              data={tablesInCurrentFloor}
              renderItem={renderTable}
              keyExtractor={(item) => item.tableId.toString()}
              numColumns={isTablet ? 1 : 2}
              key={isTablet ? 'tablet-list' : 'mobile-list'}
              contentContainerStyle={styles.tableListContent}
              columnWrapperStyle={!isTablet && styles.columnWrapper}
              style={{ flex: 1 }}
              horizontal={isTablet}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome6 name="table-cells" size={48} color="#E2E8F0" />
              <Text style={styles.emptyText}>No tables on this floor yet.</Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => currentFloor && addTable(currentFloor.floorId)}
              >
                <Text style={styles.emptyAddButtonText}>Add First Table</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  backText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 10,
  },
  headerTitle: {
    flex: 1,
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 20,
    color: '#2D3748',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  mainBody: {
    flex: 1,
  },
  tabletMainBody: {
    flexDirection: 'row',
  },
  floorNav: {
    padding: 15,
    backgroundColor: 'white',
  },
  sidebar: {
    width: 240,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
    color: COLORS.greyText,
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 1,
  },
  floorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginRight: 10,
  },
  activeFloorItem: {
    backgroundColor: COLORS.primary,
  },
  floorItemText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 15,
    color: '#4A5568',
    marginLeft: 10,
  },
  activeFloorItemText: {
    color: 'white',
    ...TYPOGRAPHY.montserrat.bold,
  },
  addFloorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 10,
  },
  addFloorText: {
    ...TYPOGRAPHY.montserrat.semiBold,
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 10,
  },
  contentArea: {
    flex: 1,
    padding: 20,
  },
  contentHeader: {
    marginBottom: 20,
  },
  floorHeading: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 24,
    color: '#1A202C',
  },
  floorSubheading: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 16,
    color: COLORS.greyText,
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  tableId: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 12,
  },
  tableName: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 4,
  },
  tableCapacity: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: COLORS.greyText,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableListContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 16,
    color: COLORS.greyText,
    marginTop: 16,
    marginBottom: 24,
  },
  emptyAddButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyAddButtonText: {
    ...TYPOGRAPHY.montserrat.bold,
    color: 'white',
    fontSize: 14,
  },
});
