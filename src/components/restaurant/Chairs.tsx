import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ChairProps {
  side: number; // 0: top, 1: right, 2: bottom, 3: left
  count: number;
}

export const Chairs = React.memo<ChairProps>(({ side, count }) => {
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
});
