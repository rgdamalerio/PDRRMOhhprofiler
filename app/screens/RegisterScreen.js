import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  AppForm as Form,
  AppFormField as FormField,
  SubmitButton,
} from "../components/forms";

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

function RegisterScreen() {
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
          <FormField
            autoCorrect={false}
            icon="earth"
            name="prov"
            placeholder="Province"
            chevron="chevron-down"
          />
          <FormField
            autoCorrect={false}
            icon="earth"
            name="mun"
            placeholder="Municipality"
            chevron="chevron-down"
          />
          <FormField
            autoCorrect={false}
            icon="earth"
            name="brgy"
            placeholder="Barangay"
            chevron="chevron-down"
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
