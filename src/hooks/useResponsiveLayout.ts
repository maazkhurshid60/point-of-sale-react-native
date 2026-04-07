// import { useWindowDimensions } from 'react-native';

// export interface LayoutDimensions {
//   width: number;
//   height: number;
//   isPortrait: boolean;
//   isLandscape: boolean;
//   isSmallWidth: boolean;
//   productsHeight: number;
//   billingHeight: number;
//   sidebarWidth: number;
// }

// /**
//  * Hook to handle responsive layout dimensions and orientation,
//  * replicating the logic from Flutter's UIController.
//  */
// export const useResponsiveLayout = (): LayoutDimensions => {
//   const { width, height } = useWindowDimensions();
  
//   const isPortrait = width < height;
//   const isLandscape = !isPortrait;
//   const isSmallWidth = width < 610;

//   // Replicating Flutter's UIScreen logic for container scaling
//   let productsHeight: number;
//   let billingHeight: number;

//   if (isPortrait) {
//     productsHeight = isSmallWidth ? height * 0.33 : height * 0.3;
//     billingHeight = isSmallWidth ? height * 0.66 : height * 0.63;
//   } else {
//     // In landscape, some apps use width-based scaling for split panels
//     productsHeight = width * 0.3;
//     billingHeight = width * 0.63;
//   }

//   // Sidebar typically takes 25-30% of width on tablets, more on phones
//   const sidebarWidth = isSmallWidth ? width * 0.8 : width * 0.3;

//   return {
//     width,
//     height,
//     isPortrait,
//     isLandscape,
//     isSmallWidth,
//     productsHeight,
//     billingHeight,
//     sidebarWidth,
//   };
// };
