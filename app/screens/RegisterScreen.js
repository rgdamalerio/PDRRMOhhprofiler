import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";
import * as MediaLibrary from "expo-media-library";

import PickerItem from "../components/PickerItem";
import useAuth from "../auth/useAuth";
import ActivityIndicator from "../components/ActivityIndicator";
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
const db = SQLite.openDatabase("hhprofiler23.db");

function RegisterScreen({ navigation, route }) {
  const [enumerator, setEnumerator] = useState(
    route.params ? route.params.enumerator : []
  );
  const [loading, setLoading] = useState(false);
  const [pro, setPro] = useState();
  const [mun, setMun] = useState();
  const [brgy, setBrgy] = useState();
  const { logOut } = useAuth();

  useEffect(() => {
    getProvince();
  }, []);

  const getProvince = () => {
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
  };

  const handleProvChange = (munvalue) => {
    setMun(munvalue);
  };

  const handleMunChange = (brgyvalue) => {
    setBrgy(brgyvalue);
  };

  const handleSubmitNew = (data) => {
    setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into tbl_enumerator (" +
            "tbl_enumeratorfname," +
            "tbl_enumeratorlname," +
            "tbl_enumeratormname," +
            "tbl_enumeratoremail," +
            "password," +
            "tbl_enumeratorcontact," +
            "tbl_enumeratorprov," +
            "tbl_enumeratormun," +
            "tbl_enumeratorbrgy," +
            "tbl_imagepath) " +
            "values (?,?,?,?,?,?,?,?,?,?)",
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
            data.image,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              if (data.image) createAlbum(data.image);
              Alert.alert(
                "Success",
                "You are Registered Successfully, you can now Login to start encoding household information",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.navigate("Login");
                      setLoading(false);
                    },
                  },
                ]
              );
            } else {
              alert("Registration Failed");
              setLoading(false);
            }
          }
        );
      },
      (error) => {
        Alert.alert("Error", "Error: " + error.message);
        setLoading(false);
      }
    );
  };

  const handleSubmitUpdate = (data) => {
    setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE  tbl_enumerator SET " +
            "tbl_enumeratorfname =?," +
            "tbl_enumeratorlname =?," +
            "tbl_enumeratormname =?," +
            "tbl_enumeratoremail =?," +
            "password =?," +
            "tbl_enumeratorcontact =?," +
            "tbl_enumeratorprov =?," +
            "tbl_enumeratormun =?," +
            "tbl_enumeratorbrgy =?," +
            "tbl_imagepath =? " +
            "WHERE idtbl_enumerator = ? ",
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
            data.image,
            route.params.enumerator.idtbl_enumerator,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              if (data.image) createAlbum(data.image);
              Alert.alert(
                "Success",
                "Update enumerator information successfully",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setLoading(false);
                      logOut();
                    },
                  },
                ]
              );
            } else {
              alert("Update information Failed");
              setLoading(false);
            }
          }
        );
      },
      (error) => {
        Alert.alert("Error", "Error: " + error.message);
        setLoading(false);
      }
    );
  };

  const createAlbum = async (uri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      MediaLibrary.createAlbumAsync("PDRRMOProfiler", asset, false)
        .then(() => {})
        .catch((error) => {
          alert("Error saving image, Error details: " + error);
        });
    } catch (error) {}
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ScrollView style={styles.container}>
        <Form
          initialValues={{
            image: route.params ? route.params.enumerator.tbl_imagepath : null,
            fname: route.params
              ? route.params.enumerator.tbl_enumeratorfname
              : "",
            lname: route.params
              ? route.params.enumerator.tbl_enumeratorlname
              : "",
            mname: route.params
              ? route.params.enumerator.tbl_enumeratormname
              : "",
            phoneNumber: route.params
              ? route.params.enumerator.tbl_enumeratorcontact
              : "",
            prov: route.params
              ? route.params.enumerator.tbl_enumeratorprov
                ? {
                    id: route.params.enumerator.tbl_enumeratorprov,
                    label: route.params.enumerator.tbl_psgc_provname,
                  }
                : ""
              : "",
            mun: route.params
              ? route.params.enumerator.tbl_enumeratormun
                ? {
                    id: route.params.enumerator.tbl_enumeratormun,
                    label: route.params.enumerator.tbl_psgc_munname,
                  }
                : ""
              : "",
            brgy: route.params
              ? route.params.enumerator.tbl_enumeratorbrgy
                ? {
                    id: route.params.enumerator.tbl_enumeratorbrgy,
                    label: route.params.enumerator.tbl_psgc_brgyname,
                  }
                : ""
              : "",
            email: route.params
              ? route.params.enumerator.tbl_enumeratoremail
              : "",
            password: route.params ? route.params.enumerator.password : "",
          }}
          onSubmit={(values) => {
            if (route.params) handleSubmitUpdate(values);
            else handleSubmitNew(values);
          }}
          validationSchema={validationSchema}
        >
          <FormCameraPicker name="image" />

          <FormField
            autoCorrect={false}
            icon="account"
            name="fname"
            placeholder="First Name *"
          />
          <FormField
            autoCorrect={false}
            icon="account"
            name="lname"
            placeholder="Last Name *"
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
            placeholder="Phone number *"
            width={320}
            keyboardType="number-pad"
          />
          <AddressPicker
            icon="earth"
            items={pro}
            name="prov"
            PickerItemComponent={PickerItem}
            placeholder="Province  *"
            setMun={handleProvChange}
          />
          <AddressPicker
            icon="earth"
            items={mun}
            name="mun"
            PickerItemComponent={PickerItem}
            placeholder="Municipality *"
            setBrgy={handleMunChange}
          />
          <AddressPicker
            icon="earth"
            items={brgy}
            name="brgy"
            PickerItemComponent={PickerItem}
            placeholder="Barangay *"
            setbrgyValue
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email *"
            textContentType="emailAddress"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password *"
            secureTextEntry
            textContentType="password"
          />
          {route.params ? (
            <SubmitButton title="Update" />
          ) : (
            <SubmitButton title="Register" />
          )}
        </Form>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
