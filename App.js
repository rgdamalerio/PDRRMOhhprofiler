import React, { useState } from "react";
import * as FileSystem from "expo-file-system";
import { View, Text } from "react-native";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { AppLoading } from "expo";
import * as SQLite from "expo-sqlite";

import RegisterScreens from "./app/screens/RegisterScreen";
import RespondentScreen from "./app/screens/RespondentScreen";
import AccountScreen from "./app/screens/AccountScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import ProfilerScreen from "./app/screens/ProfilerScreen";
import Household from "./app/screens/HouseholdScreen";
import AddDemographyScreen from "./app/screens/AddDemographyScreen";
import CameraInput from "./app/components/CameraInput";
import LocationInput from "./app/components/LocationInput";
import DateInput from "./app/components/DateInput";
import RegisterScreen from "./app/screens/RegisterScreen";
import Picker from "./app/components/Picker";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";

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

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const startup = () => {
    openDatabaseIShipWithApp();
    restoreUser();
  };

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (!user) return;
    setUser(user);
  };

  const openDatabaseIShipWithApp = async () => {
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    const internalDbName = "hhprofiler.db"; // Call whatever you want
    if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
      await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true });

      //const asset = Asset.fromModule(
      //  require("./app/assets/database/hhprofiler.db")
      //).uri;

      await FileSystem.downloadAsync(
        "http://github.com/rgdamalerio/PDRRMOhhprofiler/raw/AddPrograms/app/assets/database/hhprofiler.db",
        //asset,
        sqlDir + internalDbName
      )
        .then(({ uri }) => {
          console.log("Finished downloading to " + uri);
        })
        .catch((error) => {
          console.error(error);
        });
    } else console.log("human na download");
  };

  if (!isReady)
    return (
      <AppLoading startAsync={startup} onFinish={() => setIsReady(true)} />
    );

  //checkDatabaseExist();

  return (
    /*
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer theme={navigationTheme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
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
    <AddDemographyScreen />
  );
}
