import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Alert } from "react-native";
import { SearchBar } from "react-native-elements";
import * as SQLite from "expo-sqlite";

import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";

const db = SQLite.openDatabase("hhprofiler23.db");

function HouseholdListScreen({ navigation }) {
  const [households, setHouseholds] = useState([]);
  const [originalRespondents, setOriginalRespondents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getHouseholdinfo();
  }, []);

  const getHouseholdinfo = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT tbl_household_id AS id, tbl_respondent AS name FROM tbl_household`,
          [],
          (_, { rows: { _array } }) => {
            setHouseholds(_array);
            setOriginalRespondents(_array);
          }
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading household , Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const handleDelete = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM tbl_household WHERE tbl_household_id = ?;",
        [id],
        (tx, results) => {},
        (error) => {
          console.log(error);
          Alert.alert(
            "SQLITE ERROR",
            "Database error deleting household information, Please contact developer, " +
              error,
            [
              {
                text: "OK",
              },
            ]
          );
        }
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM tbl_livelihood WHERE tbl_household_id = ?;",
        [id],
        (tx, results) => {},
        (error) => {
          console.log(error);
          Alert.alert(
            "SQLITE ERROR",
            "Database error deleting livelihood table, Please contact developer, " +
              error,
            [
              {
                text: "OK",
              },
            ]
          );
        }
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM tbl_hhdemography WHERE tbl_household_id = ?;",
        [id],
        (tx, results) => {},
        (error) => {
          console.log(error);
          Alert.alert(
            "SQLITE ERROR",
            "Database error deleting demography table, Please contact developer, " +
              error,
            [
              {
                text: "OK",
              },
            ]
          );
        }
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM tbl_programs WHERE tbl_household_id = ?;",
        [id],
        (tx, results) => {},
        (error) => {
          console.log(error);
          Alert.alert(
            "SQLITE ERROR",
            "Database error deleting programs availed table, Please contact developer, " +
              error,
            [
              {
                text: "OK",
              },
            ]
          );
        }
      );
    });

    getHouseholdinfo();
  };

  return (
    <>
      {
        <SearchBar
          placeholder="Search Here"
          lightTheme
          onChangeText={(text) => {
            setSearch(text);
            const newData = households.filter((item) => {
              const itemData = `${item.name.toUpperCase()}`;

              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            setHouseholds(text === "" ? originalRespondents : newData);
          }}
          autoCorrect={false}
          value={search}
        />
      }
      <FlatList
        data={households}
        keyExtractor={(household) => household.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            //onPress={() => handleDelete(item.id)}
            renderRightActions={() => (
              <ListItemDeleteAction
                onPress={() => {
                  Alert.alert(
                    "Warning",
                    "Are you sure you want to delete this household? action cannot be undone!!!",
                    [
                      {
                        text: "No",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          handleDelete(item.id);
                        },
                      },
                    ]
                  );
                }}
              />
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

export default HouseholdListScreen;
