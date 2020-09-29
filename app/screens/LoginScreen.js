import React from "react";
import { StyleSheet, Image, ScrollView, View, Alert } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import AppText from "../components/AppText";
import useAuth from "../auth/useAuth";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

const db = SQLite.openDatabase("hhprofiler20.db");

function LoginScreen({ navigation }) {
  const auth = useAuth();

  const handleSubmit = async ({ email, password }) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from tbl_enumerator where tbl_enumeratoremail = ? and password = ?;",
        [email, password],
        (tx, results) => {
          if (results.rows.length > 0) {
            auth.logIn(results.rows._array[0]);
          } else {
            alert("Enumerator not found! please check email and password");
          }
        }
      );
    });
  };

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={require("../assets/logo.png")}
        />
        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Login" />
          <View style={styles.registerContainer}>
            <AppText
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              Register Here
            </AppText>
          </View>
        </AppForm>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  registerContainer: {
    paddingVertical: 20,
    alignContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
