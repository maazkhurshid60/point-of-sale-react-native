import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { COLORS } from '../../constants/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { ActionModal } from '../../components/common/ActionModal';
import { styles } from './RestaurantTableScreen.styles';
import { useRestaurantController } from './hooks/useRestaurantController';

// Modular Components
import { ControlCard } from '../../components/restaurant/ControlCard';
import { DraggableTable } from '../../components/restaurant/DraggableTable';
import { DraggableDecoration } from '../../components/restaurant/DraggableDecoration';

const FLOOR_BG = require('../../../assets/images/floor.png');

export const RestaurantTableScreen: React.FC = () => {
  const {
    store,
    selectedTable,
    selectedDecoration,
    tablesInCurrentFloor,
    decorationsInCurrentFloor,
    isSaving,
    modalConfig,
    setScreen,
    handleSelectTable,
    handleSelectDecoration,
    handleSave,
    confirmRemoveFloor,
    closeModal,
  } = useRestaurantController();

  const [canvasDim, setCanvasDim] = React.useState({ width: 0, height: 0 });

  const onCanvasLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasDim({ width, height });
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
                  <Text style={[styles.badgeText, tablesInCurrentFloor.length >= (store.currentFloor?.noOfTable || 0) && { color: '#E53E3E' }]}>
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
                {store.listOfFloors.length > 1 && (
                  <CustomButton
                    title="Delete"
                    icon="trash-outline"
                    onPress={confirmRemoveFloor}
                    variant="danger"
                    size="small"
                    style={{ flex: 1 }}
                  />
                )}
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
                      style={[styles.toggBtn, !selectedTable.isRounded && styles.toggBtnActive]}
                      onPress={() => !selectedTable.isRounded || store.toggleTableShape(selectedTable.tableId)}
                    >
                      <Text style={[styles.toggText, !selectedTable.isRounded && styles.toggTextActive]}>Square</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.toggBtn, selectedTable.isRounded && styles.toggBtnActive]}
                      onPress={() => selectedTable.isRounded || store.toggleTableShape(selectedTable.tableId)}
                    >
                      <Text style={[styles.toggText, selectedTable.isRounded && styles.toggTextActive]}>Round</Text>
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
                      style={[styles.circBtn, selectedTable.chairsCount >= 16 && { opacity: 0.5 }]}
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

        <View style={styles.properCanvas} onLayout={onCanvasLayout}>
          <ImageBackground source={FLOOR_BG} style={styles.properFloor} imageStyle={{ opacity: 0.35 }}>
            {tablesInCurrentFloor.map((table) => (
              <DraggableTable
                key={table.tableId}
                table={table}
                canvasWidth={canvasDim.width}
                canvasHeight={canvasDim.height}
                onSelect={handleSelectTable}
                onUpdatePosition={store.updateTablePosition}
                onUpdateSize={store.updateTableSize}
              />
            ))}
            {decorationsInCurrentFloor.map((deco) => (
              <DraggableDecoration
                key={deco.id}
                decoration={deco}
                canvasWidth={canvasDim.width}
                canvasHeight={canvasDim.height}
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
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
      />
    </View>
  );
};

export default RestaurantTableScreen;
