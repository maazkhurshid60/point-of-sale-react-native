import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { TableModel } from '../../models';
import { Chairs } from './Chairs';
import { styles } from '../../screens/Restaurant/RestaurantTableScreen.styles';

const TABLE_MIN_SIZE = 50;

interface TableProps {
  table: TableModel;
  canvasWidth: number;
  canvasHeight: number;
  onSelect: (id: number) => void;
  onUpdatePosition: (id: number, x: number, y: number) => void;
  onUpdateSize: (id: number, w: number, h: number) => void;
}

export const DraggableTable = React.memo<TableProps>(({ table, canvasWidth, canvasHeight, onSelect, onUpdatePosition, onUpdateSize }) => {
  const translateX = useSharedValue(table.x);
  const translateY = useSharedValue(table.y);
  const tableWidth = useSharedValue(table.width);
  const tableHeight = useSharedValue(table.height);
  const context = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    translateX.value = table.x;
    translateY.value = table.y;
    tableWidth.value = table.width;
    tableHeight.value = table.height;
  }, [table.x, table.y, table.width, table.height]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
      runOnJS(onSelect)(table.tableId);
    })
    .onUpdate((event) => {
      const newX = context.value.x + event.translationX;
      const newY = context.value.y + event.translationY;
      
      const maxX = canvasWidth > 0 ? canvasWidth - tableWidth.value : 10000;
      const maxY = canvasHeight > 0 ? canvasHeight - tableHeight.value : 10000;

      translateX.value = Math.min(Math.max(0, newX), maxX);
      translateY.value = Math.min(Math.max(0, newY), maxY);
    })
    .onEnd(() => {
      runOnJS(onUpdatePosition)(table.tableId, translateX.value, translateY.value);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: tableWidth.value,
    height: tableHeight.value,
    borderRadius: table.isRounded ? tableWidth.value / 2 : 8,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${table.rotation * 360}deg` },
    ],
  }));

  const resizeContext = useSharedValue({ w: table.width, h: table.height });

  const resizeGesture = Gesture.Pan()
    .onStart(() => {
      resizeContext.value = { w: tableWidth.value, h: tableHeight.value };
      runOnJS(onSelect)(table.tableId);
    })
    .onUpdate((event) => {
      const requestedWidth = resizeContext.value.w + event.translationX;
      const requestedHeight = resizeContext.value.h + event.translationY;

      const maxWidth = canvasWidth > 0 ? canvasWidth - translateX.value : 10000;
      const maxHeight = canvasHeight > 0 ? canvasHeight - translateY.value : 10000;

      tableWidth.value = Math.min(Math.max(TABLE_MIN_SIZE, requestedWidth), maxWidth);
      tableHeight.value = Math.min(Math.max(TABLE_MIN_SIZE, requestedHeight), maxHeight);
    })
    .onEnd(() => {
      runOnJS(onUpdateSize)(table.tableId, tableWidth.value, tableHeight.value);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.tableContainer,
          animatedStyle,
          {
            borderWidth: table.isSelected ? 3 : 1,
            zIndex: table.isSelected ? 50 : 1,
            borderColor: table.isSelected ? '#FFD700' : '#A0AEC0',
          },
        ]}
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
});
