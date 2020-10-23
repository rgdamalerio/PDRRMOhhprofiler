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
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import ActivityIndicator from "../components/ActivityIndicator";

import colors from "../config/colors";
import ErrorPermission from "../components/ErrormPermission";

const db = SQLite.openDatabase("hhprofiler23.db");

function AddImage({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(route.params.id);
  const [householdHead, setHouseholdHead] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState();
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    getHouseholdHead();
  }, []);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    await Camera.requestPermissionsAsync().then((returns) => {
      if (returns.granted) setHasPermission(true);
    });
  };

  const getHouseholdHead = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT tbl_household_id || "_" ||tbl_fname || "_" || tbl_lname as newfilename FROM tbl_hhdemography WHERE tbl_household_id=? AND tbl_ishead=?`,
          [householdid, 1],
          (_, { rows: { _array } }) => {
            _array.length > 0
              ? setHouseholdHead(_array)
              : setHouseholdHead([
                  {
                    newfilename: route.params.id,
                  },
                ]);
          }
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Type of Livelihood Library, Please contact developer, " +
            error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const copyImage = async (uri, filename) => {
    try {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}Photo`,
        {
          intermediates: true,
        }
      );
      const localFile = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}Photo`
      );
      if (localFile.exists) {
        FileSystem.copyAsync({
          from: uri,
          to: `${FileSystem.documentDirectory}Photo/${filename}.jpeg`,
        });
        const newFile = await FileSystem.getInfoAsync(
          `${FileSystem.documentDirectory}Photo/${filename}.jpeg`
        );
        if (newFile.exists) {
          createAlbum(`${FileSystem.documentDirectory}Photo/${filename}.jpeg`);
        }
      } else {
        alert("Folder not exist");
      }
    } catch (error) {
      alert("Error : " + error);
    }
  };
  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      setImageUri(photo.uri);
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
              setImageUri(null);
            },
          },
          { text: "No" },
        ]
      );
  };

  const createAlbum = async (uri) => {
    //Initialize asset from uri
    const asset = await MediaLibrary.createAssetAsync(uri);
    //Remove existing image if available
    MediaLibrary.getAlbumAsync("PDRRMOProfiler").then((album) => {
      if (album) {
        MediaLibrary.removeAssetsFromAlbumAsync(asset, album.id)
          .then((result) => {})
          .catch((error) => {
            alert("Error deleting previous image from album");
          });
      }
    });
    //Check if album exist
    MediaLibrary.getAlbumAsync("PDRRMOProfiler").then((album) => {
      //if return true just add asset to album
      if (album) {
        try {
          MediaLibrary.addAssetsToAlbumAsync(asset, album.id, false)
            .then((result) => {
              handleSubmit(asset.filename, asset.uri);
            })
            .catch((error) => {
              alert("Error adding asset to album: " + error);
            });
        } catch (error) {
          handleSubmit(asset.filename, asset.uri);
        }
        //if false create album with initial asset
      } else {
        try {
          MediaLibrary.createAlbumAsync("PDRRMOProfiler", asset, false)
            .then(() => {
              handleSubmit(asset.filename, asset.uri);
            })
            .catch((error) => {
              alert("Error saving image, Error details: " + error);
            });
        } catch (error) {
          handleSubmit(asset.filename, asset.uri);
        }
      }
    });
  };

  const handleSubmit = (filename, uri) => {
    setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE tbl_household SET tbl_hhimage = ?, tbl_uri = ? where tbl_household_id = ?",
          [filename, uri, householdid],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              setLoading(false);
              if (route.params.update) {
                navigation.navigate("Done", { screen: "AnimatedMap" });
              } else {
                navigation.navigate("Done", { screen: "Profiler" });
              }
            } else {
              setLoading(false);
            }
          }
        );
      },
      (error) => {
        Alert.alert("Error", "Error: " + error.message);
        setLoading(false);
      }
    );
  };
  return (
    <>
      <ActivityIndicator visible={loading} />
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.container}>
          <Text style={styles.instruction}>Tap To Take Picture</Text>
          {!imageUri && (
            <MaterialCommunityIcons
              color={colors.medium}
              name="camera"
              size={200}
            />
          )}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
        </View>
      </TouchableWithoutFeedback>
      {imageUri && (
        <TouchableOpacity
          style={{
            alignItems: "center",
            bottom: 50,
            justifyContent: "center",
            height: 50,
            position: "absolute",
            width: "100%",
          }}
          onPress={() => {
            const filename =
              householdHead[0].newfilename + "_" + new Date().getTime();
            copyImage(imageUri, filename);
          }}
        >
          <MaterialCommunityIcons
            name="check-circle"
            style={{ color: "green", fontSize: 100 }}
          />
        </TouchableOpacity>
      )}
      <Modal visible={modalVisible}>
        {hasPermission === null ? (
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
            ></Camera>

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
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  style={{ color: colors.white, fontSize: 40 }}
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
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 170,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  instruction: {
    marginBottom: 15,
  },
  animation: {
    width: 150,
  },
});

export default AddImage;
