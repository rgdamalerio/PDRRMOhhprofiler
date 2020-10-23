import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableHighlight,
  Modal,
  View,
} from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import useAuth from "../auth/useAuth";
import PickerItem from "../components/PickerItem";
import ActivityIndicator from "../components/ActivityIndicator";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";

import SwitchInput from "../components/SwitchInput";

const validationSchema = Yup.object().shape({
  lib_typeoflivelihood: Yup.string().required().label("Type of livelihood"),
  tbl_livelihoodproducts: Yup.string().required().label("Product name"),
  lib_tenuralstatus_id: Yup.object().nullable(),
  otherTenuralStatusval: Yup.string().when("lib_tenuralstatus_id.label", {
    is: "Other, Please specify",
    then: Yup.string().required().label("Add other Tenural status"),
  }),
});

const db = SQLite.openDatabase("hhprofiler23.db");
let resetFormHolder;

function AddLivelihood({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(route.params.id);
  const [livelihod, setLivelihod] = useState(
    route.params.update ? route.params.hhlivelihood : []
  );
  const [loading, setLoading] = useState(false);
  const [typelivelihood, setTypelivelihood] = useState();
  const [tenuralStatus, setTenuralStatus] = useState();
  const [othertstatus, setOthertstatus] = useState(false);
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempData, settemData] = useState();

  useEffect(() => {
    route.params.update
      ? navigation.setOptions({ title: "Update Livelihood info" })
      : "";
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

  const reviewInput = (data) => {
    settemData(data);
    setModalVisible(true);
  };

  const handleSubmitNew = (data) => {
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
            data.lib_tenuralstatus_id.id,
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
                      "UPDATE libl_tenuralstatus SET tbl_tsname = ? where id = ?",
                      [data.otherTenuralStatusval, tenuralStatus.length],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          db.transaction(
                            (tx) => {
                              tx.executeSql(
                                "INSERT INTO libl_tenuralstatus (" +
                                  "id," +
                                  "tbl_tsname," +
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
                              Alert.alert("Error", error.message);
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
                    Alert.alert("Error", error.message);
                  }
                );
              }
              Alert.alert(
                "Success",
                "Livelihood successfully save, do you want to add more livelihood?",
                [
                  {
                    text: "No",
                    onPress: () => {
                      setLoading(false);
                      resetFormHolder();
                      if (route.params.addmore) {
                        navigation.navigate("Done", { screen: "AnimatedMap" });
                      } else {
                        navigation.navigate("AddImage", {
                          id: householdid,
                          new: true,
                          addmore: false,
                          update: false,
                        });
                      }
                    },
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      setLoading(false);
                      resetFormHolder();
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

  const handleSubmitUpdate = (data) => {
    setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE tbl_livelihood SET " +
            "lib_typeoflivelihood = ?," +
            "tbl_livelihoodmarketvalue = ?," +
            "tbl_livelihoodtotalarea = ?," +
            "tbl_livelihoodproducts = ?," +
            "lib_tenuralstatus_id = ?," +
            "tbl_livelihoodiswithinsurance = ?," +
            "updated_at = ?," +
            "updated_by= ?  WHERE id = ?",
          [
            data.lib_typeoflivelihood.id,
            data.tbl_livelihoodmarketvalue,
            data.tbl_livelihoodtotalarea,
            data.tbl_livelihoodproducts,
            data.lib_tenuralstatus_id.id,
            data.tbl_livelihoodiswithinsurance,
            String(date),
            user.idtbl_enumerator,
            route.params.id,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              if (data.lib_tenuralstatus_id.id == tenuralStatus.length) {
                db.transaction(
                  (tx) => {
                    tx.executeSql(
                      "UPDATE libl_tenuralstatus SET tbl_tsname = ? where id = ?",
                      [data.otherTenuralStatusval, tenuralStatus.length],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          db.transaction(
                            (tx) => {
                              tx.executeSql(
                                "INSERT INTO libl_tenuralstatus (" +
                                  "id," +
                                  "tbl_tsname," +
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
                              Alert.alert("Error", error.message);
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
                    Alert.alert("Error", error.message);
                  }
                );
              }
              setLoading(false);
              resetFormHolder();
              navigation.navigate("Done", { screen: "AnimatedMap" });
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
            lib_typeoflivelihood: route.params.update
              ? livelihod.lib_typeoflivelihood
                ? {
                    id: livelihod.lib_typeoflivelihood,
                    label: livelihod.lib_desc,
                  }
                : ""
              : "",
            tbl_household_id: route.params.id,
            tbl_livelihoodmarketvalue: route.params.update
              ? String(livelihod.tbl_livelihoodmarketvalue)
              : 0,
            tbl_livelihoodtotalarea: route.params.update
              ? String(livelihod.tbl_livelihoodtotalarea)
              : 0,
            tbl_livelihoodproducts: route.params.update
              ? livelihod.tbl_livelihoodproducts
              : "",
            lib_tenuralstatus_id: route.params.update
              ? livelihod.lib_tenuralstatus_id
                ? {
                    id: livelihod.lib_tenuralstatus_id,
                    label: livelihod.tbl_tsname,
                  }
                : 0
              : 0,
            otherTenuralStatusval: "",
            tbl_livelihoodiswithinsurance: route.params.update
              ? livelihod.tbl_livelihoodiswithinsurance == 1
                ? true
                : false
              : false,
            created_at: String(new Date()),
            updated_at: String(new Date()),
            created_by: user.idtbl_enumerator,
            updated_by: user.idtbl_enumerator,
          }}
          onSubmit={(values, { resetForm }) => {
            resetFormHolder = resetForm;
            reviewInput(values);
          }}
          validationSchema={validationSchema}
        >
          {route.params.new && (
            <TouchableHighlight
              style={{
                ...styles.openButton,
                alignSelf: "flex-start",
                backgroundColor: "#ff5252",
                marginTop: 15,
                marginBottom: 15,
              }}
              onPress={() => {
                navigation.navigate("AddImage", {
                  id: householdid,
                  new: true,
                  addmore: false,
                  update: false,
                });
              }}
            >
              <Text style={styles.textStyle}>Skip</Text>
            </TouchableHighlight>
          )}

          <Picker
            icon="format-list-bulleted-type"
            items={typelivelihood}
            name="lib_typeoflivelihood"
            PickerItemComponent={PickerItem}
            placeholder="Type of Livelihood *"
          />

          <Picker
            icon="format-list-bulleted-type"
            items={tenuralStatus}
            name="lib_tenuralstatus_id"
            PickerItemComponent={PickerItem}
            placeholder="Tenural status"
            setOther={setOthertstatus}
          />

          {othertstatus && (
            <FormField
              autoCorrect={false}
              icon="home-import-outline"
              name="otherTenuralStatusval"
              placeholder="Add other type of program"
            />
          )}

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
            placeholder="Product name *"
          />

          <SwitchInput
            icon="accusoft"
            name="tbl_livelihoodiswithinsurance"
            placeholder="Livelihood is with insurance"
          />

          {route.params.update ? (
            <SubmitButton title="Update Livelihood" />
          ) : (
            <SubmitButton title="Add Livelihood" />
          )}
        </Form>
      </ScrollView>

      {tempData && (
        <Modal animationType="slide" visible={modalVisible}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text
                style={{ fontWeight: "bold", marginBottom: 30, color: "red" }}
              >
                Review Add Livelihood Input
              </Text>
              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Type of livelihood *
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_typeoflivelihood.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Tenural status</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_tenuralstatus_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Livelihood market value
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_livelihoodmarketvalue}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Livelihood total area
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_livelihoodtotalarea}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Livelihood product name
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_livelihoodproducts}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Livelihood is with insurance?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_livelihoodiswithinsurance ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignContent: "space-between",
                }}
              >
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: "#2196F3",
                    marginTop: 15,
                    flex: 1,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Cancel/Update</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: "#2196F3",
                    marginTop: 15,
                    flex: 1,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    if (route.params.update) handleSubmitUpdate(tempData);
                    else handleSubmitNew(tempData);
                  }}
                >
                  {route.params.update ? (
                    <Text style={styles.textStyle}>Update Information</Text>
                  ) : (
                    <Text style={styles.textStyle}>Add Information</Text>
                  )}
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  moreInfoTable: {
    flexDirection: "row",
    width: "100%",
  },
  moreInfolabel: {
    alignContent: "stretch",
    width: "40%",
    padding: 5,
  },
  moreInfolabeltxt: {
    fontWeight: "bold",
  },
  moreInfoData: {
    flex: 1,
    width: "60%",
    padding: 5,
    backgroundColor: "#F194FF",
  },
  moreInforDataTxt: {
    paddingTop: 5,
  },
});

export default AddLivelihood;
