import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import Text from "./Text";
import { ListItemSeparator } from "../components/lists";

function AddressPickerItem({ item, onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.label}>{item.label}</Text>
      </TouchableOpacity>
      <ListItemSeparator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    width: "100%",
  },
  label: {
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 23,
  },
});

export default AddressPickerItem;
