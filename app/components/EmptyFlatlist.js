import React from "react";
import { Text, View, StyleSheet } from "react-native";

import defaultStyles from "../config/styles";

function EmptyFlatlist({ children, style, ...otherProps }) {
  return (
    <View style={styles.container}>
      <Text style={[defaultStyles.text, style]} {...otherProps}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});
export default EmptyFlatlist;
