import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions from the design (e.g., typical tablet or phone design specs)
const GUIDELINE_BASE_WIDTH = 1080;
const GUIDELINE_BASE_HEIGHT = 1920;

export const ScreenUtil = {
    // Width scaling
    width: (size: number) => (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size,

    // Height scaling
    height: (size: number) => (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size,

    // Font scaling
    setSpText: (size: number) => {
        const scale = SCREEN_WIDTH / GUIDELINE_BASE_WIDTH;
        const newSize = size * scale;
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    },

    // Viewport dimensions
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
};
