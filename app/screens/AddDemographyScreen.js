import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import useAuth from "../auth/useAuth";
import Screen from "../components/Screen";
import PickerItem from "../components/PickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  FormDatePicker,
  SubmitButton,
} from "../components/forms";

const validationSchema = Yup.object().shape({
  typeProgram: Yup.string().required().label("Type of Program"),
  programname: Yup.string().required().label("Program name"),
  numberBenificiaries: Yup.number().required().label("Number of Benificiaries"),
  programEmplementer: Yup.string().required().label("Program emplementer"),
});

const db = SQLite.openDatabase("hhprofiler.db");

function AddDemographyScreen({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(route.params.id);
  const [loading, setLoading] = useState(false);
  const [belongsTo, setBelongsTo] = useState([]);
  const [gender, setGender] = useState([]);
  const [relationship, setRelationship] = useState([]);
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    _setRelationship();
    _belongsTo();
    _gender();
  }, []);

  const _setRelationship = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_rhname AS label from libl_relationshiphead`,
          [],
          (_, { rows: { _array } }) => setRelationship(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Relationship to head Library, Please contact developer, " +
            error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const _belongsTo = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_fbname AS label from lib_familybelongs`,
          [],
          (_, { rows: { _array } }) => setBelongsTo(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Nuclear family belongs Library, Please contact developer, " +
            error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const _gender = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_gname AS label from lib_gender`,
          [],
          (_, { rows: { _array } }) => setGender(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Gender Library, Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const handleSubmit = (data, resetForm) => {
    setLoading(true);
    let filename = null;

    if (data.image != null) {
      const res = data.image.split("/");
      filename = res[res.length - 1];
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO tbl_programs (" +
            "tbl_household_id," +
            "lib_typeofprogram_id," +
            "lib_pname," +
            "lib_pnumbeni," +
            "lib_pimplementor," +
            "created_at," +
            "updated_at," +
            "created_by," +
            "updated_by" +
            ") values (?,?,?,?,?,?,?,?,?)",
          [
            householdid,
            data.typeProgram.id,
            data.programname,
            data.numberBenificiaries,
            data.programEmplementer,
            String(date),
            String(date),
            user.idtbl_enumerator,
            user.idtbl_enumerator,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              Alert.alert(
                "Success",
                "Program successfully save, do you want to add more program?",
                [
                  {
                    text: "No",
                    onPress: () => {
                      setLoading(false);
                      navigation.navigate("Demography", {
                        id: householdid,
                      });
                    },
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      resetForm({ data: "" });
                      setLoading(false);
                    },
                  },
                ]
              );
            } else {
              setLoading(false);
              alert("Adding Program information Failed");
            }
          }
        );
      },
      (error) => {
        console.log(error.message);
        setLoading(false);
        alert("Database Error: " + error.message);
      }
    );
  };

  return (
    <Screen style={styles.container}>
      {loading ? (
        <ActivityIndicator
          visible={loading}
          size="large"
          textStyle={styles.spinnerTextStyle}
        />
      ) : (
        <ScrollView>
          <Form
            initialValues={{
              tbl_fname: "",
              tbl_lname: "",
              tbl_mname: "",
              tbl_extension: "",
              lib_familybelongs_id: 0,
              lib_gender_id: 0,
              tbl_relationshiphead_id: 0,
              tbl_datebirth: 0,
              lib_maritalstatus_id: 0,
              lib_ethnicity_id: 0,
              lib_religion_id: 0,
              tbl_isofw: 0,
              tbl_is3yrsinlocation: 0,
              lib_nutritioanalstatus_id: 0,
              tbl_iscurattschool: 0,
              tbl_canreadwriteorhighschoolgrade: 0,
              tbl_primary_occupation: 0,
              lib_hea_id: 0,
              lib_tscshvc_id: 0,
              lib_monthlyincome_id: 0,
              tbl_ismembersss: 0,
              tbl_ismembergsis: 0,
              tbl_ismemberphilhealth: 0,
            }}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
            }}
            validationSchema={validationSchema}
          >
            <TouchableHighlight
              style={{
                //flex: 1,
                //flexDirection: "row",
                ...styles.openButton,
                alignSelf: "flex-start",
                backgroundColor: "#ff5252",
                marginTop: 15,
                marginBottom: 15,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Skip</Text>
            </TouchableHighlight>

            <FormField
              autoCorrect={false}
              icon="account-outline"
              name="tbl_fname"
              placeholder="Firstname"
            />
            <FormField
              autoCorrect={false}
              icon="account-outline"
              name="tbl_lname"
              placeholder="Lastname"
            />
            <FormField
              autoCorrect={false}
              icon="account-outline"
              name="tbl_mname"
              placeholder="Middlename"
            />
            <FormField
              autoCorrect={false}
              icon="account-outline"
              name="tbl_extension"
              placeholder="Extension"
            />

            <Picker
              icon="account-group"
              items={belongsTo}
              name="lib_familybelongs_id"
              PickerItemComponent={PickerItem}
              placeholder="Nuclear family belong"
            />
            <Picker
              icon="gender-male-female"
              items={gender}
              name="lib_gender_id"
              PickerItemComponent={PickerItem}
              placeholder="Gender"
            />

            <Picker
              icon="account-group-outline"
              items={setRelationship}
              name="tbl_relationshiphead_id"
              PickerItemComponent={PickerItem}
              placeholder="Relationship to the head"
            />

            <FormDatePicker
              name="tbl_datebirth"
              icon="date"
              placeholder="Date of birth"
              width="50%"
              display="spinner"
              mode="date"
            />

            <SubmitButton title="Add Program" />
          </Form>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddDemographyScreen;
