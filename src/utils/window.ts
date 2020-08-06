import { Dimensions, LayoutRectangle, View } from "react-native";
import { Dictionary } from "./types";
import { toPairs, groupBy, mapValues, keyBy, pickBy, values, flatten, find } from "lodash";

export function getWindowSize() {
  const dimensions = Dimensions.get("window");

  return {
    width: dimensions.width,
    height: dimensions.height,
  };
}

export function getDraggableArea(initialLayout: LayoutRectangle, windowSize: Size): Size {
  const availableHeight = windowSize.height - initialLayout.y;
  const availableWidth = windowSize.width;

  return {
    height: availableHeight,
    width: availableWidth,
  };
}

async function getLayouts(views: Dictionary<View>) {
  const keys = Object.keys(views);
  const layouts: Dictionary<LayoutRectangle> = {};
  const layoutList = await Promise.all(keys.map((k) => measureLayout(views[k])));
  for (let i = 0; i < keys.length; i++) {
    layouts[keys[i]] = layoutList[i];
  }

  return layouts;
}

export async function buildLayoutTree(views: Dictionary<View>) {
  const layout: Dictionary<LayoutRectangle> = await getLayouts(views);
  const layoutPair = toPairs(layout);
  const groupByX = groupBy(layoutPair, ([, layout]) => layout.x);
  const groupByXY: LayoutTree = mapValues(groupByX, (group) => keyBy(group, ([, layout]) => layout.y));

  return groupByXY;
}

export function detectDropTarget(fingerPosition: Position, layoutTree: LayoutTree, coinSize: number) {
  const { x, y } = fingerPosition;
  const startXY: Point = [x - coinSize, y - coinSize];

  const trimmedTree = trimLayoutTree(layoutTree, [startXY, [x, y]]);
  const nodes = flatten(values(mapValues(trimmedTree, (yTree) => values(yTree))));
  console.log(nodes);

  return find(
    nodes,
    ([, coinLayout]) =>
      coinLayout.x <= x && coinLayout.y <= y && coinLayout.x + coinLayout.width >= x && coinLayout.y + coinLayout.height >= y
  );
}

export function measureLayout(view: View): Promise<LayoutRectangle> {
  return new Promise((resolve) => {
    view.measure((x, y, width, height, pageX, pageY) => {
      resolve({ x: pageX, y: pageY, width, height });
    });
  });
}

function trimLayoutTree(layoutTree: LayoutTree, [[startX, startY], [endX, endY]]: BoundingBox) {
  const yFiltered = mapValues(layoutTree, (yTree) => pickBy(yTree, (val, key) => +key <= endY && +key >= startY));
  const xyFiltered = pickBy(yFiltered, (val, key) => +key <= endX && +key >= startX);

  console.log(xyFiltered);
  return xyFiltered;
}

export type Point = [number, number];
export type BoundingBox = [Point, Point];
export type LayoutTree = Dictionary<Dictionary<[string, LayoutRectangle]>>;

export interface Size {
  height: number;
  width: number;
}

export interface Position {
  x: number;
  y: number;
}
