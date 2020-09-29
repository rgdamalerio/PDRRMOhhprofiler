import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";
import * as SQLite from "expo-sqlite";

import Screen from "../components/Screen";

const db = SQLite.openDatabase("hhprofiler20.db");

function HouseholdScreen({ navigation, route }) {
  const mapRef = useRef(null);

  console.log(route.params.id);

  useEffect(() => {
    houseHold(route.params.id);
  }, []);

  const houseHold = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select idtbl_psgc_prov AS id, tbl_psgc_provname AS label from tbl_psgc_prov`,
          [],
          (_, { rows: { _array } }) => console.log(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Address Library, Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  return (
    <Screen style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.mapStyle}
        mapType="satellite"
      ></MapView>
      <View style={styles.inner}></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
  },
});

export default HouseholdScreen;
