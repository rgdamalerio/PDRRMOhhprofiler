import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import Screen from "../components/Screen";
import AddressPickerItem from "../components/AddressPickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
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

function RegisterScreen() {
  const [reg, setReg] = useState(null);
  const [pro, setPro] = useState(null);
  const [mun, setMun] = useState(null);
  const [brgy, setBrgy] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select idtbl_psgc_prov AS id, tbl_psgc_provname AS label from tbl_psgc_prov`,
        [],
        (_, { rows: { _array } }) => setPro(_array)
      );
    });
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
            db.transaction((tx) => {
              tx.executeSql(
                "insert into enumerator (tbl_enumeratorfname,tbl_enumeratorlname,tbl_enumeratormname,tbl_enumeratoremail,tbl_enumeratorcontact,tbl_enumeratorprov,tbl_enumeratormun,tbl_enumeratorbrgy) values (?,?,?,?,?,?,?,?,?)",
                [
                  values.fname,
                  values.lname,
                  values.mname,
                  values.email,
                  values.phoneNumber,
                  values.prov.id,
                  values.mun.id,
                  values.brgy.id,
                  values.password,
                ]
              );
              tx.executeSql("select * from enumerator", [], (_, { rows }) =>
                console.log(JSON.stringify(rows))
              );
            }, null)
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
