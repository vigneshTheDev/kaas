import React, { useCallback, useEffect, useState } from "react";
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

  const [swipeStartX, setSwipeStartX] = useState(0);
  const [leftPos, setLeftPos] = useState(0);

  const updatePage = useCallback(() => {
    const numChildrenPerPage = numRows * numColumns;

    const childrenInPage = children.slice(pageStart, numChildrenPerPage);
    setCurrentPage(chunk(childrenInPage, numColumns));

    const childrenInPrevPage = pageStart > 0 ? null : [];
    setPrevPage(chunk(childrenInPrevPage, numColumns));

    const childrenInNextPage = pageStart + numChildrenPerPage < children.length ? [] : null;
    setNextPage(chunk(childrenInNextPage, numColumns));
  }, [children, pageStart, numRows, numColumns]);

  useEffect(() => {
    setPageStart(0);
    updatePage();
  }, [numRows, numColumns, children]);

  const onResponderGrant = (event: GestureResponderEvent) => {
    setSwipeStartX(event.nativeEvent.pageX);
  };

  const onResponderMove = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.pageX;
    setLeftPos(x - swipeStartX);
  };

  const onResponderRelease = (event: GestureResponderEvent) => {
    setLeftPos(0);
  };

  return (
    <View
      onResponderGrant={onResponderGrant}
      onStartShouldSetResponder={() => true}
      onResponderMove={onResponderMove}
      onResponderRelease={onResponderRelease}
    >
      <View style={{ left: leftPos }}>
        {currentPage.map((row: any[], index) => (
          <View key={index} style={[styles.row, { justifyContent: row.length === numColumns ? "space-between" : "flex-start" }]}>
            {row.map((col: any[]) => col)}
          </View>
        ))}
      </View>
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
