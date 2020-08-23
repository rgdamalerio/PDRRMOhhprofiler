import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import MapView from "react-native-maps";

import defaultStyles from "../config/styles";
import Text from "./Text";

function LocationInput({ coordinates, icon, placeholder, width = "100%" }) {
  const [marker, setMarker] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [region, setRegion] = useState();
  const mapRef = useRef(null);

  useEffect(() => {
    setRegion({
      latitude: 11.768925925341028,
      longitude: 122.77700671926141,
      latitudeDelta: 17.693017262718715,
      longitudeDelta: 9.623784385621548,
    });
  }, []);

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
      {marker && <Text>{marker.latitude + " " + marker.longitude}</Text>}
      <Modal visible={modalVisible}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.mapStyle}
            mapType="satellite"
            region={region}
            showsUserLocation={true}
            followsUserLocation={true}
            onRegionChangeComplete={(region) => setRegion(region)}
          ></MapView>

          <FontAwesome
            name="dot-circle-o"
            style={{
              zIndex: 3,
              position: "absolute",
              marginTop: -37,
              marginLeft: -11,
              left: "50%",
              top: "50%",
            }}
            size={10}
            color={defaultStyles.colors.green}
          />

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
                setMarker(region);
                setModalVisible(false);
              }}
            >
              <MaterialCommunityIcons
                name="map-marker-plus"
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
