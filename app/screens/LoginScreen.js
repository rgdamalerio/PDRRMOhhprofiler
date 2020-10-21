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

const db = SQLite.openDatabase("hhprofiler22.db");

function LoginScreen({ navigation }) {
  const auth = useAuth();

  const handleSubmit = async ({ email, password }) => {
    db.transaction((tx) => {
      tx.executeSql(
        "select idtbl_enumerator," +
          "tbl_enumeratorfname," +
          "tbl_enumeratorlname," +
          "tbl_enumeratormname," +
          "tbl_enumeratoremail," +
          "password," +
          "tbl_enumeratorcontact," +
          "tbl_enumeratorprov," +
          "tbl_enumeratormun," +
          "tbl_enumeratorbrgy," +
          "tbl_imagepath," +
          "tbl_imagepath," +
          "idtbl_psgc_prov," + //tbl_psgc_prov
          "tbl_psgc_prov_id_fk," +
          "tbl_psgc_provname," +
          "idtbl_psgc_mun," + //tbl_psgc_municipality
          "tbl_psgc_mun_id_fk," +
          "tbl_psgc_munname," +
          "idtbl_psgc_brgy," + //tbl_psgc_brgy
          "tbl_psgc_brgyname " +
          "from tbl_enumerator " +
          "LEFT JOIN tbl_psgc_prov ON tbl_enumerator.tbl_enumeratorprov=tbl_psgc_prov.idtbl_psgc_prov " + //tbl_psgc_prov
          "LEFT JOIN tbl_psgc_mun ON tbl_enumerator.tbl_enumeratormun=tbl_psgc_mun.idtbl_psgc_mun " + //tbl_psgc_municipality
          "LEFT JOIN tbl_psgc_brgy ON tbl_enumerator.tbl_enumeratorbrgy=tbl_psgc_brgy.idtbl_psgc_brgy " + //tbl_psgc_brgy
          "where tbl_enumeratoremail = ? and password = ?;",
        [email, password],
        (tx, results) => {
          if (results.rows.length > 0) {
            auth.logIn(results.rows._array[0]);
          } else {
            alert("Enumerator not found! please check email and password");
          }
        },
        (error) => {
          console.log(error.message);
          Alert.alert(
            "SQLITE ERROR",
            "Database error, Please contact developer, " + error.message,
            [
              {
                text: "OK",
              },
            ]
          );
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
