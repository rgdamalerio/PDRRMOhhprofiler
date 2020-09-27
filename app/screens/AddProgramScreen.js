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
  typeProgram: Yup.string().required().label("Type of Program"),
  programname: Yup.string().required().label("Program name"),
  numberBenificiaries: Yup.number().required().label("Number of Benificiaries"),
  programEmplementer: Yup.string().required().label("Program emplementer"),
});

const db = SQLite.openDatabase("hhprofiler14.db");

function AddProgramScreen({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(route.params.id);
  const [loading, setLoading] = useState(false);
  const [typeprogram, setTypeprogram] = useState([]);
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
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
  }, []);

  const handleSubmit = (data, resetForm) => {
    setLoading(true);
    let filename = null;

    if (data.image != null) {
      const res = data.image.split("/");
      filename = res[res.length - 1];
    }

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
              Alert.alert(
                "Success",
                "Program successfully save, do you want to add more program?",
                [
                  {
                    text: "No",
                    onPress: () => {
                      setLoading(false);
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
        console.log(error.message);
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
              typeProgram: "",
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
                //flex: 1,
                //flexDirection: "row",
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
            />

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
