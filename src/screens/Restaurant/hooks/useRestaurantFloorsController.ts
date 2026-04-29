import { useEffect, useState } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { useRestaurantStore } from '../../../store/useRestaurantStore';
import { useUIStore } from '../../../store/useUIStore';
import { FloorModel } from '../../../models';

export const useRestaurantFloorsController = () => {
  const { width } = useWindowDimensions();
  const setScreen = useUIStore((state) => state.setScreen);
  const { fetchFloors, listOfFloors, setCurrentFloor, fetchFloorDetails } = useRestaurantStore();

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleAddFloor = async () => {
    setIsLoading(true);
    const store = useRestaurantStore.getState();
    const newFloor = store.addFloor();
    const result = await store.saveFloorLayout();

    if (result.success) {
      await fetchFloors();
      //@ts-ignore
      const refreshedFloor = useRestaurantStore.getState().listOfFloors.find(f => f.floorNo === newFloor.floorNo);
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

  return {
    width,
    setScreen,
    listOfFloors,
    isLoading,
    refreshing,
    handleAddFloor,
    onRefresh,
    handleSelectFloor,
  };
};
