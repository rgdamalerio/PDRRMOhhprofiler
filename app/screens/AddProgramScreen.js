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

const validationSchema = Yup.object().shape({
  typeProgram: Yup.object().required().label("Type of Program"),
  otherTypeprogramval: Yup.string().when("typeProgram.label", {
    is: "Other, Please specify",
    then: Yup.string().required().label("Add other type of program"),
  }),
  programname: Yup.string().required().label("Program name"),
  numberBenificiaries: Yup.number().required().label("Number of Benificiaries"),
  programEmplementer: Yup.string().required().label("Program emplementer"),
});

const db = SQLite.openDatabase("hhprofiler20.db");

function AddProgramScreen({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(route.params.id);
  const [loading, setLoading] = useState(false);
  const [typeprogram, setTypeprogram] = useState([]);
  const [otherTypeprogram, setOtherTypeprogram] = useState(false);
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    getTypeProgram();
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

  const handleSubmit = (data, resetForm) => {
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
            "created_at," +
            "updated_at," +
            "created_by," +
            "updated_by" +
            ") values (?,?,?,?,?,?,?,?,?)",
          [
            householdid,
            data.typeProgram.id,
            data.programname,
            data.numberBenificiaries,
            data.programEmplementer,
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
                      resetForm({ data: "" });
                      navigation.navigate("Demography", {
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
      <Screen style={styles.container}>
        <ScrollView>
          <Form
            initialValues={{
              typeProgram: 0,
              otherTypeprogramval: "",
              programname: "",
              numberBenificiaries: 0,
              programEmplementer: "",
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
                navigation.navigate("Demography", {
                  id: householdid,
                });
              }}
            >
              <Text style={styles.textStyle}>Skip</Text>
            </TouchableHighlight>

            <Picker
              icon="format-list-bulleted-type"
              items={typeprogram}
              name="typeProgram"
              PickerItemComponent={PickerItem}
              placeholder="Type of Program"
              setOther={setOtherTypeprogram}
            />

            {otherTypeprogram && (
              <FormField
                autoCorrect={false}
                icon="playlist-edit"
                name="otherTypeprogramval"
                placeholder="Add other type of program"
              />
            )}

            <FormField
              autoCorrect={false}
              icon="alpha-p"
              name="programname"
              placeholder="Name of Program"
            />

            <FormField
              autoCorrect={false}
              icon="cash"
              name="numberBenificiaries"
              placeholder="Num of benificiaries"
              width="75%"
              keyboardType="number-pad"
            />

            <FormField
              autoCorrect={false}
              icon="alpha-p"
              name="programEmplementer"
              placeholder="Program Implementor"
            />

            <SubmitButton title="Add Program" />
          </Form>
        </ScrollView>
      </Screen>
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

export default AddProgramScreen;
