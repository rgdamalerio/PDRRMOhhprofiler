import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";
import * as SQLite from "expo-sqlite";

import Text from "./Text";
import EmptyFlatlist from "./EmptyFlatlist";
import defaultStyles from "../config/styles";
import PickerItem from "./PickerItem";
import Screen from "./Screen";

const db = SQLite.openDatabase("hhprofiler17.db");

function AddressPicker({
  icon,
  items,
  numberOfColumns = 1,
  onSelectItem,
  PickerItemComponent = PickerItem,
  placeholder,
  selectedItem,
  width = "100%",
  searchable,
  setMun,
  setBrgy,
  setbrgyValue,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemsearch, setItemsearch] = useState(items);
  const [search, setSearch] = useState("");

  const handleProvChange = (value) => {
    setMun(value);
  };

  const handleMunChange = (value) => {
    setBrgy(value);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={[styles.container, { width }]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
          )}
          {selectedItem ? (
            <Text style={styles.text}>{selectedItem.label}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}

          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={defaultStyles.colors.medium}
          />
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <Screen style={{ marginTop: -12 }}>
          <Button title="Close" onPress={() => setModalVisible(false)} />
          {searchable && (
            <SearchBar
              placeholder="Search Here"
              lightTheme
              onChangeText={(text) => {
                setSearch(text);
                const newData = items.filter((item) => {
                  const itemData = `${item.label.toUpperCase()}`;
                  const textData = text.toUpperCase();
                  return itemData.indexOf(textData) > -1;
                });
                setItemsearch(text === "" ? items : newData);
              }}
              autoCorrect={false}
              value={search}
            />
          )}
          {setMun && (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numberOfColumns}
              ListEmptyComponent={
                <EmptyFlatlist style={styles.textEmpty}>
                  Error loading address library, Please contact developer
                </EmptyFlatlist>
              }
              renderItem={({ item }) => (
                <PickerItemComponent
                  item={item}
                  label={item.label}
                  onPress={() => {
                    setModalVisible(false);
                    onSelectItem(item);
                    db.transaction(
                      (tx) => {
                        tx.executeSql(
                          `select idtbl_psgc_mun AS id, tbl_psgc_munname AS label from tbl_psgc_mun where tbl_psgc_prov_id_fk = ?;`,
                          [item.id],
                          (_, { rows: { _array } }) => handleProvChange(_array)
                        );
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
                  }}
                />
              )}
            />
          )}
          {setBrgy && (
            <FlatList
              data={itemsearch ? itemsearch : items}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numberOfColumns}
              ListEmptyComponent={
                <EmptyFlatlist style={styles.textEmpty}>
                  Select Province firsts to display available municipality
                </EmptyFlatlist>
              }
              renderItem={({ item }) => (
                <PickerItemComponent
                  item={item}
                  label={item.label}
                  onPress={() => {
                    setModalVisible(false);
                    onSelectItem(item);
                    db.transaction((tx) => {
                      tx.executeSql(
                        `select idtbl_psgc_brgy AS id, tbl_psgc_brgyname AS label from tbl_psgc_brgy where tbl_psgc_mun_id_fk = ?;`,
                        [item.id],
                        (_, { rows: { _array } }) => handleMunChange(_array)
                      );
                    });
                  }}
                />
              )}
            />
          )}
          {setbrgyValue && (
            <FlatList
              data={itemsearch ? itemsearch : items}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numberOfColumns}
              ListEmptyComponent={
                <EmptyFlatlist style={styles.textEmpty}>
                  Select Municipality first to display available barangay
                </EmptyFlatlist>
              }
              renderItem={({ item }) => (
                <PickerItemComponent
                  item={item}
                  label={item.label}
                  onPress={() => {
                    setModalVisible(false);
                    onSelectItem(item);
                  }}
                />
              )}
            />
          )}
          {}
        </Screen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  text: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  textEmpty: {
    color: defaultStyles.colors.danger,
  },
  danger: {
    color: defaultStyles.colors.danger,
    paddingVertical: 15,
    marginLeft: 10,
  },
});

export default AddressPicker;
