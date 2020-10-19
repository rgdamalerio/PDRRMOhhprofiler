import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView from "react-native-maps";

import defaultStyles from "../config/styles";
import Text from "./Text";

const intialRegion = {
  latitude: 9.190489360418237,
  latitudeDelta: 2.239664674768459,
  longitude: 125.57549066841602,
  longitudeDelta: 1.365918293595314,
};

function LocationInput({
  coordinates,
  onChangeCoordinates,
  icon,
  placeholder,
  width,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [addMarker, setAddMarker] = useState(false);
  const [region, setRegion] = useState(intialRegion);
  const mapRef = useRef(null);

  const onChangeCoord = () => {
    onChangeCoordinates(region);
  };

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
            <Text style={styles.text}>
              {coordinates.longitude + " " + coordinates.latitude}
            </Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.mapStyle}
            mapType="satellite"
            initialRegion={region}
            onRegionChangeComplete={(region) => {
              setRegion(region);
            }}
          >
            {addMarker && (
              <MapView.Marker
                draggable
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                onDragEnd={(e) => {
                  const {
                    latitudeDelta,
                    longitudeDelta,
                  } = mapRef.current.__lastRegion;
                  setRegion({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta,
                  });
                }}
              />
            )}
          </MapView>
          <View
            style={{
              flexDirection: "row",
              padding: 15,
              paddingTop: Constants.statusBarHeight + 15,
              zIndex: 999,
              justifyContent: "space-around",
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              style={styles.cameraControl}
              onPress={() => {
                setAddMarker(true);
              }}
            >
              <MaterialCommunityIcons
                name="map-marker-plus"
                style={{
                  color: defaultStyles.colors.primary,
                  fontSize: 40,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraControl}
              onPress={() => {
                if (!addMarker) {
                  alert("Add marker first to select location in the map");
                } else {
                  onChangeCoord(region);
                  setModalVisible(false);
                }
              }}
            >
              <MaterialCommunityIcons
                name="check-circle"
                style={{
                  color: defaultStyles.colors.green,
                  fontSize: 40,
                }}
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
                style={{
                  color: defaultStyles.colors.danger,
                  fontSize: 40,
                }}
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
