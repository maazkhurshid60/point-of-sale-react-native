import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { FontAwesome6, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  FadeInLeft,
  Layout,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { TableModel, DecorationModel } from '../../models';
import { CustomButton } from '../../components/common/CustomButton';
import { ActionModal } from '../../components/common/ActionModal';

const TABLE_MIN_SIZE = 50;
const FLOOR_BG = require('../../../assets/images/floor.png');
const LEAF_IMG = require('../../../assets/images/leaf.png');

// --- Helper Components ---

interface ChairProps {
  side: number; // 0: top, 1: right, 2: bottom, 3: left
  count: number;
}

const Chairs: React.FC<ChairProps> = ({ side, count }) => {
  const chairs = [];
  for (let i = 0; i < count; i++) {
    chairs.push(
      <MaterialCommunityIcons
        key={i}
        name="chair-school"
        size={14}
        color="#2D3748"
        style={{ margin: 1 }}
      />
    );
  }

  const getStyle = (): any => {
    switch (side) {
      case 0: return { position: 'absolute', top: -20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' };
      case 1: return { position: 'absolute', right: -20, top: 0, bottom: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
      case 2: return { position: 'absolute', bottom: -20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' };
      case 3: return { position: 'absolute', left: -20, top: 0, bottom: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
      default: return {};
    }
  };

  return <View style={getStyle()}>{chairs}</View>;
};

// --- Professional Control Card ---

const ControlCard: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => (
  <Animated.View
    entering={FadeInLeft.duration(300)}
    layout={Layout.springify()}
    style={styles.properCard}
  >
    <View style={styles.properCardHeader}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon as any} size={16} color="white" />
      </View>
      <Text style={styles.properCardTitle}>{title}</Text>
    </View>
    <View style={styles.properCardContent}>
      {children}
    </View>
  </Animated.View>
);

// --- Main Draggable Table Component ---

interface TableProps {
  table: TableModel;
  onSelect: (id: number) => void;
  onUpdatePosition: (id: number, x: number, y: number) => void;
  onUpdateSize: (id: number, w: number, h: number) => void;
}

const DraggableTable: React.FC<TableProps> = ({ table, onSelect, onUpdatePosition, onUpdateSize }) => {
  const translateX = useSharedValue(table.x);
  const translateY = useSharedValue(table.y);
  const context = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    translateX.value = table.x;
    translateY.value = table.y;
  }, [table.x, table.y]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
      runOnJS(onSelect)(table.tableId);
    })
    .onUpdate((event) => {
      translateX.value = context.value.x + event.translationX;
      translateY.value = context.value.y + event.translationY;
    })
    .onEnd(() => {
      runOnJS(onUpdatePosition)(table.tableId, translateX.value, translateY.value);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${table.rotation * 360}deg` },
    ],
  }));

  const resizeContext = useSharedValue({ w: table.width, h: table.height });

  const resizeGesture = Gesture.Pan()
    .onStart(() => {
      resizeContext.value = { w: table.width, h: table.height };
      runOnJS(onSelect)(table.tableId);
    })
    .onUpdate((event) => {
      const newWidth = Math.max(TABLE_MIN_SIZE, resizeContext.value.w + event.translationX);
      const newHeight = Math.max(TABLE_MIN_SIZE, resizeContext.value.h + event.translationY);
      runOnJS(onUpdateSize)(table.tableId, newWidth, newHeight);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={StyleSheet.flatten([
          styles.tableContainer,
          animatedStyle as any,
          {
            width: table.width,
            height: table.height,
            borderRadius: table.isRounded ? 100 : 8,
            borderWidth: table.isSelected ? 3 : 1,
            zIndex: table.isSelected ? 50 : 1,
            borderColor: table.isSelected ? '#FFD700' : '#A0AEC0',
          },
        ])}
      >
        <Text style={styles.tableText}>{table.tableName}</Text>
        {table.listofChairs.map((count, index) => (
          <Chairs key={index} side={index} count={count} />
        ))}
        {table.isSelected && (
          <GestureDetector gesture={resizeGesture}>
            <View style={styles.resizeHandle}>
              <Ionicons name="expand" size={12} color="white" />
            </View>
          </GestureDetector>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

// --- Draggable Decoration Component ---

interface DecorationProps {
  decoration: DecorationModel;
  onSelect: (id: number) => void;
  onUpdatePosition: (id: number, x: number, y: number) => void;
}

const DraggableDecoration: React.FC<DecorationProps> = ({ decoration, onSelect, onUpdatePosition }) => {
  const translateX = useSharedValue(decoration.x);
  const translateY = useSharedValue(decoration.y);
  const context = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    translateX.value = decoration.x;
    translateY.value = decoration.y;
  }, [decoration.x, decoration.y]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
      runOnJS(onSelect)(decoration.id);
    })
    .onUpdate((event) => {
      translateX.value = context.value.x + event.translationX;
      translateY.value = context.value.y + event.translationY;
    })
    .onEnd(() => {
      runOnJS(onUpdatePosition)(decoration.id, translateX.value, translateY.value);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={StyleSheet.flatten([
          {
            position: 'absolute',
            width: decoration.width,
            height: decoration.height,
            borderWidth: decoration.isSelected ? 3 : 0,
            borderColor: '#FFD700',
            zIndex: decoration.isSelected ? 50 : 1,
          },
          animatedStyle as any,
        ])}
      >
        <Image source={LEAF_IMG} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
      </Animated.View>
    </GestureDetector>
  );
};

// --- Main Screen ---

export const RestaurantTableScreen: React.FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const store = useAuthStore();
  const setScreen = useUIStore((state) => state.setScreen);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFloor, setIsLoadingFloor] = useState<number | null>(null);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomButton
          onPress={() => setScreen('RESTAURANT_FLOORS')}
          variant="none"
          size="none"
          style={styles.backButton}
          iconComponent={
            <View style={styles.backCirc}>
              <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            </View>
          }
          title="Floors"
          textStyle={styles.backText}
        />
        <Text style={styles.headerTitle}>{store.currentFloor?.floorName || 'Floor Editor'}</Text>
        <View style={styles.headerActions}>
          <CustomButton 
            title="Save" 
            onPress={handleSave} 
            isLoading={isSaving} 
            size="small"
            style={{ width: 80 }}
          />
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.sidebarSolid}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

            <ControlCard title="Current Floor" icon="map-outline">
              <View style={styles.properRow}>
                <Text style={styles.properLabel}>Floor Name</Text>
                <TextInput
                  style={styles.properInput}
                  placeholder="Enter name"
                  placeholderTextColor="#A0AEC0"
                  value={store.currentFloor?.floorName}
                  onChangeText={(v) => store.currentFloor && store.updateFloorName(store.currentFloor.floorId, v)}
                />
              </View>
              <View style={styles.properRow}>
                <Text style={styles.properLabel}>Tables Capacity</Text>
                <TextInput
                  style={styles.properInput}
                  keyboardType="numeric"
                  placeholder="e.g. 10"
                  placeholderTextColor="#A0AEC0"
                  value={store.currentFloor?.noOfTable.toString()}
                  onChangeText={(v) => store.currentFloor && store.updateFloorCapacity(store.currentFloor.floorId, parseInt(v || "0"))}
                />
              </View>
              <View style={styles.properRow}>
                <Text style={styles.properLabel}>Tables Used</Text>
                <View style={styles.badgeContainer}>
                  <Text style={StyleSheet.flatten([styles.badgeText, tablesInCurrentFloor.length >= (store.currentFloor?.noOfTable || 0) && { color: '#E53E3E' }])}>
                    {tablesInCurrentFloor.length} / {store.currentFloor?.noOfTable || 0}
                  </Text>
                </View>
              </View>
              <View style={styles.flexRow}>
                <CustomButton 
                  title="Add Table" 
                  icon="add" 
                  onPress={() => store.currentFloor && store.addTable(store.currentFloor.floorId)}
                  variant="primary"
                  size="small"
                  style={{ flex: 1 }}
                />
                <CustomButton 
                  title="Delete" 
                  icon="trash-outline" 
                  onPress={confirmRemoveFloor}
                  variant="danger"
                  size="small"
                  style={{ flex: 1 }}
                />
              </View>
            </ControlCard>

            <View style={styles.sep} />

            {selectedTable ? (
              <ControlCard title="Selected Table" icon="cube-outline">
                <View style={styles.properRow}>
                  <Text style={styles.properLabel}>Title</Text>
                  <TextInput
                    style={styles.properInput}
                    value={selectedTable.tableName}
                    onChangeText={(v) => store.updateTableName(selectedTable.tableId, v)}
                  />
                </View>

                <View style={styles.properRow}>
                  <View style={styles.spreadRow}>
                    <Text style={styles.properLabel}>Rotation</Text>
                    <Text style={styles.badgeText}>{Math.round(selectedTable.rotation * 360)}°</Text>
                  </View>
                  <Slider
                    style={{ height: 40 }}
                    minimumValue={0}
                    maximumValue={0.5}
                    value={selectedTable.rotation}
                    onValueChange={(v) => store.updateTableRotation(selectedTable.tableId, v)}
                    minimumTrackTintColor="#FFD700"
                    maximumTrackTintColor="rgba(255,255,255,0.1)"
                    thumbTintColor="white"
                  />
                </View>

                <View style={styles.properRow}>
                  <Text style={styles.properLabel}>Shape Mode</Text>
                  <View style={styles.properToggle}>
                    <TouchableOpacity
                      style={StyleSheet.flatten([styles.toggBtn, !selectedTable.isRounded && styles.toggBtnActive])}
                      onPress={() => !selectedTable.isRounded || store.toggleTableShape(selectedTable.tableId)}
                    >
                      <Text style={StyleSheet.flatten([styles.toggText, !selectedTable.isRounded && styles.toggTextActive])}>Square</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={StyleSheet.flatten([styles.toggBtn, selectedTable.isRounded && styles.toggBtnActive])}
                      onPress={() => selectedTable.isRounded || store.toggleTableShape(selectedTable.tableId)}
                    >
                      <Text style={StyleSheet.flatten([styles.toggText, selectedTable.isRounded && styles.toggTextActive])}>Round</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.properRow}>
                  <Text style={styles.properLabel}>Chair Capacity (Max 16)</Text>
                  <View style={styles.counterRow}>
                    <TouchableOpacity onPress={() => store.removeChair(selectedTable.tableId)} style={styles.circBtn}>
                      <Ionicons name="remove" size={18} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.countNum}>{selectedTable.chairsCount}</Text>
                    <TouchableOpacity
                      onPress={() => store.addChair(selectedTable.tableId)}
                      style={StyleSheet.flatten([styles.circBtn, selectedTable.chairsCount >= 16 && { opacity: 0.5 }])}
                      disabled={selectedTable.chairsCount >= 16}
                    >
                      <Ionicons name="add" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                <CustomButton
                  title="Remove Table"
                  icon="trash"
                  onPress={() => store.removeTable(selectedTable.tableId)}
                  variant="danger"
                  style={{ marginTop: 10 }}
                />
              </ControlCard>
            ) : selectedDecoration ? (
              <ControlCard title="Plant Controls" icon="leaf-outline">
                <Text style={styles.subText}>Currently adjusting: {selectedDecoration.title}</Text>
                <CustomButton
                  title="Remove Plant"
                  icon="close-circle"
                  onPress={() => store.removeDecoration(selectedDecoration.id)}
                  variant="danger"
                  style={{ marginTop: 10 }}
                />
              </ControlCard>
            ) : (
              <View style={styles.properEmpty}>
                <Ionicons name="hand-right" size={24} color="rgba(255,255,255,0.2)" />
                <Text style={styles.properEmptyText}>Select an item on the canvas to edit its properties</Text>
              </View>
            )}

            <View style={styles.sep} />

            <ControlCard title="Workspace" icon="apps-outline">
              <View style={styles.quickGrid}>
                <TouchableOpacity
                  style={styles.gridBtn}
                  onPress={() => store.currentFloor && store.addTable(store.currentFloor.floorId)}
                >
                  <Ionicons name="add-circle" size={24} color="#FFD700" />
                  <Text style={styles.gridBtnText}>Table</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.gridBtn}
                  onPress={() => store.currentFloor && store.addDecoration(store.currentFloor.floorId)}
                >
                  <Ionicons name="leaf" size={24} color="#48BB78" />
                  <Text style={styles.gridBtnText}>Plant</Text>
                </TouchableOpacity>
              </View>
            </ControlCard>

          </ScrollView>
        </View>

        <View style={styles.properCanvas}>
          <ImageBackground source={FLOOR_BG} style={styles.properFloor} imageStyle={{ opacity: 0.35 }}>
            {tablesInCurrentFloor.map((table) => (
              <DraggableTable
                key={table.tableId}
                table={table}
                onSelect={handleSelectTable}
                onUpdatePosition={store.updateTablePosition}
                onUpdateSize={store.updateTableSize}
              />
            ))}
            {decorationsInCurrentFloor.map((deco) => (
              <DraggableDecoration
                key={deco.id}
                decoration={deco}
                onSelect={handleSelectDecoration}
                onUpdatePosition={store.updateDecorationPosition}
              />
            ))}
          </ImageBackground>
        </View>
      </View>

      <ActionModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        onConfirm={modalConfig.onConfirm}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 100
  },
  backButton: { flexDirection: 'row', alignItems: 'center', width: 120 },
  backCirc: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F7FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  backText: { ...TYPOGRAPHY.montserrat.semiBold, fontSize: 13, color: '#4A5568' },
  headerTitle: { flex: 1, textAlign: 'center', ...TYPOGRAPHY.montserrat.bold, fontSize: 18, color: '#1A202C' },
  headerActions: { width: 120, alignItems: 'flex-end' },
  topSaveBtn: { backgroundColor: '#6750A4', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  topSaveBtnText: { color: 'white', ...TYPOGRAPHY.montserrat.bold, fontSize: 12 },
  mainContent: { flex: 1, flexDirection: 'row' },
  sidebarSolid: { width: 280, backgroundColor: '#2D1F5C' },
  properCard: { backgroundColor: '#3C2A7D', borderRadius: 16, marginHorizontal: 15, marginTop: 15, padding: 15, borderWidth: 1, borderColor: '#4E3B94' },
  properCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4E3B94', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  properCardTitle: { color: 'white', ...TYPOGRAPHY.montserrat.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  properCardContent: {},
  properRow: { marginBottom: 15 },
  properLabel: { ...TYPOGRAPHY.montserrat.medium, fontSize: 11, color: '#A0AEC0', marginBottom: 5 },
  properInput: { backgroundColor: '#4E3B94', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: 'white', ...TYPOGRAPHY.montserrat.semiBold, fontSize: 14 },
  flexRow: { flexDirection: 'row', gap: 10 },
  properActionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6750A4', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, gap: 6, flex: 1, justifyContent: 'center' },
  actionBtnText: { color: 'white', ...TYPOGRAPHY.montserrat.bold, fontSize: 11 },
  sep: { height: 5 },
  spreadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeContainer: { backgroundColor: '#2D1F5C', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  badgeText: { color: '#FFD700', ...TYPOGRAPHY.montserrat.bold, fontSize: 12 },
  properToggle: { flexDirection: 'row', backgroundColor: '#2D1F5C', borderRadius: 10, padding: 4 },
  toggBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  toggBtnActive: { backgroundColor: 'white' },
  toggText: { color: '#A0AEC0', ...TYPOGRAPHY.montserrat.bold, fontSize: 11 },
  toggTextActive: { color: '#2D1F5C' },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  circBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#6750A4', justifyContent: 'center', alignItems: 'center' },
  countNum: { color: 'white', ...TYPOGRAPHY.montserrat.bold, fontSize: 22 },
  properDeleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#E53E3E', padding: 12, borderRadius: 12, marginTop: 10 },
  quickGrid: { flexDirection: 'row', gap: 10 },
  gridBtn: { flex: 1, backgroundColor: '#4E3B94', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  gridBtnText: { color: 'white', ...TYPOGRAPHY.montserrat.bold, fontSize: 11, marginTop: 5 },
  properEmpty: { margin: 20, alignItems: 'center', padding: 25 },
  properEmptyText: { color: '#A0AEC0', ...TYPOGRAPHY.montserrat.medium, fontSize: 11, textAlign: 'center', marginTop: 10 },
  subText: { color: 'white', ...TYPOGRAPHY.montserrat.medium, fontSize: 12, marginBottom: 5 },
  properCanvas: { flex: 1, padding: 20 },
  floorHeaderSolid: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginBottom: 15, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#E2E8F0', gap: 10 },
  floorStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#48BB78' },
  floorNameTitle: { ...TYPOGRAPHY.montserrat.bold, fontSize: 14, color: '#2D3748' },
  properFloor: { flex: 1, backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: '#1d7af3ff', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 } },
  tableContainer: { position: 'absolute', backgroundColor: '#C1873F', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 } },
  tableText: { ...TYPOGRAPHY.montserrat.bold, fontSize: 11, color: 'rgba(0,0,0,0.8)', textAlign: 'center' },
  resizeHandle: { position: 'absolute', right: -10, bottom: -10, width: 24, height: 24, backgroundColor: '#6750A4', borderRadius: 12, justifyContent: 'center', alignItems: 'center', zIndex: 100 },

  // New Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusModalContent: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconCircLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 20,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalCloseBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: 'white',
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 14,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtnHalf: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
});
