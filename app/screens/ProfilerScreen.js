import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet, ScrollView, Alert } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import Screen from "../components/Screen";
import PickerItem from "../components/PickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  AddressPicker,
  FormCameraPicker,
  FormLocationPicker,
  FormDatePicker,
  SubmitButton,
} from "../components/forms";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  prov: Yup.string().required().label("Province"),
  mun: Yup.string().required().label("Municipality"),
  brgy: Yup.string().required().label("Barangay"),
  coordinates: Yup.string().required().nullable().label("Coordinates"),
  image: Yup.string().required().nullable().label("Image"),
  typebuilding: Yup.string().required().label("Type of building"),
  yearconstract: Yup.string().required().label("Year construct"),
});

const db = SQLite.openDatabase("hhprofiler.db");

const categories = [
  { label: "Furniture", value: 1 },
  { label: "Clothing", value: 2 },
  { label: "Camera", value: 3 },
];

function ProfilerScreen({ navigation }) {
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
            coordinates: null,
            image: null,
            yearconstract: "",
            typebuilding: "",
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
          <FormCameraPicker name="image" />
          <FormLocationPicker
            name="coordinates"
            icon="add-location"
            placeholder="coordinates"
            width="50%"
          />
          <AddressPicker
            icon="earth"
            items={pro}
            name="prov"
            PickerItemComponent={PickerItem}
            placeholder="Province"
            searchable
            setMun={setMun}
          />
          <AddressPicker
            icon="earth"
            items={mun}
            name="mun"
            PickerItemComponent={PickerItem}
            placeholder="Municipality"
            searchable
            setBrgy={setBrgy}
          />
          <AddressPicker
            icon="earth"
            items={brgy}
            name="brgy"
            PickerItemComponent={PickerItem}
            placeholder="Barangay"
            searchable
            setbrgyValue
          />
          <Picker
            icon="warehouse"
            items={categories}
            name="typebuilding"
            PickerItemComponent={PickerItem}
            placeholder="Type of building"
          />
          <FormDatePicker
            name="yearconstract"
            icon="date"
            placeholder="Year construct"
            width="50%"
            display="default"
            mode="date"
            year
          />
          <FormField
            autoCorrect={false}
            icon="account"
            name="fname"
            placeholder="First Name"
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

export default ProfilerScreen;
