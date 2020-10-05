import React, { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { AppLoading } from "expo";
import * as Permissions from "expo-permissions";

import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import ActivityIndicator from "./app/components/ActivityIndicator";
const databaseName = "hhprofiler.db";

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const startup = () => {
    openDatabase();
    restoreUser();
  };

  useEffect(() => {
    requestCameraPermission();
    requestMediaLibraryPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (!granted)
      alert("You need to enable permission to access the Camera library.");
  };

  const requestMediaLibraryPermission = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (!granted)
      alert("You need to enable permission to access the Media library.");
  };

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (!user) return;
    setUser(user);
  };

  const openDatabase = async () => {
    try {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`,
        {
          intermediates: true,
        }
      );
      const localDatabase = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}SQLite/hhprofiler21.db`
      );
      if (!localDatabase.exists) {
        FileSystem.downloadAsync(
          Asset.fromModule(require("./app/assets/database/" + databaseName))
            .uri,
          `${FileSystem.documentDirectory}SQLite/hhprofiler21.db`
        )
          .then(({ uri }) => {
            console.log("Database copy to : " + uri);
            setLoading(true);
          })
          .catch((error) => {
            console.log("Database copy error : " + error);
          });
      } else {
        console.log("Database exist");
        setLoading(true);
      }
    } catch (error) {
      console.log("Error : " + error);
      setLoading(true);
    }
  };

  if (!isReady)
    return (
      <AppLoading startAsync={startup} onFinish={() => setIsReady(true)} />
    );

  {
    if (!loading) return <ActivityIndicator visible={true} />;
    return (
      <AuthContext.Provider value={{ user, setUser }}>
        <NavigationContainer theme={navigationTheme}>
          {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
}
