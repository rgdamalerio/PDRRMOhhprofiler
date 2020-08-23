import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import Constants from "expo-constants";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView from "react-native-maps";

import defaultStyles from "../config/styles";
import Text from "./Text";

function LocationInput({ coordinates, icon, placeholder, width = "100%" }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  //const [coordinates, setCoordinates] = useState(coordinates);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={[styles.container, { width }, { marginTop: 20 }]}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
          )}
          {coordinates ? (
            <Text style={styles.text}>{coordinates}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible}>
        <View style={styles.mapContainer}>
          <MapView style={styles.mapStyle} />
          <View
            style={{
              flexDirection: "row",
              padding: 15,
              paddingTop: Constants.statusBarHeight + 15,
              zIndex: 999,
              justifyContent: "space-around",
              position: "absolute",
              //top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              style={styles.cameraControl}
              onPress={() => {
                selectImage();
                setModalVisible(false);
              }}
            >
              <MaterialCommunityIcons
                name="toggle-switch"
                style={{
                  color: isOffline
                    ? defaultStyles.colors.green
                    : defaultStyles.colors.danger,
                  fontSize: 40,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraControl}
              onPress={() => {
                takePicture();
              }}
            >
              <MaterialCommunityIcons
                name="map-marker-plus"
                style={{ color: defaultStyles.colors.black, fontSize: 40 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraControl}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <MaterialCommunityIcons
                name="close-circle"
                style={{ color: defaultStyles.colors.black, fontSize: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  placeholder: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  text: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
});

export default LocationInput;
