import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, GestureResponderEvent } from "react-native";
import { chunk } from "lodash";

interface Props {
  numRows: number;
  numColumns: number;
  children: any[];
}

export default function HScrollableGrid({ numRows, numColumns, children }: Props) {
  const [pageStart, setPageStart] = useState(0);
  const [currentPage, setCurrentPage] = useState<any[][]>([]);
  const [nextPage, setNextPage] = useState<any[][]>([]);
  const [prevPage, setPrevPage] = useState<any[][]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<View>(null);

  const [swipeStartX, setSwipeStartX] = useState(0);
  const [leftPos, setLeftPos] = useState(0);

  const updatePage = useCallback(() => {
    const numChildrenPerPage = numRows * numColumns;

    const childrenInPage = children.slice(pageStart, pageStart + numChildrenPerPage);
    setCurrentPage(chunk(childrenInPage, numColumns));

    const childrenInPrevPage = pageStart > 0 ? children.slice(pageStart - numChildrenPerPage, pageStart) : null;
    setPrevPage(chunk(childrenInPrevPage, numColumns));

    const childrenInNextPage =
      pageStart + numChildrenPerPage < children.length
        ? children.slice(pageStart + numChildrenPerPage, pageStart + 2 * numChildrenPerPage)
        : null;
    setNextPage(chunk(childrenInNextPage, numColumns));

    setLeftPos(0);

    console.log("pages: ", childrenInPrevPage?.length, childrenInPage.length, childrenInNextPage?.length);
  }, [children, pageStart, numRows, numColumns]);

  useEffect(() => {
    updatePage();
  }, [numRows, numColumns, children, pageStart]);

  const onResponderGrant = (event: GestureResponderEvent) => {
    setSwipeStartX(event.nativeEvent.pageX);
  };

  const onResponderMove = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.pageX;
    setLeftPos(x - swipeStartX);
  };

  const onResponderRelease = (event: GestureResponderEvent) => {
    const numChildrenPerPage = numColumns * numRows;
    if (leftPos < -containerWidth * 0.35 && nextPage.length) {
      setPageStart(pageStart + numChildrenPerPage);
      setLeftPos(-containerWidth - 40);
    } else if (leftPos > containerWidth * 0.35 && prevPage.length) {
      setPageStart(pageStart - numChildrenPerPage);
      setLeftPos(containerWidth + 40);
    } else {
      setLeftPos(0);
    }
  };

  const renderRow = (row: any[], index: number) => (
    <View key={index} style={[styles.row, { justifyContent: row.length === numColumns ? "space-between" : "flex-start" }]}>
      {row.map((col: any[]) => col)}
    </View>
  );

  return (
    <View
      onResponderGrant={onResponderGrant}
      onStartShouldSetResponder={() => true}
      onResponderMove={onResponderMove}
      onResponderRelease={onResponderRelease}
      style={{ backgroundColor: "#fff" }}
      ref={containerRef}
      onLayout={(evt) => {
        containerRef.current?.measure((x, y, width, height) => {
          setContainerWidth(width);
        });
      }}
    >
      <View style={{ position: "absolute", left: leftPos - containerWidth - 40 }}>{prevPage.map(renderRow)}</View>
      <View style={{ left: leftPos }}>{currentPage.map(renderRow)}</View>
      <View style={{ position: "absolute", left: leftPos + containerWidth + 40 }}>{nextPage.map(renderRow)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexShrink: 0,
    flexDirection: "row",
    width: "100%",
  },
  fullRow: {
    justifyContent: "space-between",
  },
});
