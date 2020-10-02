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
import AddLivelihood from "./app/screens/AddLivelihood";
import ActivityIndicator from "./app/components/ActivityIndicator";
import AddImage from "./app/screens/AddImage";
const databaseName = "hhprofiler.db";

async function removeDatabase() {
  const sqlDir = `${FileSystem.documentDirectory}SQLite/`;
  await FileSystem.deleteAsync(sqlDir + "hhprofiler.db", {
    idempotent: true,
  })
    .then(() => {
      console.log("Finished deleting ");
    })
    .catch((error) => {
      console.error(error);
    });

  await FileSystem.deleteAsync(sqlDir + "database.db-journal", {
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
  const [loading, setLoading] = useState(false);

  const startup = () => {
    //removeDatabase();
    //penDatabaseIShipWithApp();
    openDatabase();
    restoreUser();
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

  //checkDatabaseExist();

  {
    if (!loading) return <ActivityIndicator visible={true} />;
    return (
      /*<AuthContext.Provider value={{ user, setUser }}>
        <NavigationContainer theme={navigationTheme}>
          {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
      */
      <AddImage />
    );
  }
}
