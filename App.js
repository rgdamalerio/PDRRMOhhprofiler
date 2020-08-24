import React, { useEffect, Profiler } from "react";
import * as FileSystem from "expo-file-system";
import { View, Text } from "react-native";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SQLite from "expo-sqlite";

import RegisterScreens from "./app/screens/RegisterScreen";
import RespondentScreen from "./app/screens/RespondentScreen";
import AccountScreen from "./app/screens/AccountScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import ProfilerScreen from "./app/screens/ProfilerScreen";
import CameraInput from "./app/components/CameraInput";
import LocationInput from "./app/components/LocationInput";
import DateInput from "./app/components/DateInput";
import RegisterScreen from "./app/screens/RegisterScreen";
import Picker from "./app/components/Picker";

async function removeDatabase() {
  const sqlDir = FileSystem.documentDirectory + "SQLite/";
  await FileSystem.deleteAsync(sqlDir + "hhprofiler.db", {
    idempotent: true,
  })
    .then(() => {
      console.log("Finished deleting ");
    })
    .catch((error) => {
      console.error(error);
    });

  const internalDbName = "hhprofiler.db"; // Call whatever you want
  if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
    console.log("Wala najud ha. pa abtan nato 5mins");
  }
}

const checkDatabaseExist = async () => {
  const internalDbName = "hhprofiler.db";
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
    //removeDatabase();
    openDatabaseIShipWithApp();
    //db.transaction((tx) => {
    //  tx.executeSql("select * from tbl_enumerator", [], (_, { rows }) =>
    //    console.log(JSON.stringify(rows))
    //  );
    //});
  }, []);

  const openDatabaseIShipWithApp = async () => {
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    const internalDbName = "hhprofiler.db"; // Call whatever you want
    //if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
    await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true });
    const asset = Asset.fromModule(
      require("./app/assets/database/hhprofiler.db")
    );
    await FileSystem.downloadAsync(
      //"https://github.com/rgdamalerio/PDRRMOhhprofiler/raw/Profiler/app/assets/database/hhprofiler.db",
      asset.uri,
      sqlDir + internalDbName
    )
      .then(({ uri }) => {
        console.log("Finished downloading to " + uri);
      })
      .catch((error) => {
        console.error(error);
      });
    //} else console.log("human na download");
  };

  //checkDatabaseExist();

  return (
    /*
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="Register"
          options={{ headerShown: false }}
          component={RegisterScreens}
        />
        <Stack.Screen
          name="Account"
          options={{ headerShown: false }}
          component={AccountScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
     */
    /*
    <LocationInput
      name="coordinates"
      icon="add-location"
      placeholder="coordinates"
      width="50%"
    />*/
    /*<DateInput
      name="yearconstract"
      icon="date"
      placeholder="Year construct"
      width="45%"
      display="spinner"
      mode="date"
      //datevalue
      year
    />*/
    <ProfilerScreen />
  );
}
