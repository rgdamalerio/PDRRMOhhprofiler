import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView from "react-native-maps";

import colors from "../config/colors";

function LocationInput({ coordinates }) {
  const [modalVisible, setModalVisible] = useState(false);
  //const [coordinates, setCoordinates] = useState(coordinates);

  const handlePress = () => {
    if (!coordinates) setModalVisible(true);
    else
      Alert.alert(
        "Change Location",
        "Are you sure you want to change this location?",
        [
          {
            text: "Yes",
            onPress: () => {
              setModalVisible(true);
              //nChangeImage(null);
            },
          },
          { text: "No" },
        ]
      );
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.container}>
          {!coordinates && (
            <MaterialCommunityIcons
              color={colors.medium}
              name="camera"
              size={40}
            />
          )}
          {coordinates && (
            <MaterialCommunityIcons
              color={colors.primary}
              name="camera"
              size={40}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible}>
        <View style={styles.container}>
          <MapView style={styles.mapStyle} />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default LocationInput;
