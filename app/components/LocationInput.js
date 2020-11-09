import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import Constants from "expo-constants";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

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
  const [latitude, setLatitude] = useState(intialRegion.latitude);
  const [longitude, setLongitude] = useState(intialRegion.longitude);
  const [isMapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  const onChangeCoord = () => {
    onChangeCoordinates(region);
  };

  const handleMapReady = useCallback(() => {
    setMapReady(true);
  }, [mapRef, setMapReady]);

  // Request geolocation in Android since it's not done automatically
  const requestGeoLocationPermission = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
  };

  /**
   * Sets the overall lat long of the map viewport and thus the animation engages
   */
  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        mapRef.current.animateCamera({
          center: {
            latitude: latitude,
            longitude: longitude,
          },
          heading: 0,
          zoom: 15,
        });
      },
      (error) => {
        alert(error.message);
      }
    );
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
            style={isMapReady ? styles.mapStyle : {}}
            provider={PROVIDER_GOOGLE}
            mapType="hybrid"
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            initialRegion={region}
            onRegionChangeComplete={(region) => {
              setRegion(region);
            }}
            onMapReady={() => {
              handleMapReady();
              requestGeoLocationPermission();
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
          {/*
            <TouchableOpacity
              style={styles.myLocationButton}
              onPress={() => {
                getCurrentPosition();
              }}
            >
              <MaterialCommunityIcons name="crosshairs-gps" size={24} />
            </TouchableOpacity>
            */}
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
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    height: "100%",
    width: "100%",
  },
  placeholder: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  text: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  myLocationButton: {
    backgroundColor: defaultStyles.colors.secondary,
    position: "absolute",
    top: 10,
    right: 5,
    padding: 8,
    elevation: 3,
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    borderRadius: 50,
  },
});

export default LocationInput;
