import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import * as SQLite from "expo-sqlite";

import {
  ListItem,
  ListItemUpdateAction,
  ListItemSeparator,
} from "../components/lists";

const db = SQLite.openDatabase("hhprofiler23.db");

function EnumeratorListScreen({ navigation }) {
  const [enumerators, setenumerator] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getEnumerator();
  }, []);

  const getEnumerator = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT idtbl_enumerator AS id, tbl_enumeratorfname || ' ' || tbl_enumeratorlname || ' ' ||  tbl_enumeratormname AS name,  tbl_enumeratoremail as email, tbl_imagepath as image FROM tbl_enumerator`,
          [],
          (_, { rows: { _array } }) => setenumerator(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading enumerators , Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const handleUpdate = (enumerator) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select idtbl_enumerator," +
          "tbl_enumeratorfname," +
          "tbl_enumeratorlname," +
          "tbl_enumeratormname," +
          "tbl_enumeratoremail," +
          "password," +
          "tbl_enumeratorcontact," +
          "tbl_enumeratorprov," +
          "tbl_enumeratormun," +
          "tbl_enumeratorbrgy," +
          "tbl_imagepath," +
          "tbl_imagepath," +
          "idtbl_psgc_prov," + //tbl_psgc_prov
          "tbl_psgc_prov_id_fk," +
          "tbl_psgc_provname," +
          "idtbl_psgc_mun," + //tbl_psgc_municipality
          "tbl_psgc_mun_id_fk," +
          "tbl_psgc_munname," +
          "idtbl_psgc_brgy," + //tbl_psgc_brgy
          "tbl_psgc_brgyname " +
          "from tbl_enumerator " +
          "LEFT JOIN tbl_psgc_prov ON tbl_enumerator.tbl_enumeratorprov=tbl_psgc_prov.idtbl_psgc_prov " + //tbl_psgc_prov
          "LEFT JOIN tbl_psgc_mun ON tbl_enumerator.tbl_enumeratormun=tbl_psgc_mun.idtbl_psgc_mun " + //tbl_psgc_municipality
          "LEFT JOIN tbl_psgc_brgy ON tbl_enumerator.tbl_enumeratorbrgy=tbl_psgc_brgy.idtbl_psgc_brgy " + //tbl_psgc_brgy
          "where idtbl_enumerator = ?;",
        [enumerator.id],
        (tx, results) => {
          if (results.rows.length > 0) {
            navigation.navigate("Updateuser", {
              enumerator: results.rows._array[0],
            });
          } else {
            alert("Enumerator not found! please contact developer");
          }
        },
        (error) => {
          console.log(error);
          Alert.alert(
            "SQLITE ERROR",
            "Database error, Please contact developer, " + error,
            [
              {
                text: "OK",
              },
            ]
          );
        }
      );
    });
  };

  return (
    <>
      {/*<SearchBar
        placeholder="Search Here"
        lightTheme
        onChangeText={(text) => {
          setSearch(text);
          const newData = enumerators.filter((item) => {
            const itemData = `${item.name.toUpperCase()}   
            ${item.email.toUpperCase()} ${item.email.toUpperCase()}`;

            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setenumerator(text === "" ? originalRespondents : newData);
        }}
        autoCorrect={false}
        value={search}
      />*/}
      <FlatList
        data={enumerators}
        keyExtractor={(enumerator) => enumerator.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subTitle={item.email}
            image={{ uri: item.image }}
            onPress={() => handleUpdate(item)}
            renderRightActions={() => (
              <ListItemUpdateAction onPress={() => handleUpdate(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default EnumeratorListScreen;
