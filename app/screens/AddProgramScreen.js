import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableHighlight,
  Modal,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
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

const validationSchema = Yup.object().shape({
  typeProgram: Yup.object().required().label("Type of Program"),
  otherTypeprogramval: Yup.string().when("typeProgram.label", {
    is: "Other, Please specify",
    then: Yup.string().required().label("Add other type of program"),
  }),
  programname: Yup.string().required().label("Program name"),
  numberBenificiaries: Yup.number().required().moreThan(0).label("Number of Benificiaries"),
  programEmplementer: Yup.string().required().label("Program emplementer"),
});

const db = SQLite.openDatabase("hhprofiler23.db");
let resetFormHolder;

function AddProgramScreen({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(route.params.id);
  const [program, setProgram] = useState(
    route.params.update ? route.params.program : []
  );
  const [loading, setLoading] = useState(false);
  const [typeprogram, setTypeprogram] = useState([]);
  const [otherTypeprogram, setOtherTypeprogram] = useState(false);
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempData, settemData] = useState();

  useEffect(() => {
    getTypeProgram();
    route.params.update
      ? navigation.setOptions({ title: "Update Program info" })
      : "";
  }, []);

  const getTypeProgram = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_topname AS label from lib_typeofprogram`,
          [],
          (_, { rows: { _array } }) => setTypeprogram(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Type of Program Library, Please contact developer, " +
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

  const deleteProgram = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM tbl_programs WHERE id = ?;",
        [route.params.program.programid],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            navigation.navigate("Done", { screen: "AnimatedMap" });
          } else {
            alert("Error deleting");
          }
        },
        (error) => {
          console.log(error);
          Alert.alert(
            "SQLITE ERROR",
            "Database error deleting program information, Please contact developer, " +
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
          "INSERT INTO tbl_programs (" +
            "tbl_household_id," +
            "lib_typeofprogram_id," +
            "lib_pname," +
            "lib_pnumbeni," +
            "lib_pimplementor," +
            "extracted," +
            "created_at," +
            "updated_at," +
            "created_by," +
            "updated_by" +
            ") values (?,?,?,?,?,?,?,?,?,?)",
          [
            householdid,
            data.typeProgram.id,
            data.programname,
            data.numberBenificiaries,
            data.programEmplementer,
            0,
            String(date),
            String(date),
            user.idtbl_enumerator,
            user.idtbl_enumerator,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              if (data.typeProgram.id == typeprogram.length) {
                db.transaction(
                  (tx) => {
                    tx.executeSql(
                      "UPDATE lib_typeofprogram SET lib_topname = ? where id = ?",
                      [data.otherTypeprogramval, typeprogram.length],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          db.transaction(
                            (tx) => {
                              tx.executeSql(
                                "INSERT INTO lib_typeofprogram (" +
                                  "id," +
                                  "lib_topname," +
                                  "created_at," +
                                  "created_by," +
                                  "updated_at," +
                                  "updated_by" +
                                  ") values (?,?,?,?,?,?)",
                                [
                                  typeprogram.length + 1,
                                  "Other, Please specify",
                                  String(date),
                                  user.idtbl_enumerator,
                                  String(date),
                                  user.idtbl_enumerator,
                                ],
                                (tx, results) => {
                                  if (results.rowsAffected > 0) {
                                    getTypeProgram();
                                    setOtherTypeprogram(false);
                                  } else {
                                    Alert.alert(
                                      "Error",
                                      "Adding new type of program item failed, Please update data or contact administrator"
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
                            "Update last item in type of program failed, Please update data or contact administrator"
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
                "Program successfully save, do you want to add more program?",
                [
                  {
                    text: "No",
                    onPress: () => {
                      setLoading(false);
                      resetFormHolder();
                      if (route.params.addmore) {
                        navigation.navigate("Done", { screen: "AnimatedMap" });
                      } else {
                        navigation.navigate("Demography", {
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
          "UPDATE tbl_programs SET " +
            "lib_typeofprogram_id = ?," +
            "lib_pname=?," +
            "lib_pnumbeni =?," +
            "lib_pimplementor =?," +
            "extracted =?," +
            "updated_at = ?," +
            "updated_by= ?  WHERE id = ?",
          [
            data.typeProgram.id,
            data.programname,
            data.numberBenificiaries,
            data.programEmplementer,
            0,
            String(date),
            user.idtbl_enumerator,
            route.params.program.programid,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              if (data.typeProgram.id == typeprogram.length) {
                db.transaction(
                  (tx) => {
                    tx.executeSql(
                      "UPDATE lib_typeofprogram SET lib_topname = ? where id = ?",
                      [data.otherTypeprogramval, typeprogram.length],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          db.transaction(
                            (tx) => {
                              tx.executeSql(
                                "INSERT INTO lib_typeofprogram (" +
                                  "id," +
                                  "lib_topname," +
                                  "created_at," +
                                  "created_by," +
                                  "updated_at," +
                                  "updated_by" +
                                  ") values (?,?,?,?,?,?)",
                                [
                                  typeprogram.length + 1,
                                  "Other, Please specify",
                                  String(date),
                                  user.idtbl_enumerator,
                                  String(date),
                                  user.idtbl_enumerator,
                                ],
                                (tx, results) => {
                                  if (results.rowsAffected > 0) {
                                    getTypeProgram();
                                    setOtherTypeprogram(false);
                                  } else {
                                    Alert.alert(
                                      "Error",
                                      "Adding new type of program item failed, Please update data or contact administrator"
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
                            "Update last item in type of program failed, Please update data or contact administrator"
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
              alert("Update Program information Failed");
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
      <Screen style={styles.container}>
        <ScrollView>
          <Form
            initialValues={{
              typeProgram: route.params.update
                ? program.typeofprogramid
                  ? { id: program.typeofprogramid, label: program.lib_topname }
                  : ""
                : "",
              otherTypeprogramval: "",
              programname: route.params.update ? program.lib_pname : "",
              numberBenificiaries: route.params.update
                ? String(program.lib_pnumbeni)
                : 0,
              programEmplementer: route.params.update
                ? program.lib_pimplementor
                : "",
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
                  navigation.navigate("Demography", {
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

            {route.params.update && (
              <TouchableWithoutFeedback
                onPress={() => {
                  Alert.alert(
                    "Warning",
                    "Are you sure you want to delete this availed program? action cannot be undone!!!",
                    [
                      {
                        text: "No",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          deleteProgram();
                        },
                      },
                    ]
                  );
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.danger,
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={35}
                    color={colors.white}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}

            <Picker
              icon="format-list-bulleted-type"
              items={typeprogram}
              name="typeProgram"
              PickerItemComponent={PickerItem}
              placeholder="Type of Program *"
              setOther={setOtherTypeprogram}
            />

            {otherTypeprogram && (
              <FormField
                autoCorrect={false}
                icon="playlist-edit"
                name="otherTypeprogramval"
                placeholder="Add other type of program *"
              />
            )}

            <FormField
              autoCorrect={false}
              icon="alpha-p"
              name="programname"
              placeholder="Name of Program *"
            />

            <FormField
              autoCorrect={false}
              icon="cash"
              name="numberBenificiaries"
              placeholder="Num of benificiaries *"
              width="75%"
              keyboardType="number-pad"
            />

            <FormField
              autoCorrect={false}
              icon="alpha-p"
              name="programEmplementer"
              placeholder="Program Implementor *"
            />

            {route.params.update ? (
              <SubmitButton title="Update Program" />
            ) : (
              <SubmitButton title="Add Program" />
            )}
          </Form>
        </ScrollView>
      </Screen>

      {tempData && (
        <Modal animationType="slide" visible={modalVisible}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text
                style={{ fontWeight: "bold", marginBottom: 30, color: "red" }}
              >
                Review Add Program Input
              </Text>
              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Type of Program</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.typeProgram.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Name of Program</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.programname}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Number of Benificiaries
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.numberBenificiaries}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Program Implementor
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.programEmplementer}
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

export default AddProgramScreen;
