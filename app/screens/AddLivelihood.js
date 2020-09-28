import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableHighlight,
} from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import useAuth from "../auth/useAuth";
import Screen from "../components/Screen";
import PickerItem from "../components/PickerItem";
import ActivityIndicator from "../components/ActivityIndicator";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";

import SwitchInput from "../components/SwitchInput";

const validationSchema = Yup.object().shape({});

const db = SQLite.openDatabase("hhprofiler18.db");

function AddLivelihood({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(route.params.id);
  const [loading, setLoading] = useState(false);
  const [typelivelihood, setTypelivelihood] = useState([]);
  const [tenuralStatus, setTenuralStatus] = useState([]);
  const [otherTenuralStatus, setOtherTenuralStatus] = useState(false);
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    getTypeLivelihood();
    getTenuralStatus();
  }, []);

  const getTypeLivelihood = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_desc AS label from lib_livelihood`,
          [],
          (_, { rows: { _array } }) => setTypelivelihood(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Type of Livelihood Library, Please contact developer, " +
            error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const getTenuralStatus = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, tbl_tsname AS label from libl_tenuralstatus`,
          [],
          (_, { rows: { _array } }) => setTenuralStatus(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Type of Tenural Status Library, Please contact developer, " +
            error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const handleSubmit = (data, resetForm) => {
    setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO tbl_livelihood (" +
            "lib_typeoflivelihood," +
            "tbl_household_id," +
            "tbl_livelihoodmarketvalue," +
            "tbl_livelihoodtotalarea," +
            "tbl_livelihoodproducts," +
            "lib_tenuralstatus_id," +
            "tbl_livelihoodiswithinsurance," +
            "created_at," +
            "updated_at," +
            "created_by," +
            "updated_by" +
            ") values (?,?,?,?,?,?,?,?,?,?,?)",
          [
            data.lib_typeoflivelihood.id,
            route.params.id,
            data.tbl_livelihoodmarketvalue,
            data.tbl_livelihoodtotalarea,
            data.tbl_livelihoodproducts,
            data.lib_tenuralstatus_id,
            data.tbl_livelihoodiswithinsurance,
            String(date),
            String(date),
            user.idtbl_enumerator,
            user.idtbl_enumerator,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              if (data.lib_tenuralstatus_id.id == tenuralStatus.length) {
                db.transaction(
                  (tx) => {
                    tx.executeSql(
                      "UPDATE lib_typeofprogram SET lib_topname = ? where id = ?",
                      [data.otherTenuralStatusval, tenuralStatus.length],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          db.transaction(
                            (tx) => {
                              tx.executeSql(
                                "INSERT INTO lib_livelihood (" +
                                  "id," +
                                  "lib_desc," +
                                  "created_at," +
                                  "created_by," +
                                  "updated_at," +
                                  "updated_by" +
                                  ") values (?,?,?,?,?,?)",
                                [
                                  tenuralStatus.length + 1,
                                  "Other, Please specify",
                                  String(date),
                                  user.idtbl_enumerator,
                                  String(date),
                                  user.idtbl_enumerator,
                                ],
                                (tx, results) => {
                                  if (results.rowsAffected > 0) {
                                    getTenuralStatus();
                                    setOtherTenuralStatus(false);
                                  } else {
                                    Alert.alert(
                                      "Error",
                                      "Adding new Tenural status item failed, Please update data or contact administrator"
                                    );
                                  }
                                }
                              );
                            },
                            (error) => {
                              Alert.alert("Error", error);
                            }
                          );
                        } else {
                          Alert.alert(
                            "Error",
                            "Update last item in evacuation area failed, Please update data or contact administrator"
                          );
                        }
                      }
                    );
                  },
                  (error) => {
                    Alert.alert("Error", error);
                  }
                );
              }

              Alert.alert(
                "Success",
                "Program successfully save, do you want to add more program?",
                [
                  {
                    text: "No",
                    onPress: () => {
                      setLoading(false);
                      resetForm({ data: "" });
                      navigation.navigate("Profiler", {
                        id: householdid,
                      });
                    },
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      resetForm({ data: "" });
                      setLoading(false);
                    },
                  },
                ]
              );
            } else {
              setLoading(false);
              alert("Adding Program information Failed");
            }
          }
        );
      },
      (error) => {
        setLoading(false);
        alert("Database Error: " + error.message);
      }
    );
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ScrollView style={styles.container}>
        <Form
          initialValues={{
            lib_typeoflivelihood: 0,
            tbl_household_id: route.params.id,
            tbl_livelihoodmarketvalue: 0,
            tbl_livelihoodtotalarea: 0,
            tbl_livelihoodproducts: "",
            lib_tenuralstatus_id: 0,
            otherTenuralStatusval: "",
            tbl_livelihoodiswithinsurance: 0,
            created_at: String(new Date()),
            updated_at: String(new Date()),
            created_by: user.idtbl_enumerator,
            updated_by: user.idtbl_enumerator,
          }}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm);
          }}
          validationSchema={validationSchema}
        >
          <TouchableHighlight
            style={{
              ...styles.openButton,
              alignSelf: "flex-start",
              backgroundColor: "#ff5252",
              marginTop: 15,
              marginBottom: 15,
            }}
            onPress={() => {
              navigation.navigate("Profiler");
            }}
          >
            <Text style={styles.textStyle}>Skip</Text>
          </TouchableHighlight>

          <Picker
            icon="format-list-bulleted-type"
            items={typelivelihood}
            name="lib_typeoflivelihood"
            PickerItemComponent={PickerItem}
            placeholder="Type of Livelihood"
          />

          <FormField
            autoCorrect={false}
            icon="cash"
            name="tbl_livelihoodmarketvalue"
            placeholder="Livelihood market value"
            width="75%"
            keyboardType="number-pad"
          />

          <FormField
            autoCorrect={false}
            icon="bookmark-plus-outline"
            name="tbl_livelihoodtotalarea"
            placeholder="Livelihood total area"
            width="75%"
            keyboardType="number-pad"
          />

          <FormField
            autoCorrect={false}
            icon="alpha-p"
            name="tbl_livelihoodproducts"
            placeholder="Product name"
          />

          <Picker
            icon="format-list-bulleted-type"
            items={tenuralStatus}
            name="lib_tenuralstatus_id"
            PickerItemComponent={PickerItem}
            placeholder="Tenural status"
            setOther={setOtherTenuralStatus}
          />

          {otherTenuralStatus && (
            <FormField
              autoCorrect={false}
              icon="home-import-outline"
              name="otherTenuralStatusval"
              placeholder="Add other type of program"
            />
          )}

          <SwitchInput
            icon="accusoft"
            name="tbl_livelihoodiswithinsurance"
            placeholder="Livelihood is with insurance"
          />
          <SubmitButton title="Add Livelihood" />
        </Form>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddLivelihood;
