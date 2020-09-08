import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";
import * as MediaLibrary from "expo-media-library";

import Screen from "../components/Screen";
import PickerItem from "../components/PickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  AddressPicker,
  SubmitButton,
  FormCameraPicker,
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

  const handleSubmit = (data) => {
    const res = data.image.split("/");
    const filename = res[res.length - 1];

    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into tbl_enumerator (tbl_enumeratorfname,tbl_enumeratorlname,tbl_enumeratormname,tbl_enumeratoremail,password,tbl_enumeratorcontact,tbl_enumeratorprov,tbl_enumeratormun,tbl_enumeratorbrgy,tbl_imagepath) values (?,?,?,?,?,?,?,?,?,?)",
          [
            data.fname,
            data.lname,
            data.mname,
            data.email,
            data.password,
            data.phoneNumber,
            data.prov.id,
            data.mun.id,
            data.brgy.id,
            filename,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                "Success",
                "You are Registered Successfully, you can now Login to start encoding household information",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      createAlbum(data.image);
                      navigation.navigate("Login");
                    },
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
          alert("Email address already exist! Please try to use another email");
        }
      }
    );
  };

  const createAlbum = async (uri) => {
    const asset = await MediaLibrary.createAssetAsync(uri);
    MediaLibrary.createAlbumAsync("PDRRMOProfiler", asset, false)
      .then(() => {
        return asset.uri;
      })
      .catch((error) => {
        alert("Error saving image, Error details: " + error);
        return null;
      });
  };

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <Form
          initialValues={{
            image: null,
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
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <FormCameraPicker name="image" />
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
