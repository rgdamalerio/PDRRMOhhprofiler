import React, { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { AppLoading } from "expo";
import * as MediaLibrary from "expo-media-library";

import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import ActivityIndicator from "./app/components/ActivityIndicator";
import logger from "./app/utility/logger";

const databaseName = "hhprofiler.db";
logger.start();

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const startup = () => {
    requestPermission();
    openDatabase();
    restoreUser();
  };

  const requestPermission = async () => {
    MediaLibrary.requestPermissionsAsync();
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
            setLoading(true);
          })
          .catch((error) => {
            logger.log(new Error(error));
          });
      } else {
        setLoading(true);
      }
    } catch (error) {
      logger.log(new Error(error));
      setLoading(true);
    }
  };

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (!user) return;
    setUser(user);
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
