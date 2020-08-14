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
    paddingHorizontal: 10,
    paddingVertical: 10,
    //alignItems: "center",
    width: "100%",
  },
  label: {
    marginTop: 5,
    //textAlign: "center",
  },
});

export default AddressPickerItem;
