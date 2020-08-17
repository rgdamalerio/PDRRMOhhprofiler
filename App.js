import React, { useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import RegisterScreens from "./app/screens/RegisterScreen";
import RespondentScreen from "./app/screens/RespondentScreen";
import AccountScreen from "./app/screens/AccountScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import { View, Text } from "react-native";

async function removeDatabase() {
  const sqlDir = FileSystem.documentDirectory + "SQLite/";
  await FileSystem.deleteAsync(sqlDir + "hhprofiler.db", {
    idempotent: true,
  });
}

const openDatabaseIShipWithApp = async () => {
  const internalDbName = "hhprofiler.db"; // Call whatever you want
  const sqlDir = FileSystem.documentDirectory + "SQLite/";
  if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
    await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true });
    const asset = Asset.fromModule(
      require("./app/assets/database/hhprofiler.db")
    );
    await FileSystem.downloadAsync(asset.uri, sqlDir + internalDbName)
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log("dir exists");
  }
};

const checkDatabaseExist = async () => {
  const internalDbName = "hhprofiler.db"; // Call whatever you want
  const sqlDir = FileSystem.documentDirectory + "SQLite/";
  if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
    console.log("dir not exists");
  } else {
    console.log("dir exists");
  }
};

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    openDatabaseIShipWithApp();
  }, []);
  //removeDatabase();
  //checkDatabaseExist();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
