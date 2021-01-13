import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableHighlight,
  Modal,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
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
  tbl_lname: Yup.string().required().label("Last Name"),
  tbl_mname: Yup.string().required().label("Middle Name"),
  tbl_datebirth: Yup.string().required().label("Date of Birth"),
  lib_gender_id: Yup.object().required().label("Gender"),
  lib_maritalstatus_id: Yup.object().required().label("Marital Status"),
  lib_religion_id: Yup.string().required().label("Religion"),
  tbl_primary_occupation: Yup.string().required().label("Primary Occupation"),
  lib_monthlyincome_id: Yup.object().required().label("Monthly Income"),
  lib_hea_id: Yup.object().required().label("Highest educational attainment"),
  lib_disability_id: Yup.string().when("tbl_withspecialneeds", {
    is: true,
    then: Yup.string().required(
      'Type of Disability is required when person with special needs is "Yes"'
    ),
  }),
  lib_gradelvl_id: Yup.string().when("tbl_iscurattschool", {
    is: true,
    then: Yup.string().required(
      'Year/Grade currently attending is required when currently in school is "Yes"'
    ),
  }),
  tbl_relationshiphead_id: Yup.object().required().label("Relationship to head"),
  otherRelationship: Yup.string().when("tbl_relationshiphead_id.label", {
    is: "Other, Please specify",
    then: Yup.string().required().label("Add other relationship"),
  }),

  //lib_disability_id: Yup.object().nullable(),
  otherDisabilityval: Yup.string().when("lib_disability_id.label", {
    is: "Other, Please specify",
    then: Yup.string().required().label("Add other type of disability"),
  }),
});

const db = SQLite.openDatabase("hhprofiler23.db");
let resetFormHolder;

function AddDemographyScreen({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(route.params.id);
  const [demograpy, setDemograpy] = useState(
    route.params.update ? route.params.memberinfo : []
  );
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
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempData, settemData] = useState();
  const [hasHead, setHasHead] = useState(false);
  const [withspecialneeds, setWithspecialneeds] = useState(false);
  const [currentlyinschool, setCurrentlyinschool] = useState(false);

  useEffect(() => {
    route.params.update
      ? navigation.setOptions({ title: "Update Demograpy info" })
      : "";
    setDemograpy(route.params.update ? route.params.memberinfo : []);
    _setRelationship();
    _gender();
    _setMaritalStatus();
    _setDisabilities();
    _nutrituanal();
    _gradelvl();
    _tscshvc();
    _income();
    _setNuclearfamily();
    _sethasHead();
  }, []);

  const deleteDemograpy = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM tbl_hhdemography WHERE id = ?;",
        [route.params.memberinfo.id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            navigation.navigate("Done", { screen: "AnimatedMap" });
          }
        },
        (error) => {
          console.log(error);
          Alert.alert(
            "SQLITE ERROR",
            "Database error deleting demography information, Please contact developer, " +
              error,
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

  const _sethasHead = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT tbl_household_id || "_" ||tbl_fname || "_" || tbl_lname as newfilename FROM tbl_hhdemography WHERE tbl_household_id=? AND tbl_ishead=?`,
          [householdid, 1],
          (_, { rows: { _array } }) =>
            _array.length > 0 ? setHasHead(true) : setHasHead(false)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Type of Livelihood Library, Please contact developer, " +
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
          (_, { rows: { _array } }) => {
            _array.unshift({ id: 0, label: "Clear selection" });
            setRelationship(_array);
          }
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
          (_, { rows: { _array } }) => {
            _array.unshift({ id: 0, label: "Clear selection" });
            setDisability(_array);
          }
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
          (_, { rows: { _array } }) => {
            _array.unshift({ id: 0, label: "Clear selection" });
            setNutrituonal(_array);
          }
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
          (_, { rows: { _array } }) => {
            _array.unshift({ id: 0, label: "Clear selection" });
            setGradelvl(_array);
          }
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
          (_, { rows: { _array } }) => {
            _array.unshift({ id: 0, label: "Clear selection" });
            setTscshvc(_array);
          }
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
          (_, { rows: { _array } }) => {
            _array.unshift({ id: 0, label: "No Income" });
            setIncome(_array);
          }
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

  const reviewInput = (data) => {
    settemData(data);
    setModalVisible(true);
  };

  const handleSubmitNew = (data) => {
    let _date = "";
    if (data.tbl_datebirth) {
      _date = new Date(data.tbl_datebirth);
    }
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
            "tbl_ishead," +
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
            ") values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            householdid,
            data.tbl_fname,
            data.tbl_lname,
            data.tbl_mname,
            data.tbl_extension,
            data.tbl_ishead ? 1 : 0,
            data.lib_familybelongs_id.id,
            data.lib_gender_id.id,
            data.tbl_relationshiphead_id.id,
            String(_date),
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
                      resetFormHolder();
                      if (route.params.addmore) {
                        navigation.navigate("Done", { screen: "AnimatedMap" });
                      } else {
                        navigation.navigate("Livelihood", {
                          id: householdid,
                          new: true,
                          addmore: false,
                          update: false,
                        });
                      }
                    },
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      resetFormHolder();
                      _setNuclearfamily();
                      _sethasHead();
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

  const handleSubmitUpdate = (data) => {
    let _date = "";
    if (data.tbl_datebirth) {
      _date = new Date(data.tbl_datebirth);
    }
    setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE tbl_hhdemography SET " +
            "tbl_fname = ?," +
            "tbl_lname =?," +
            "tbl_mname =?," +
            "tbl_extension =?," +
            "tbl_ishead =?," +
            "lib_familybelongs_id =?," +
            "lib_gender_id =?," +
            "tbl_relationshiphead_id =?," +
            "tbl_datebirth =?," +
            "lib_maritalstatus_id =?," +
            "lib_ethnicity_id =?," +
            "lib_religion_id =?," +
            "tbl_withspecialneeds =?," +
            "lib_disability_id =?," +
            "lib_nutritioanalstatus_id =?," +
            "tbl_isofw =?," +
            "tbl_is3yrsinlocation =?," +
            "tbl_iscurattschool =?," +
            "lib_gradelvl_id =?," +
            "tbl_canreadwriteorhighschoolgrade =?," +
            "lib_hea_id =?," +
            "tbl_primary_occupation =?," +
            "lib_tscshvc_id =?," +
            "lib_monthlyincome_id =?," +
            "tbl_ismembersss =?," +
            "tbl_ismembergsis =?," +
            "tbl_ismemberphilhealth =?," +
            "tbl_adependentofaphilhealthmember =?," +
            "updated_at = ?," +
            "updated_by= ?  WHERE id = ?",
          [
            data.tbl_fname,
            data.tbl_lname,
            data.tbl_mname,
            data.tbl_extension,
            data.tbl_ishead ? 1 : 0,
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
            String(date),
            user.idtbl_enumerator,
            route.params.memberinfo.id,
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

              setLoading(false);
              resetFormHolder();
              navigation.navigate("Done", { screen: "AnimatedMap" });
            } else {
              setLoading(false);
              alert("Update Demography information Failed");
            }
          }
        );
      },
      (error) => {
        setLoading(false);
        alert("Update Demography Database Error: " + error.message);
      }
    );
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ScrollView style={styles.container}>
        <Form
          initialValues={{
            tbl_fname: route.params.update ? demograpy.tbl_fname : "",
            tbl_lname: route.params.update ? demograpy.tbl_lname : "",
            tbl_mname: route.params.update ? demograpy.tbl_mname : "",
            tbl_extension: route.params.update ? demograpy.tbl_extension : "",
            tbl_ishead: route.params.update
              ? demograpy.tbl_ishead == 1
                ? true
                : false
              : false,
            lib_familybelongs_id: route.params.update
              ? demograpy.lib_familybelongs_id
                ? { id: demograpy.lib_familybelongs_id, label: demograpy.id }
                : 0
              : 0,
            tbl_relationshiphead_id: route.params.update
              ? demograpy.tbl_relationshiphead_id
                ? {
                    id: demograpy.tbl_relationshiphead_id,
                    label: demograpy.lib_rhname,
                  }
                : ""
              : "",
            lib_gender_id: route.params.update
              ? demograpy.lib_gender_id
                ? { id: demograpy.lib_gender_id, label: demograpy.lib_gname }
                : ""
              : "",
            otherRelationship: "",
            tbl_datebirth: route.params.update
              ? new Date(demograpy.tbl_datebirth)
              : "",
            lib_maritalstatus_id: route.params.update
              ? demograpy.lib_maritalstatus_id
                ? {
                    id: demograpy.lib_maritalstatus_id,
                    label: demograpy.lib_msname,
                  }
                : ""
              : "",
            lib_ethnicity_id: route.params.update
              ? demograpy.lib_ethnicity_id
              : "",
            lib_religion_id: route.params.update
              ? demograpy.lib_religion_id
              : "",
            tbl_withspecialneeds: route.params.update
              ? demograpy.tbl_withspecialneeds == 1
                ? 1
                : 0
              : 0,
            lib_disability_id: route.params.update
              ? demograpy.lib_disability_id
                ? {
                    id: demograpy.lib_disability_id,
                    label: demograpy.lib_dname,
                  }
                : ""
              : "",
            otherDisabilityval: "",
            tbl_isofw: route.params.update
              ? demograpy.tbl_isofw == 1
                ? true
                : false
              : false,
            tbl_is3yrsinlocation: route.params.update
              ? demograpy.tbl_is3yrsinlocation == 1
                ? true
                : false
              : false,
            lib_nutritioanalstatus_id: route.params.update
              ? demograpy.lib_nutritioanalstatus_id
                ? {
                    id: demograpy.lib_nutritioanalstatus_id,
                    label: demograpy.lib_nsname,
                  }
                : 0
              : 0,
            tbl_iscurattschool: route.params.update
              ? demograpy.tbl_iscurattschool == 1
                ? true
                : false
              : false,
            lib_gradelvl_id: route.params.update
              ? demograpy.lib_gradelvl_id
                ? {
                    id: demograpy.lib_gradelvl_id,
                    label: demograpy.lvllib_glname,
                  }
                : ""
              : "",
            lib_hea_id: route.params.update
              ? demograpy.lib_hea_id
                ? {
                    id: demograpy.lib_hea_id,
                    label: demograpy.healib_glname,
                  }
                : ""
              : "",
            lib_tscshvc_id: route.params.update
              ? demograpy.lib_tscshvc_id
                ? {
                    id: demograpy.lib_tscshvc_id,
                    label: demograpy.lib_tscshvcname,
                  }
                : 0
              : 0,
            tbl_canreadwriteorhighschoolgrade: route.params.update
              ? demograpy.tbl_canreadwriteorhighschoolgrade == 1
                ? true
                : false
              : false,
            tbl_primary_occupation: route.params.update
              ? demograpy.tbl_primary_occupation
              : "",
            lib_monthlyincome_id: route.params.update
              ? demograpy.lib_monthlyincome_id
                ? {
                    id: demograpy.lib_monthlyincome_id,
                    label: demograpy.lib_miname,
                  }
                : ""
              : "",
            tbl_ismembersss: route.params.update
              ? demograpy.tbl_ismembersss == 1
                ? true
                : false
              : false,
            tbl_ismembergsis: route.params.update
              ? demograpy.tbl_ismembergsis == 1
                ? true
                : false
              : false,
            tbl_ismemberphilhealth: route.params.update
              ? demograpy.tbl_ismemberphilhealth == 1
                ? true
                : false
              : false,
            tbl_adependentofaphilhealthmember: route.params.update
              ? demograpy.tbl_adependentofaphilhealthmember == 1
                ? true
                : false
              : false,
          }}
          onSubmit={(values, { resetForm }) => {
            resetFormHolder = resetForm;
            reviewInput(values);
          }}
          validationSchema={validationSchema}
        >
          {route.params.new && (
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
                  new: true,
                  addmore: false,
                  update: false,
                });
              }}
            >
              <Text style={styles.textStyle}>Skip</Text>
            </TouchableHighlight>
          )}

          {route.params.update && (
            <TouchableWithoutFeedback
              onPress={() => {
                Alert.alert(
                  "Warning",
                  "Are you sure you want to delete this member of demography? action cannot be undone!!!",
                  [
                    {
                      text: "No",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        deleteDemograpy();
                      },
                    },
                  ]
                );
              }}
            >
              <View
                style={{
                  backgroundColor: colors.danger,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="trash-can"
                  size={35}
                  color={colors.white}
                />
              </View>
            </TouchableWithoutFeedback>
          )}

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

          {route.params.update ||
            (!hasHead && (
              <SwitchInput
                icon="account"
                name="tbl_ishead"
                placeholder="Is person head of the family?"
              />
            ))}

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
            placeholder="Gender *"
          />

          <FormDatePicker
            name="tbl_datebirth"
            icon="date"
            placeholder="Date of birth *"
            width="60%"
            display="spinner"
            fullDate
            mode="date"
          />

          <Picker
            icon="alpha-m-box"
            items={maritalStatus}
            name="lib_maritalstatus_id"
            PickerItemComponent={PickerItem}
            placeholder="Marital status *"
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
            setAvail={setWithspecialneeds}
            initavail={withspecialneeds}
          />

          {withspecialneeds && (<Picker
            icon="alpha-d-box"
            items={disability}
            name="lib_disability_id"
            PickerItemComponent={PickerItem}
            placeholder="Type of Disability"
            setOther={setOtherDisability}
          />)}

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
            setAvail={setCurrentlyinschool}
            initavail={currentlyinschool}
          />

          {currentlyinschool && (<Picker
            icon="alpha-r-box"
            items={gradelvl}
            name="lib_gradelvl_id"
            PickerItemComponent={PickerItem}
            placeholder="Year/Grade currently attending"
          />)}

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
            placeholder="Primary occupation *"
          />

          <Picker
            icon="cash"
            items={income}
            name="lib_monthlyincome_id"
            PickerItemComponent={PickerItem}
            placeholder="Monthly income *"
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

          {route.params.update ? (
            <SubmitButton title="Update Demography" />
          ) : (
            <SubmitButton title="Save Demography" />
          )}
        </Form>
      </ScrollView>

      {tempData && (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text
                style={{ fontWeight: "bold", marginBottom: 30, color: "red" }}
              >
                Review Add Demography Input
              </Text>
              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>First Name *</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_fname}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Last Name *</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_lname}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Middle Name</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_mname}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Name Extension</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_extension}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Is person head of family
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_ishead ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Nuclear family belongs to
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_familybelongs_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Relationship to head
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_relationshiphead_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Gender</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_gender_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Birthday</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {String(tempData.tbl_datebirth)}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Marital status</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_maritalstatus_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Ethnicity/Tribe</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_ethnicity_id}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Religion</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_religion_id}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Is person with special needs
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_withspecialneeds ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Type of Disability
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_disability_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Is an OFW?</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_isofw ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Residence 3 years ago?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_is3yrsinlocation ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Is currently in school?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_iscurattschool ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Year/Grade currently attending
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_gradelvl_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Highest educational attainment
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_hea_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Track/strand/course completed?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_tscshvc_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    can read and write(if not atleast high school graduate)
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_canreadwriteorhighschoolgrade}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Primary occupation?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_primary_occupation}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Montly Income</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.lib_monthlyincome_id.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Member of SSS</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_ismembersss ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Member of GSIS?</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_ismembergsis ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Member of Phil-health?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_ismemberphilhealth ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Dependend of Phil-health member?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_adependentofaphilhealthmember ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignContent: "space-between",
                }}
              >
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: "#2196F3",
                    marginTop: 15,
                    flex: 1,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Cancel/Update</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: "#2196F3",
                    marginTop: 15,
                    flex: 1,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    if (route.params.update) handleSubmitUpdate(tempData);
                    else handleSubmitNew(tempData);
                  }}
                >
                  {route.params.update ? (
                    <Text style={styles.textStyle}>Update Information</Text>
                  ) : (
                    <Text style={styles.textStyle}>Add Information</Text>
                  )}
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
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
