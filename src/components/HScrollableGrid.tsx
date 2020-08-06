import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, GestureResponderEvent, Animated } from "react-native";
import { chunk } from "lodash";

interface Props {
  numRows: number;
  numColumns: number;
  children: any[];
}

export default function HScrollableGrid({ numRows, numColumns, children }: Props) {
  const [pagedChildren, setPaginatedChildren] = useState<any[][]>([]);
  const [left, setLeft] = useState<Animated.Value>();

  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<View>(null);

  const [swipeStartX, setSwipeStartX] = useState(0);

  // Initialize Left Position
  useEffect(() => {
    setLeft(new Animated.Value(0));
  }, []);

  // Initialize paginated Child elements
  useEffect(() => {
    const paginated = chunk(chunk(children, numColumns), numRows);
    setPaginatedChildren(paginated);
  }, [numRows, numColumns, children]);

  const scrollToPage = (pageNumber: number) => {
    console.log("Scrolling to page", pageNumber);
    left?.setValue(-pageNumber * containerWidth);
  };

  // if the last page is emptied, scroll back to previous page
  useEffect(() => {
    const numPages = pagedChildren.length;
    if (numPages && numPages <= currentPage) {
      console.log("Setting currentpage", numPages);
      setCurrentPage(numPages - 1);
      scrollToPage(numPages - 1);
    }
  }, [pagedChildren.length, currentPage]);

  const onResponderGrant = (event: GestureResponderEvent) => {
    setSwipeStartX(event.nativeEvent.pageX);
  };

  const onResponderMove = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.pageX;
    left?.setValue(x - swipeStartX - currentPage * containerWidth);
  };

  const onResponderRelease = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.pageX;
    if (x - swipeStartX > 0.3 * containerWidth) {
      const newPage = currentPage > 0 ? currentPage - 1 : 0;
      setCurrentPage(newPage);
      scrollToPage(newPage);
      console.log("newpage", newPage);
    } else if (x - swipeStartX < -0.3 * containerWidth) {
      const newPage = currentPage < pagedChildren.length - 1 ? currentPage + 1 : currentPage;
      console.log("newpage", newPage);
      setCurrentPage(newPage);
      scrollToPage(newPage);
    } else {
      scrollToPage(currentPage);
    }
  };

  const renderRow = (row: any[], index: number) => (
    <View key={index} style={[styles.row]}>
      {row.map((col: any[], i, arr) => (
        <View style={{ width: "" + 100 / arr.length + "%", alignContent: "center" }} key={i}>
          {col}
        </View>
      ))}
    </View>
  );

  return (
    <View
      onResponderGrant={onResponderGrant}
      onStartShouldSetResponder={() => true}
      onResponderMove={onResponderMove}
      onResponderRelease={onResponderRelease}
      style={{ flexDirection: "row", display: "flex", flexWrap: "nowrap" }}
      ref={containerRef}
      onLayout={(evt) => {
        containerRef.current?.measure((x, y, width, height) => {
          setContainerWidth(width);
        });
      }}
    >
      {pagedChildren.map((page, i) => (
        <Animated.View
          key={i}
          style={{
            left: left,
            width: "100%",
            marginRight: i < currentPage ? 16 : 0,
            marginLeft: i < currentPage ? -16 : i > currentPage ? 16 : 0,
          }}
        >
          {page.map(renderRow)}
        </Animated.View>
      ))}
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
