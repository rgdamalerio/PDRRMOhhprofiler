import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import Screen from "../components/Screen";
import PickerItem from "../components/PickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  AddressPicker,
  SubmitButton,
} from "../components/forms";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const validationSchema = Yup.object().shape({
  fname: Yup.string().required().label("First Name"),
  lname: Yup.string().required().label("Last Name"),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required()
    .label("Phone number"),
  prov: Yup.string().required().label("Province"),
  mun: Yup.string().required().label("Municipality"),
  brgy: Yup.string().required().label("Barangay"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
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
            fname: "",
            lname: "",
            mname: "",
            phoneNumber: "",
            prov: "",
            mun: "",
            brgy: "",
            email: "",
            password: "",
          }}
          onSubmit={(values) =>
            db.transaction(
              (tx) => {
                tx.executeSql(
                  "insert into tbl_enumerator (tbl_enumeratorfname,tbl_enumeratorlname,tbl_enumeratormname,tbl_enumeratoremail,password,tbl_enumeratorcontact,tbl_enumeratorprov,tbl_enumeratormun,tbl_enumeratorbrgy) values (?,?,?,?,?,?,?,?,?)",
                  [
                    values.fname,
                    values.lname,
                    values.mname,
                    values.email,
                    values.password,
                    values.phoneNumber,
                    values.prov.id,
                    values.mun.id,
                    values.brgy.id,
                  ],
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
          <FormField
            autoCorrect={false}
            icon="account"
            name="fname"
            placeholder="First Name"
          />
          <FormField
            autoCorrect={false}
            icon="account"
            name="lname"
            placeholder="Last Name"
          />
          <FormField
            autoCorrect={false}
            icon="account"
            name="mname"
            placeholder="Middle Name"
          />
          <FormField
            autoCorrect={false}
            icon="phone"
            name="phoneNumber"
            placeholder="Phone number"
            width={320}
            keyboardType="number-pad"
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
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Register" />
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
