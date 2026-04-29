import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useRestaurantStore } from '../../../store/useRestaurantStore';
import { useUIStore } from '../../../store/useUIStore';

export const useRestaurantController = () => {
  const { width: windowWidth } = useWindowDimensions();
  const store = useRestaurantStore();
  const setScreen = useUIStore((state) => state.setScreen);
  
  const [isSaving, setIsSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ 
    visible: boolean; 
    type: 'success' | 'error' | 'confirm'; 
    title: string; 
    message: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: 'success',
    title: '',
    message: ''
  });

  const selectedTable = store.listOfTables.find(t => t.isSelected);
  const selectedDecoration = store.listofdecorations.find(d => d.isSelected);

  useEffect(() => {
    if (store.listOfFloors.length === 0) {
      store.addFloor();
    }
  }, []);

  const tablesInCurrentFloor = store.listOfTables.filter(
    (t) => Number(t.floorid) === Number(store.currentFloor?.floorId)
  );

  const decorationsInCurrentFloor = store.listofdecorations.filter(
    (d) => Number(d.floor) === Number(store.currentFloor?.floorId)
  );

  const handleSelectTable = (id: number) => {
    store.updateTableSelection(id);
    store.updateDecorationSelection(null);
  };

  const handleSelectDecoration = (id: number) => {
    store.updateDecorationSelection(id);
    store.updateTableSelection(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await store.saveFloorLayout();
    setIsSaving(false);
    if (result.success) {
      if (store.currentFloor) {
        await store.fetchFloorDetails(store.currentFloor.floorId);
      }
      setModalConfig({
        visible: true,
        type: 'success',
        title: "Great Success!",
        message: "Restaurant layout saved successfully!"
      });
    } else {
      setModalConfig({
        visible: true,
        type: 'error',
        title: "Oops! Something went wrong",
        message: result.message || "Failed to save restaurant layout. Please try again."
      });
    }
  };

  const confirmRemoveFloor = () => {
    setModalConfig({
      visible: true,
      type: 'confirm',
      title: "Delete Floor",
      message: `Are you sure you want to delete "${store.currentFloor?.floorName}" and all its tables? This action cannot be undone until you save.`,
      onConfirm: () => {
        store.removeFloor();
        setModalConfig(prev => ({ ...prev, visible: false }));
      }
    });
  };

  const closeModal = () => setModalConfig({ ...modalConfig, visible: false });

  return {
    // State
    store,
    selectedTable,
    selectedDecoration,
    tablesInCurrentFloor,
    decorationsInCurrentFloor,
    isSaving,
    modalConfig,
    
    // Actions
    setScreen,
    handleSelectTable,
    handleSelectDecoration,
    handleSave,
    confirmRemoveFloor,
    closeModal,
  };
};
