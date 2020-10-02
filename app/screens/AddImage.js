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
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import ErrorPermission from "../components/ErrormPermission";

import Screen from "../components/Screen";

function AddImage(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [rollPermision, setRollPermission] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState();
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
      // camera roll
      const { cam_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setRollPermission(cam_roll === "granted");
      setRollPermission(true);
    })();
  }, []);

  const requestPermission = async () => {
    const { granted } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
      Permissions.CAMERA
    );
    if (!granted)
      alert("You need to enable permission to access the Camera library.");
    else setHasPermission(true);
  };

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      onChangeImage(photo.uri);
      setModalVisible(false);
    }
  };

  const handlePress = () => {
    requestPermission();
    if (!imageUri) setModalVisible(true);
    else
      Alert.alert(
        "Change Image",
        "Are you sure you want to change this image?",
        [
          {
            text: "Yes",
            onPress: () => {
              setModalVisible(true);
              onChangeImage(null);
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
        {hasPermission === null || rollPermision === null ? (
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
                textAlign: "center",
              }}
            >
              You need to check Permissions to use Camera and Media Library
            </ErrorPermission>

            <TouchableOpacity
              style={{
                alignItems: "center",
                margin: 10,
              }}
              onPress={() => setModalVisible(false)}
            >
              <MaterialCommunityIcons
                name="keyboard-backspace"
                style={{ color: colors.black, fontSize: 40 }}
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
              ref={(ref) => setCameraRef(ref)}
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
                style={styles.cameraControl}
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
                style={styles.cameraControl}
                onPress={() => {
                  takePicture();
                }}
              >
                <MaterialCommunityIcons
                  name="camera-iris"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraControl}
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
  cameraControl: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
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

export default AddImage;
