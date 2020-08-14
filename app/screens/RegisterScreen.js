import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import Screen from "../components/Screen";
import AppPicker from "../components/AppPicker";
import AddressPickerItem from "../components/AddressPickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";

const province = [
  {
    id: "00000001",
    label: "Agusan del Norte",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000002",
    label: "Agusan del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000003",
    label: "Dinagat islands",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000004",
    label: "Surigao del Norte",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
  {
    id: "00000005",
    label: "Suriga del Sur",
    tbl_psgc_region_id_fk: "0000001",
  },
];

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const validationSchema = Yup.object().shape({
  fname: Yup.string().required().label("First Name"),
  lname: Yup.string().required().label("Last Name"),
  phoneNumber: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
  prov: Yup.string().required().label("Province"),
  mun: Yup.string().required().label("Municipality"),
  brgy: Yup.string().required().label("Barangay"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

const db = SQLite.openDatabase("hhprofiler.db");

function RegisterScreen() {
  const [pro, setPro] = useState(null);
  const [reg, setReg] = useState(null);
  const [mun, setMun] = useState(null);
  const [brgy, setBrgy] = useState(null);

  /*useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql("SELECT * FROM tbl_psgc_prov", [], ({ rows }) =>
          //setPro(JSON.stringify(rows))
          console.log(JSON.stringify(rows))
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  */
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
          onSubmit={(values) => console.log(values)}
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
            items={province}
            name="prov"
            //numberOfColumns={3}
            PickerItemComponent={AddressPickerItem}
            placeholder="Province"
            //width="50%"
            searchable
          />
          <AppPicker
            autoCorrect={false}
            icon="earth"
            name="mun"
            placeholder="Municipality"
          />
          <AppPicker
            autoCorrect={false}
            icon="earth"
            name="brgy"
            placeholder="Barangay"
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
