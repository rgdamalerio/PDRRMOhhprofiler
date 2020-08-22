import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image,
} from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import ErrorPermission from "./ErrormPermission";

function CameraInput() {
  const [hasPermission, setHasPermission] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [camera, setCamera] = useState();
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { granted } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    if (!granted)
      alert("You need to enable permission to access the Camera library.");
    else setHasPermission(true);
  };

  const requestImagePickerPermission = async () => {
    const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (!granted) {
      alert(
        "You need to enable permission to access the Image Picker library."
      );
      return;
    }
  };

  const takePicture = async () => {
    if (camera) {
      const temp = await camera.takePictureAsync();
      const photo = await FileSystem.copyAsync(temp.uri);
      setImageUri(photo.uri);
    }
  };

  const handlePress = () => {
    if (!imageUri) setModalVisible(true);
    else
      Alert.alert(
        "Change Image",
        "Are you sure you want to change this image?",
        [{ text: "Yes", onPress: () => setImageUri(null) }, { text: "No" }]
      );
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.cancelled) {
        setImageUri(result.uri);
      }
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.container}>
          {!imageUri && (
            <MaterialCommunityIcons
              color={colors.medium}
              name="camera"
              size={40}
            />
          )}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible}>
        {!hasPermission ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <ErrorPermission
              style={{
                color: colors.danger,
              }}
            >
              No access to camera
            </ErrorPermission>

            <TouchableOpacity
              style={{
                //alignSelf: "flex-end",
                alignItems: "center",
                //backgroundColor: "red",
                margin: 10,
              }}
              onPress={() => setModalVisible(false)}
            >
              <MaterialCommunityIcons
                name="close-circle"
                style={{ color: colors.danger, fontSize: 40 }}
              />
              <Text>Back to form</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              opacity: 0.9999,
            }}
          >
            <Camera
              style={{ flex: 3 }}
              type={type}
              ref={(ref) => setCamera(ref)}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    margin: 10,
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    style={{ color: colors.white, fontSize: 40 }}
                  />
                </TouchableOpacity>
              </View>
            </Camera>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
                onPress={() => {
                  selectImage();
                  setModalVisible(false);
                }}
              >
                <MaterialCommunityIcons
                  name="image-album"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
                onPress={() => {
                  takePicture;
                  setModalVisible(false);
                }}
              >
                <MaterialCommunityIcons
                  name="camera-iris"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <MaterialCommunityIcons
                  name="camera-switch"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});

export default CameraInput;
