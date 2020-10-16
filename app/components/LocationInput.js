import React, { useState, useRef, useMemo } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { UrlTile, Region, MapTypes } from "react-native-maps";
import * as FileSystem from "expo-file-system";
import { Button } from "react-native-elements";

import { AppConstants } from "../constants";
import DownloadSettings from "./DownloadSettings";
import defaultStyles from "../config/styles";
import Text from "./Text";

const INITIALREGION = {
  latitude: 9.190489360418237,
  latitudeDelta: 2.239664674768459,
  longitude: 125.57549066841602,
  longitudeDelta: 1.365918293595314,
};

const MAP_TYPE = Platform.OS == "android" ? "none" : "standard";

function LocationInput({
  coordinates,
  onChangeCoordinates,
  icon,
  placeholder,
  width,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [visisbleSettings, setVisisbleSettings] = useState(false);
  const [mapRegion, setMapRegion] = useState(INITIALREGION);
  const mapRef = useRef(null);

  const onChangeCoord = () => {
    onChangeCoordinates(mapRegion);
  };

  const urlTemplate = useMemo(
    () =>
      isOffline
        ? `${AppConstants.TILE_FOLDER}/{z}/{x}/{y}.png`
        : `${AppConstants.MAP_URL}/{z}/{x}/{y}.png`,
    [isOffline]
  );

  const clearTiles = async () => {
    try {
      await FileSystem.deleteAsync(AppConstants.TILE_FOLDER);
      alert("Deleted all tiles");
    } catch (error) {
      alert(error);
    }
  };

  const toggleOffline = () => {
    setIsOffline(!isOffline);
  };

  const toggeleDownloadSettings = () => {
    setVisisbleSettings(!visisbleSettings);
  };

  const onDownloadComplete = () => {
    setIsOffline(true);
    setVisisbleSettings(false);
  };

  const toggleOfflineText = isOffline ? "Go online" : "Go offline";

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
            mapType={MAP_TYPE}
            initialRegion={INITIALREGION}
            onRegionChange={setMapRegion}
          >
            <UrlTile urlTemplate={urlTemplate} zIndex={1} />

            {/*<MapView.Marker
              draggable
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
              //onDragStart={() => this.setMarkerPosition()}
              onDragEnd={(e) => {
                const {
                  latitudeDelta,
                  longitudeDelta,
                } = mapRef.current.__lastRegion;
                setMapRegion({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                  latitudeDelta: latitudeDelta,
                  longitudeDelta: longitudeDelta,
                });
              }}
            />*/}
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
                onChangeCoord(mapRegion);
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

          <View style={styles.actionContainer}>
            <Button
              raised
              title={"Download"}
              onPress={toggeleDownloadSettings}
            />
            <Button raised title={"Clear tiles"} onPress={clearTiles} />
            <Button raised title={toggleOfflineText} onPress={toggleOffline} />
          </View>
          {visisbleSettings && (
            <DownloadSettings
              mapRegion={mapRegion}
              onFinish={onDownloadComplete}
            />
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 15,
    paddingTop: Constants.statusBarHeight + 15,
    zIndex: 999,
    justifyContent: "space-around",
  },
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
