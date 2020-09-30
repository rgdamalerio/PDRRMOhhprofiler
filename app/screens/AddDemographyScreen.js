import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableHighlight,
  Modal,
  View,
} from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

import useAuth from "../auth/useAuth";
import PickerItem from "../components/PickerItem";
import ActivityIndicator from "../components/ActivityIndicator";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  FormDatePicker,
  SubmitButton,
} from "../components/forms";

import SwitchInput from "../components/SwitchInput";

const validationSchema = Yup.object().shape({
  tbl_fname: Yup.string().required().label("First Name"),
  tbl_lname: Yup.string().required().label("Middle Name"),
  lib_disability_id: Yup.string().when("tbl_withspecialneeds", {
    is: true,
    then: Yup.string().required(
      'Type of Disability is required when person with special needs is "Yes"'
    ),
  }),
  lib_gradelvl_id: Yup.string().when("tbl_iscurattschool", {
    is: true,
    then: Yup.string().required(
      'Year/Grade currently attending is required when crrently in school is "Yes"'
    ),
  }),
  tbl_relationshiphead_id: Yup.object().nullable(),
  otherRelationship: Yup.string().when("tbl_relationshiphead_id.label", {
    is: "Other, Please specify",
    then: Yup.string().required().label("Add other relationship"),
  }),

  lib_disability_id: Yup.object().nullable(),
  otherDisabilityval: Yup.string().when("lib_disability_id.label", {
    is: "Other, Please specify",
    then: Yup.string().required().label("Add other type of disability"),
  }),
});

const db = SQLite.openDatabase("hhprofiler21.db");

function AddDemographyScreen({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(route.params.id);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState([]);
  const [relationship, setRelationship] = useState([]);
  const [otherRelationship, setOtherRelationship] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState([]);
  const [disability, setDisability] = useState([]);
  const [otherDisability, setOtherDisability] = useState(false);
  const [nutrituonal, setNutrituonal] = useState([]);
  const [gradelvl, setGradelvl] = useState([]);
  const [tscshvc, setTscshvc] = useState([]);
  const [income, setIncome] = useState([]);
  const [nuclearfamily, setNuclearfamily] = useState([]);
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [tempData, settemData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    _setRelationship();
    _gender();
    _setMaritalStatus();
    _setDisabilities();
    _nutrituanal();
    _gradelvl();
    _tscshvc();
    _income();
    _setNuclearfamily();
  }, []);

  const _setNuclearfamily = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id, tbl_fname || " "   || tbl_lname AS label from tbl_hhdemography where tbl_household_id = ?`,
          [householdid],
          (_, { rows: { _array } }) => setNuclearfamily(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading nuclear family Library, Please contact developer, " +
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

  const _setMaritalStatus = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_msname AS label from lib_maritalstatus`,
          [],
          (_, { rows: { _array } }) => setMaritalStatus(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Marital status Library, Please contact developer, " +
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

  const _setDisabilities = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_dname AS label from lib_disability`,
          [],
          (_, { rows: { _array } }) => setDisability(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Marital status Library, Please contact developer, " +
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

  const _nutrituanal = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_nsname AS label from lib_nutritioanalstatus`,
          [],
          (_, { rows: { _array } }) => setNutrituonal(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Nutrituonal status Library, Please contact developer, " +
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

  const _gradelvl = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_glname AS label from lib_gradelvl`,
          [],
          (_, { rows: { _array } }) => setGradelvl(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Grade level Library, Please contact developer, " +
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

  const _tscshvc = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_tscshvcname AS label from lib_tscshvc`,
          [],
          (_, { rows: { _array } }) => setTscshvc(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Track Strand and course completed Library, Please contact developer, " +
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

  const _income = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id AS id, lib_miname AS label from lib_monthlyincome`,
          [],
          (_, { rows: { _array } }) => setIncome(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Income Library, Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const reviewInput = (data, resetForm) => {
    settemData(data);
    setModalVisible(true);
    console.log(tempData);
  };

  const handleSubmit = (data, resetForm) => {
    setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO tbl_hhdemography (" +
            "tbl_household_id," +
            "tbl_fname," +
            "tbl_lname," +
            "tbl_mname," +
            "tbl_extension," +
            "lib_familybelongs_id," +
            "lib_gender_id," +
            "tbl_relationshiphead_id," +
            "tbl_datebirth," +
            "lib_maritalstatus_id," +
            "lib_ethnicity_id," +
            "lib_religion_id," +
            "tbl_withspecialneeds," +
            "lib_disability_id," +
            "lib_nutritioanalstatus_id," +
            "tbl_isofw," +
            "tbl_is3yrsinlocation," +
            "tbl_iscurattschool," +
            "lib_gradelvl_id," +
            "tbl_canreadwriteorhighschoolgrade," +
            "lib_hea_id," +
            "tbl_primary_occupation," +
            "lib_tscshvc_id," +
            "lib_monthlyincome_id," +
            "tbl_ismembersss," +
            "tbl_ismembergsis," +
            "tbl_ismemberphilhealth," +
            "tbl_adependentofaphilhealthmember" +
            ") values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            householdid,
            data.tbl_fname,
            data.tbl_lname,
            data.tbl_mname,
            data.tbl_extension,
            data.lib_familybelongs_id.id,
            data.lib_gender_id.id,
            data.tbl_relationshiphead_id.id,
            String(data.tbl_datebirth),
            data.lib_maritalstatus_id.id,
            data.lib_ethnicity_id,
            data.lib_religion_id,
            data.tbl_withspecialneeds ? 1 : 0,
            data.lib_disability_id.id,
            data.lib_nutritioanalstatus_id.id,
            data.tbl_isofw ? 1 : 0,
            data.tbl_is3yrsinlocation ? 1 : 0,
            data.tbl_iscurattschool ? 1 : 0,
            data.lib_gradelvl_id.id,
            data.tbl_canreadwriteorhighschoolgrade ? 1 : 0,
            data.lib_hea_id.id,
            data.tbl_primary_occupation,
            data.lib_tscshvc_id.id,
            data.lib_monthlyincome_id.id,
            data.tbl_ismembersss ? 1 : 0,
            data.tbl_ismembergsis ? 1 : 0,
            data.tbl_ismemberphilhealth ? 1 : 0,
            data.tbl_adependentofaphilhealthmember ? 1 : 0,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              if (data.tbl_relationshiphead_id.id == relationship.length) {
                db.transaction(
                  (tx) => {
                    tx.executeSql(
                      "UPDATE libl_relationshiphead SET lib_rhname = ? where id = ?",
                      [data.otherRelationship, relationship.length],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          db.transaction(
                            (tx) => {
                              tx.executeSql(
                                "INSERT INTO libl_relationshiphead (" +
                                  "id," +
                                  "lib_rhname," +
                                  "created_at," +
                                  "created_by," +
                                  "updated_at," +
                                  "updated_by" +
                                  ") values (?,?,?,?,?,?)",
                                [
                                  relationship.length + 1,
                                  "Other, Please specify",
                                  String(date),
                                  user.idtbl_enumerator,
                                  String(date),
                                  user.idtbl_enumerator,
                                ],
                                (tx, results) => {
                                  if (results.rowsAffected > 0) {
                                    _setRelationship();
                                    setOtherRelationship(false);
                                  } else {
                                    Alert.alert(
                                      "Error",
                                      "Adding new relationship item failed, Please update data or contact administrator"
                                    );
                                  }
                                }
                              );
                            },
                            (error) => {
                              Alert.alert("Error", error);
                            }
                          );
                        } else {
                          Alert.alert(
                            "Error",
                            "Update last item in relationship failed, Please update data or contact administrator"
                          );
                        }
                      }
                    );
                  },
                  (error) => {
                    Alert.alert("Error", error);
                  }
                );
              }
              if (data.lib_disability_id.id == disability.length) {
                db.transaction(
                  (tx) => {
                    tx.executeSql(
                      "UPDATE lib_disability SET lib_dname = ? where id = ?",
                      [data.otherDisabilityval, disability.length],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          db.transaction(
                            (tx) => {
                              tx.executeSql(
                                "INSERT INTO lib_disability (" +
                                  "id," +
                                  "lib_dname," +
                                  "created_at," +
                                  "created_by," +
                                  "updated_at," +
                                  "updated_by" +
                                  ") values (?,?,?,?,?,?)",
                                [
                                  disability.length + 1,
                                  "Other, Please specify",
                                  String(date),
                                  user.idtbl_enumerator,
                                  String(date),
                                  user.idtbl_enumerator,
                                ],
                                (tx, results) => {
                                  if (results.rowsAffected > 0) {
                                    _setDisabilities();
                                    setOtherDisability(false);
                                  } else {
                                    Alert.alert(
                                      "Error",
                                      "Adding new relationship item failed, Please update data or contact administrator"
                                    );
                                  }
                                }
                              );
                            },
                            (error) => {
                              console.log(
                                "Error in INSERT INTO lib_disability" +
                                  error.message
                              );
                            }
                          );
                        } else {
                          Alert.alert(
                            "Error",
                            "Update last item in relationship failed, Please update data or contact administrator"
                          );
                        }
                      }
                    );
                  },
                  (error) => {
                    Alert.alert("Error", error.message);
                  }
                );
              }

              Alert.alert(
                "Success",
                "Demography details successfully save, do you want to add more?",
                [
                  {
                    text: "No",
                    onPress: () => {
                      setLoading(false);
                      navigation.navigate("Livelihood", {
                        id: householdid,
                      });
                    },
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      resetForm({ data: "" });
                      _setNuclearfamily();
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
        setLoading(false);
        alert("Adding Demography Database Error: " + error.message);
      }
    );
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ScrollView style={styles.container}>
        <Form
          initialValues={{
            tbl_fname: "",
            tbl_lname: "",
            tbl_mname: "",
            tbl_extension: "",
            lib_familybelongs_id: 0,
            lib_gender_id: 0,
            tbl_relationshiphead_id: 0,
            otherRelationship: "",
            tbl_datebirth: 0,
            lib_maritalstatus_id: 0,
            lib_ethnicity_id: "",
            lib_religion_id: 0,
            tbl_withspecialneeds: false,
            lib_disability_id: 0,
            otherDisabilityval: "",
            lib_nutritioanalstatus_id: 0,
            tbl_isofw: 0,
            tbl_is3yrsinlocation: 0,
            tbl_iscurattschool: false,
            lib_gradelvl_id: "",
            tbl_canreadwriteorhighschoolgrade: 0,
            lib_hea_id: 0,
            tbl_primary_occupation: 0,
            lib_tscshvc_id: 0,
            lib_monthlyincome_id: 0,
            tbl_ismembersss: 0,
            tbl_ismembergsis: 0,
            tbl_ismemberphilhealth: 0,
            tbl_adependentofaphilhealthmember: 0,
          }}
          onSubmit={(values, { resetForm }) => {
            reviewInput(values, resetForm);
            //handleSubmit(values, resetForm);
          }}
          validationSchema={validationSchema}
        >
          <TouchableHighlight
            style={{
              ...styles.openButton,
              alignSelf: "flex-start",
              backgroundColor: "#ff5252",
              marginTop: 15,
              marginBottom: 15,
            }}
            onPress={() => {
              navigation.navigate("Livelihood", {
                id: householdid,
              });
            }}
          >
            <Text style={styles.textStyle}>Skip</Text>
          </TouchableHighlight>

          <FormField
            autoCorrect={false}
            icon="account-outline"
            name="tbl_fname"
            placeholder="Firstname *"
          />
          <FormField
            autoCorrect={false}
            icon="account-outline"
            name="tbl_lname"
            placeholder="Lastname *"
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
            placeholder="Name extension"
          />

          <Picker
            icon="account-group"
            items={nuclearfamily}
            name="lib_familybelongs_id"
            PickerItemComponent={PickerItem}
            placeholder="Nuclear family belongs to"
            setOther={setNuclearfamily}
          />

          <Picker
            icon="account-group-outline"
            items={relationship}
            name="tbl_relationshiphead_id"
            PickerItemComponent={PickerItem}
            placeholder="Relationship to the head"
            setOther={setOtherRelationship}
          />

          {otherRelationship && (
            <FormField
              autoCorrect={false}
              icon="account-child"
              name="otherRelationship"
              placeholder="Add other Relationship to head"
            />
          )}

          <Picker
            icon="gender-male-female"
            items={gender}
            name="lib_gender_id"
            PickerItemComponent={PickerItem}
            placeholder="Gender"
          />

          <FormDatePicker
            name="tbl_datebirth"
            icon="date"
            placeholder="Date of birth"
            width="50%"
            display="spinner"
            fullDate
            mode="date"
          />

          <Picker
            icon="alpha-m-box"
            items={maritalStatus}
            name="lib_maritalstatus_id"
            PickerItemComponent={PickerItem}
            placeholder="Marital status"
          />

          <FormField
            autoCorrect={false}
            icon="account-outline"
            name="lib_ethnicity_id"
            placeholder="Ethnicity/Tribe"
          />

          <FormField
            autoCorrect={false}
            icon="alpha-r-box"
            name="lib_religion_id"
            placeholder="Religion"
          />

          <SwitchInput
            icon="doctor"
            name="tbl_withspecialneeds"
            placeholder="Is person with special needs"
          />

          <Picker
            icon="alpha-d-box"
            items={disability}
            name="lib_disability_id"
            PickerItemComponent={PickerItem}
            placeholder="Type of Disability"
            setOther={setOtherDisability}
          />

          {otherDisability && (
            <FormField
              autoCorrect={false}
              icon="shield-account"
              name="otherDisabilityval"
              placeholder="Add other type of Disability"
            />
          )}

          <SwitchInput
            icon="bag-personal"
            name="tbl_isofw"
            placeholder="Is an OFW?"
          />

          <SwitchInput
            icon="home-floor-3"
            name="tbl_is3yrsinlocation"
            placeholder="Residence 3 years ago?"
          />

          <Picker
            icon="nutrition"
            items={nutrituonal}
            name="lib_nutritioanalstatus_id"
            PickerItemComponent={PickerItem}
            placeholder="Nutrituanal Status"
          />

          <SwitchInput
            icon="school"
            name="tbl_iscurattschool"
            placeholder="Is currently in school?"
          />

          <Picker
            icon="alpha-r-box"
            items={gradelvl}
            name="lib_gradelvl_id"
            PickerItemComponent={PickerItem}
            placeholder="Year/Grade currently attending"
          />

          <Picker
            icon="alpha-r-box"
            items={gradelvl}
            name="lib_hea_id"
            PickerItemComponent={PickerItem}
            placeholder="Highest educational attainment"
          />

          <Picker
            icon="account-tie"
            items={tscshvc}
            name="lib_tscshvc_id"
            PickerItemComponent={PickerItem}
            placeholder="Track/strand/course Completed"
          />

          <SwitchInput
            icon="read"
            name="tbl_canreadwriteorhighschoolgrade"
            placeholder="Can read and write (If not at least high school graduate)"
          />

          <FormField
            autoCorrect={false}
            icon="worker"
            name="tbl_primary_occupation"
            placeholder="Primary occupation"
          />

          <Picker
            icon="cash"
            items={income}
            name="lib_monthlyincome_id"
            PickerItemComponent={PickerItem}
            placeholder="Monthly income"
          />

          <SwitchInput
            icon="alpha-s-box"
            name="tbl_ismembersss"
            placeholder="Member of SSS"
          />

          <SwitchInput
            icon="alpha-g-box"
            name="tbl_ismembergsis"
            placeholder="Member of GSIS"
          />

          <SwitchInput
            icon="alpha-p-box"
            name="tbl_ismemberphilhealth"
            placeholder="Member of PHIL-health"
          />

          <SwitchInput
            icon="alpha-p-box"
            name="tbl_adependentofaphilhealthmember"
            placeholder="Dependent of Phil-health member"
          />

          <SubmitButton title="Save Demography" />
        </Form>
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <ScrollView>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Address</Text>
              </View>
              <View
                style={
                  (styles.moreInforData,
                  { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                }
              >
                <Text style={styles.moreInforDataTxt}>Test</Text>
              </View>
            </View>

            <TouchableHighlight
              style={{
                ...styles.openButton,
                backgroundColor: "#2196F3",
                marginTop: 15,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Close Information</Text>
            </TouchableHighlight>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  moreInfoTable: {
    flexDirection: "row",
    width: "100%",
  },
  moreInfolabel: {
    alignContent: "stretch",
    width: "40%",
    padding: 5,
  },
  moreInfolabeltxt: {
    fontWeight: "bold",
  },
  moreInfoData: {
    flex: 1,
    width: "60%",
    padding: 5,
    backgroundColor: "#F194FF",
  },
});

export default AddDemographyScreen;
