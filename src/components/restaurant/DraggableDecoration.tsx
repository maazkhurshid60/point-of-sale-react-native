import React, { useEffect } from 'react';
import { Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { DecorationModel } from '../../models';

const LEAF_IMG = require('../../../assets/images/leaf.png');

interface DecorationProps {
  decoration: DecorationModel;
  canvasWidth: number;
  canvasHeight: number;
  onSelect: (id: number) => void;
  onUpdatePosition: (id: number, x: number, y: number) => void;
}

export const DraggableDecoration = React.memo<DecorationProps>(({ decoration, canvasWidth, canvasHeight, onSelect, onUpdatePosition }) => {
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
      const newX = context.value.x + event.translationX;
      const newY = context.value.y + event.translationY;

      const maxX = canvasWidth > 0 ? canvasWidth - decoration.width : 10000;
      const maxY = canvasHeight > 0 ? canvasHeight - decoration.height : 10000;

      translateX.value = Math.min(Math.max(0, newX), maxX);
      translateY.value = Math.min(Math.max(0, newY), maxY);
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
        style={[
          {
            position: 'absolute',
            width: decoration.width,
            height: decoration.height,
            borderWidth: decoration.isSelected ? 3 : 0,
            borderColor: '#FFD700',
            zIndex: decoration.isSelected ? 50 : 1,
          },
          animatedStyle,
        ]}
      >
        <Image source={LEAF_IMG} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
      </Animated.View>
    </GestureDetector>
  );
});
