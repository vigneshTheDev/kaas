import { Dimensions } from "react-native";

export function getWindowSize() {
  const dimensions = Dimensions.get("window");

  return {
    width: dimensions.width,
    height: dimensions.height,
  };
}

export function getDraggableArea(initialLayout: LayoutProps, windowSize: Size): Size {
  const availableHeight = windowSize.height - initialLayout.y;
  const availableWidth = windowSize.width;

  return {
    height: availableHeight,
    width: availableWidth,
  };
}

// export function findDropLocation(fingerPosition: Position, ) {

// }

export interface Size {
  height: number;
  width: number;
}

export interface LayoutProps extends Size {
  y: number;
  x: number;
}

export interface Position {
  x: number;
  y: number;
}
