import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import Screen from "../components/Screen";
import AddressPickerItem from "../components/AddressPickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  FormImagePicker,
  SubmitButton,
} from "../components/forms";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const validationSchema = Yup.object().shape({
  prov: Yup.string().required().label("Province"),
  mun: Yup.string().required().label("Municipality"),
  brgy: Yup.string().required().label("Barangay"),
  image: Yup.string().required().nullable().label("Image"),
});

const db = SQLite.openDatabase("hhprofiler.db");

function RegisterScreen({ navigation }) {
  const [pro, setPro] = useState();
  const [mun, setMun] = useState();
  const [brgy, setBrgy] = useState();

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select idtbl_psgc_prov AS id, tbl_psgc_provname AS label from tbl_psgc_prov`,
          [],
          (_, { rows: { _array } }) => setPro(_array)
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
  }, []);

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <Form
          initialValues={{
            prov: "",
            mun: "",
            brgy: "",
            image: null,
          }}
          onSubmit={(values) =>
            db.transaction(
              (tx) => {
                tx.executeSql(
                  "insert into tbl_enumerator (tbl_enumeratorprov,tbl_enumeratormun,tbl_enumeratorbrgy) values (?,?,?)",
                  [values.prov.id, values.mun.id, values.brgy.id],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      Alert.alert(
                        "Success",
                        "You are Registered Successfully, you can now Login to start encoding household information",
                        [
                          {
                            text: "OK",
                            onPress: () => navigation.navigate("Login"),
                          },
                        ]
                      );
                    } else alert("Registration Failed");
                  }
                );
              },
              (error) => {
                if (
                  error.message ==
                  "UNIQUE constraint failed: tbl_enumerator.tbl_enumeratoremail (code 2067 SQLITE_CONSTRAINT_UNIQUE)"
                ) {
                  alert(
                    "Email address already exist! Please try to use another email"
                  );
                }
              }
            )
          }
          validationSchema={validationSchema}
        >
          <FormImagePicker name="image" />

          <FormField
            autoCorrect={false}
            icon="account"
            name="fname"
            placeholder="First Name"
          />
          <Picker
            icon="earth"
            items={pro}
            name="prov"
            PickerItemComponent={AddressPickerItem}
            placeholder="Province"
            searchable
            setMun={setMun}
          />
          <Picker
            icon="earth"
            items={mun}
            name="mun"
            PickerItemComponent={AddressPickerItem}
            placeholder="Municipality"
            searchable
            setBrgy={setBrgy}
          />
          <Picker
            icon="earth"
            items={brgy}
            name="brgy"
            PickerItemComponent={AddressPickerItem}
            placeholder="Barangay"
            searchable
            setbrgyValue
          />
          <SubmitButton title="Save" />
        </Form>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
