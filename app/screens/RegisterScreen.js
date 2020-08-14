import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import Screen from "../components/Screen";
import AppPicker from "../components/Picker";
import AddressPickerItem from "../components/AddressPickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";

const province = [
  {
    id: 1,
    label: "Jeremy Bacquial",
    value: "test",
    description: "Panaytayon R.T.R Agusan del norte",
    image: require("../assets/house1.jpg"),
  },
  {
    id: 2,
    label: "Kirby Balaba",
    value: "testing",
    description: "Balang-balang R.T.R Agusan del norte",
    image: require("../assets/house2.jpg"),
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

  db.transaction((tx) => {
    //tx.executeSql("SELECT * FROM tbl_psgc_prov;", [], (tx, results) => {
    //  (_, { rows: { _array } }) => setPro(_array);
    //  console.log(pro);
    //});
    tx.executeSql(
      "select * from tbl_psgc_prov",
      [],
      (_, { rows }) => setPro(JSON.stringify(rows))
      //
    );
  });

  // console.log(pro);

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
            items={pro}
            name="prov"
            //numberOfColumns={3}
            PickerItemComponent={AddressPickerItem}
            placeholder="Province"
            //width="50%"
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
