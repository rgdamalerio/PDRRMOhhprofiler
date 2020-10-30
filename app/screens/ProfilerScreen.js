import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  View,
  Text,
  TouchableHighlight,
} from "react-native";
import * as Random from "expo-random";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";
import Constants from "expo-constants";

import PickerItem from "../components/PickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  AddressPicker,
  FormLocationPicker,
  SubmitButton,
} from "../components/forms";
import SwitchInput from "../components/SwitchInput";
import ActivityIndicator from "../components/ActivityIndicator";
import useAuth from "../auth/useAuth";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  respondentname: Yup.string().required().label("Respondent Name"),
  mun: Yup.string().required().label("Municipality"),
  brgy: Yup.string().required().label("Barangay"),
  coordinates: Yup.string().required().nullable().label("Coordinates"),
  typebuilding: Yup.string().required().label("Type of building"),
  yearconstract: Yup.string().required().label("Year constract"),
  cost: Yup.number().required().label("Estimated Cost"),
  beadroom: Yup.number().label("Number of bedrooms"),
  storeys: Yup.number().required().label("Number of Storey"),
  wallmaterial: Yup.string().required().label("Wall material"),
  evacuationarea: Yup.object().nullable(),
  roofmaterial: Yup.object().required("Roof Material is a required field"),
  otherevacuation: Yup.string().when("evacuationarea.label", {
    is: "Other, Please specify",
    then: Yup.string().required().label("Add other evacuation"),
  }),
  tbl_hhfloodsoccurinarea: Yup.boolean(),
  tbl_hhfloodsoccurinareayear: Yup.string().when("tbl_hhfloodsoccurinarea", {
    is: true,
    then: Yup.string().required(
      "Year flood occur is required when Flood occur in your area is true"
    ),
  }),
  tbl_hhexperienceevacuationoncalamity: Yup.boolean(),
  tbl_hhexperienceevacuationoncalamityyear: Yup.string().when(
    "tbl_hhexperienceevacuationoncalamity",
    {
      is: true,
      then: Yup.string().required(
        "Year experience evacuation during calamity is required when Flood occur in your area is true"
      ),
    }
  ),
  tbl_availmedicaltreatment: Yup.boolean(),
  tbl_treatmentspecification: Yup.string().when("tbl_availmedicaltreatment", {
    is: true,
    then: Yup.string().required(
      "Treatment specification is required when availed medical treatment is selected as true"
    ),
  }),
});

const db = SQLite.openDatabase("hhprofiler23.db");
let resetFormHolder;

function ProfilerScreen({ navigation, route }) {
  const [householdid, sethouseholdid] = useState(
    route.params.id ? route.params.id : ""
  );
  const [hhinfo, setHhinfo] = useState(
    route.params.update ? route.params.hhinfo : []
  );
  const [loading, setLoading] = useState(false);
  const [mun, setMun] = useState();
  const [brgy, setBrgy] = useState();
  const [typebuilding, setTypebuilding] = useState();
  const [tenuralStatus, settenuralStatus] = useState();
  const [roofmaterials, setRoofmaterials] = useState();
  const [wallmaterials, setWallmaterials] = useState();
  const [watertenuralstatus, setWatertenuralstatus] = useState();
  const [lvlwatersystem, setLvlwatersystems] = useState();
  const [evacuationarea, setEvacuationarea] = useState();
  const [otherEvacuation, setOtherEvacuation] = useState(false);
  const [availtreatment, setAvailtreatment] = useState(false);
  const [floodsoccured, setFloodsoccured] = useState(false);
  const [expevacuation, setExpevacuation] = useState(false);
  const [randomBtyes, setRandomBtyes] = useState();
  const [date, setDate] = useState();
  const [uuid, setUuid] = useState(
    Constants.installationId + "-" + new Date().getTime()
  );
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempData, settemData] = useState();

  useEffect(() => {
    route.params.update
      ? navigation.setOptions({ title: "Update Household info" })
      : "";
    setHhinfo(route.params.update ? route.params.hhinfo : []);
    getMunicipality();
    gettypeBuilding();
    gettenuralStatus();
    getroofMaterials();
    getwallMaterials();
    getWaterTenuralStatus();
    getLvlWaterSystem();
    getEvacuationareas();
    getRandomBytes();
    getDate();
    if (route.params.update) {
      setAvailtreatment(
        route.params.hhinfo[0].tbl_availmedicaltreatment == 1 ? true : false
      );
      setFloodsoccured(
        route.params.hhinfo[0].tbl_hhfloodsoccurinarea == 1 ? true : false
      );
      setExpevacuation(
        route.params.hhinfo[0].tbl_hhexperienceevacuationoncalamity == 1
          ? true
          : false
      );
    }
  }, []);

  const getMunicipality = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select idtbl_psgc_mun AS id, tbl_psgc_munname AS label from tbl_psgc_mun where tbl_psgc_prov_id_fk=?`,
          ["PH160200000"],
          (_, { rows: { _array } }) => setMun(_array)
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

  const handleMunChange = (brgyvalue) => {
    setBrgy(brgyvalue);
  };

  const gettypeBuilding = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id, lib_buildingtypedesc AS label from lib_hhtypeofbuilding`,
          [],
          (_, { rows: { _array } }) => setTypebuilding(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Type of Building Library, Please contact developer, " +
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

  const gettenuralStatus = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id, lib_tenuralstatusdesc AS label from lib_hhtenuralstatus`,
          [],
          (_, { rows: { _array } }) => settenuralStatus(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Tenural status Library, Please contact developer, " +
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

  const getroofMaterials = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id, lib_roofmaterialsdesc AS label from lib_hhroofmaterials`,
          [],
          (_, { rows: { _array } }) => setRoofmaterials(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Roof materials Library, Please contact developer, " +
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

  const getwallMaterials = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id, lib_wallmaterialsdesc AS label from lib_hhwallconmaterials`,
          [],
          (_, { rows: { _array } }) => setWallmaterials(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Roof materials Library, Please contact developer, " +
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

  const getWaterTenuralStatus = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id, lib_wtdesc AS label from lib_hhwatertenuralstatus`,
          [],
          (_, { rows: { _array } }) => setWatertenuralstatus(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Water tenural library, Please contact developer, " +
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

  const getLvlWaterSystem = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'select id, lib_hhwatersystemlvl || " : " || lib_hhlvldesc AS label from lib_hhlvlwatersystem',
          [],
          (_, { rows: { _array } }) => setLvlwatersystems(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Level water system library, Please contact developer, " +
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

  const getEvacuationareas = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select id, lib_heaname AS label from lib_hhevacuationarea`,
          [],
          (_, { rows: { _array } }) => setEvacuationarea(_array)
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Evacuation area library, Please contact developer, " +
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

  const getRandomBytes = async () => {
    const randomBytes = await Random.getRandomBytesAsync(16);
    setRandomBtyes(randomBytes);
  };

  const getDate = () => {
    const d = new Date();
    setDate(d);
  };

  const reviewInput = (data) => {
    settemData(data);
    setModalVisible(true);
  };

  const handleSubmitNew = (data) => {
    setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO tbl_household (" +
            "tbl_hhcontrolnumber," +
            "tbl_hhdateinterview," +
            "tbl_hhlatitude," +
            "tbl_hhlongitude," +
            "tbl_hhyearconstruct," +
            "tbl_hhecost," +
            "tbl_hhnobedroms," +
            "tbl_hhnostorey," +
            "tbl_hhaelectricity," +
            "tbl_hhainternet," +
            "tbl_enumerator_id_fk," +
            "tbl_psgc_brgy_id," +
            "tbl_psgc_mun_id," +
            "tbl_psgc_pro_id," +
            "lib_typeofbuilding_id," +
            "tbl_tenuralstatus_id," +
            "tbl_typeofconmaterials_id," +
            "tbl_wallconmaterials_id," +
            "tbl_availmedicaltreatment," +
            "tbl_treatmentspecification," +
            "tbl_hhaccesswater," +
            "tbl_hhwaterpotable," +
            "tbl_watertenuralstatus_id," +
            "tbl_hhlvlwatersystem_id," +
            "tbl_hhfloodsoccurinarea," +
            "tbl_hhfloodsoccurinareayear," +
            "tbl_hhexperienceevacuationoncalamity," +
            "tbl_hhexperienceevacuationoncalamityyear," +
            "tbl_evacuation_areas_id," +
            "tbl_hhhasaccesshealtmedicalfacility," +
            "tbl_hhhasaccesstelecom," +
            "tbl_hasaccessdrillsandsimulations," +
            "tbl_householdpuroksittio," +
            "tbl_respondent," +
            "created_at," +
            "updated_at," +
            "created_by," +
            "updatedy_by " +
            ") values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            uuid,
            String(
              date.getFullYear() +
                "-" +
                (date.getMonth() + 1) +
                "-" +
                date.getDate()
            ),
            data.coordinates != null ? data.coordinates.latitude : "",
            data.coordinates != null ? data.coordinates.longitude : "",
            data.yearconstract,
            data.cost,
            data.beadroom,
            data.storeys,
            data.aelectricity ? 1 : 0,
            data.internet ? 1 : 0,
            user.idtbl_enumerator,
            data.brgy.id,
            data.mun.id,
            "PH160200000",
            data.typebuilding.id ? data.typebuilding.id : 0,
            data.tenuralstatus.id ? data.tenuralstatus.id : 0,
            data.roofmaterial.id ? data.roofmaterial.id : 0,
            data.wallmaterial.id ? data.wallmaterial.id : 0,
            data.tbl_availmedicaltreatment ? 1 : 0,
            data.tbl_treatmentspecification,
            data.awater ? 1 : 0,
            data.wpotable ? 1 : 0,
            data.wtenuralstatus.id ? data.wtenuralstatus.id : 0,
            data.wlvlsystem.id ? data.wlvlsystem.id : 0,
            data.tbl_hhfloodsoccurinarea ? 1 : 0,
            data.tbl_hhfloodsoccurinareayear,
            data.tbl_hhexperienceevacuationoncalamity ? 1 : 0,
            data.tbl_hhexperienceevacuationoncalamityyear,
            data.evacuationarea.id ? data.evacuationarea.id : 0,
            data.accessmedfacility ? 1 : 0,
            data.accesstelecommunication ? 1 : 0,
            data.accessdrillsimulation ? 1 : 0,
            data.purok,
            data.respondentname,
            String(date),
            String(date),
            user.idtbl_enumerator,
            user.idtbl_enumerator,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              const insertId = results.insertId; //set newly inserted id

              if (data.evacuationarea.id == evacuationarea.length) {
                db.transaction(
                  (tx) => {
                    tx.executeSql(
                      "UPDATE lib_hhevacuationarea SET lib_heaname = ? where id = ?",
                      [data.otherevacuation, evacuationarea.length],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          db.transaction(
                            (tx) => {
                              tx.executeSql(
                                "INSERT INTO lib_hhevacuationarea (" +
                                  "id," +
                                  "lib_heaname," +
                                  "created_at," +
                                  "created_by," +
                                  "updated_at," +
                                  "updated_by" +
                                  ") values (?,?,?,?,?,?)",
                                [
                                  evacuationarea.length + 1,
                                  "Other, Please specify",
                                  String(date),
                                  user.idtbl_enumerator,
                                  String(date),
                                  user.idtbl_enumerator,
                                ],
                                (tx, results) => {
                                  if (results.rowsAffected > 0) {
                                    getEvacuationareas();
                                    setOtherEvacuation(false);
                                    setAvailtreatment(false);
                                    setFloodsoccured(false);
                                    setExpevacuation(false);
                                  } else {
                                    Alert.alert(
                                      "Error",
                                      "Adding new evacuation area item failed, Please update data or contact administrator"
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
                            "Update last item in evacuation area failed, Please update data or contact administrator"
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
              setLoading(false);
              resetFormHolder();
              navigation.navigate("Program", {
                id: insertId,
                new: true,
                addmore: false,
                update: false,
              });
            } else {
              setLoading(false);
              alert("Adding household information Failed");
            }
          }
        );
      },
      (error) => {
        setLoading(false);
        alert("Database Error: " + error.message);
      }
    );
  };

  const handleSubmitUpdate = (data) => {
    setLoading(true);
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE tbl_household SET " +
            "tbl_hhlatitude = ?," +
            "tbl_hhlongitude = ?," +
            "tbl_hhyearconstruct = ?," +
            "tbl_hhecost = ?," +
            "tbl_hhnobedroms = ?," +
            "tbl_hhnostorey = ?," +
            "tbl_hhaelectricity = ?," +
            "tbl_hhainternet = ? ," +
            "tbl_enumerator_id_fk =? ," +
            "tbl_psgc_brgy_id =? ," +
            "tbl_psgc_mun_id = ?," +
            "tbl_psgc_pro_id =? ," +
            "lib_typeofbuilding_id =? ," +
            "tbl_tenuralstatus_id =? ," +
            "tbl_typeofconmaterials_id =? ," +
            "tbl_wallconmaterials_id =? ," +
            "tbl_availmedicaltreatment = ?," +
            "tbl_treatmentspecification = ?," +
            "tbl_hhaccesswater =? ," +
            "tbl_hhwaterpotable =? ," +
            "tbl_watertenuralstatus_id =? ," +
            "tbl_hhlvlwatersystem_id =?," +
            "tbl_hhfloodsoccurinarea =? ," +
            "tbl_hhfloodsoccurinareayear =? ," +
            "tbl_hhexperienceevacuationoncalamity =? ," +
            "tbl_hhexperienceevacuationoncalamityyear =?," +
            "tbl_evacuation_areas_id =?," +
            "tbl_hhhasaccesshealtmedicalfacility =? ," +
            "tbl_hhhasaccesstelecom =? ," +
            "tbl_hasaccessdrillsandsimulations =? ," +
            "tbl_householdpuroksittio =? ," +
            "tbl_respondent = ? ," +
            "updated_at = ?," +
            "updatedy_by= ?  WHERE tbl_household_id = ? ",
          [
            data.coordinates != null ? data.coordinates.latitude : "",
            data.coordinates != null ? data.coordinates.longitude : "",
            data.yearconstract,
            data.cost,
            data.beadroom,
            data.storeys,
            data.aelectricity ? 1 : 0,
            data.internet ? 1 : 0,
            user.idtbl_enumerator,
            data.brgy.id,
            data.mun.id,
            "PH160200000",
            data.typebuilding.id ? data.typebuilding.id : 0,
            data.tenuralstatus.id ? data.tenuralstatus.id : 0,
            data.roofmaterial.id ? data.roofmaterial.id : 0,
            data.wallmaterial.id ? data.wallmaterial.id : 0,
            data.tbl_availmedicaltreatment ? 1 : 0,
            data.tbl_treatmentspecification,
            data.awater ? 1 : 0,
            data.wpotable ? 1 : 0,
            data.wtenuralstatus.id ? data.wtenuralstatus.id : 0,
            data.wlvlsystem.id ? data.wlvlsystem.id : 0,
            data.tbl_hhfloodsoccurinarea ? 1 : 0,
            data.tbl_hhfloodsoccurinareayear,
            data.tbl_hhexperienceevacuationoncalamity ? 1 : 0,
            data.tbl_hhexperienceevacuationoncalamityyear,
            data.evacuationarea.id ? data.evacuationarea.id : 0,
            data.accessmedfacility ? 1 : 0,
            data.accesstelecommunication ? 1 : 0,
            data.accessdrillsimulation ? 1 : 0,
            data.purok,
            data.respondentname,
            String(date),
            user.idtbl_enumerator,
            route.params.id,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              const insertId = results.insertId; //set newly inserted id

              if (data.evacuationarea.id == evacuationarea.length) {
                db.transaction(
                  (tx) => {
                    tx.executeSql(
                      "UPDATE lib_hhevacuationarea SET lib_heaname = ? where id = ?",
                      [data.otherevacuation, evacuationarea.length],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          db.transaction(
                            (tx) => {
                              tx.executeSql(
                                "INSERT INTO lib_hhevacuationarea (" +
                                  "id," +
                                  "lib_heaname," +
                                  "created_at," +
                                  "created_by," +
                                  "updated_at," +
                                  "updated_by" +
                                  ") values (?,?,?,?,?,?)",
                                [
                                  evacuationarea.length + 1,
                                  "Other, Please specify",
                                  String(date),
                                  user.idtbl_enumerator,
                                  String(date),
                                  user.idtbl_enumerator,
                                ],
                                (tx, results) => {
                                  if (results.rowsAffected > 0) {
                                    getEvacuationareas();
                                    setOtherEvacuation(false);
                                    setAvailtreatment(false);
                                    setFloodsoccured(false);
                                    setExpevacuation(false);
                                  } else {
                                    Alert.alert(
                                      "Error",
                                      "Adding new evacuation area item failed, Please update data or contact administrator"
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
                            "Update last item in evacuation area failed, Please update data or contact administrator"
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
              setLoading(false);
              resetFormHolder();
              navigation.navigate("Done", { screen: "AnimatedMap" });
            } else {
              setLoading(false);
              alert("Adding household information Failed");
            }
          }
        );
      },
      (error) => {
        setLoading(false);
        alert("Database Error: " + error.message);
        console.log(error);
      }
    );
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ScrollView style={styles.container}>
        <Form
          initialValues={{
            respondentname: route.params.update ? hhinfo[0].tbl_respondent : "",
            mun: route.params.update
              ? hhinfo[0].tbl_psgc_mun_id
                ? {
                    id: hhinfo[0].tbl_psgc_mun_id,
                    label: hhinfo[0].tbl_psgc_munname,
                  }
                : ""
              : "",
            brgy: route.params.update
              ? hhinfo[0].tbl_psgc_brgy_id
                ? {
                    id: hhinfo[0].tbl_psgc_brgy_id,
                    label: hhinfo[0].tbl_psgc_brgyname,
                  }
                : ""
              : "",
            purok: route.params.update
              ? hhinfo[0].tbl_householdpuroksittio
              : "",
            coordinates: route.params.update
              ? hhinfo[0].tbl_hhlatitude
                ? {
                    latitude: hhinfo[0].tbl_hhlatitude,
                    longitude: hhinfo[0].tbl_hhlongitude,
                  }
                : null
              : null,
            typebuilding: route.params.update
              ? hhinfo[0].lib_typeofbuilding_id
                ? {
                    id: hhinfo[0].lib_typeofbuilding_id,
                    label: hhinfo[0].lib_buildingtypedesc,
                  }
                : ""
              : "",
            tenuralstatus: route.params.update
              ? hhinfo[0].tbl_tenuralstatus_id
                ? {
                    id: hhinfo[0].tbl_tenuralstatus_id,
                    label: hhinfo[0].lib_tenuralstatusdesc,
                  }
                : ""
              : "",
            yearconstract: route.params.update
              ? hhinfo[0].tbl_hhyearconstruct
              : 0,
            cost: route.params.update ? String(hhinfo[0].tbl_hhecost) : 0,
            beadroom: route.params.update
              ? String(hhinfo[0].tbl_hhnobedroms)
              : 0,
            storeys: route.params.update ? String(hhinfo[0].tbl_hhnostorey) : 0,
            aelectricity: route.params.update
              ? hhinfo[0].tbl_hhaelectricity == 1
                ? true
                : false
              : false,
            internet: route.params.update
              ? hhinfo[0].tbl_hhainternet == 1
                ? true
                : false
              : false,
            roofmaterial: route.params.update
              ? hhinfo[0].tbl_wallconmaterials_id
                ? {
                    id: hhinfo[0].tbl_wallconmaterials_id,
                    label: hhinfo[0].lib_roofmaterialsdesc,
                  }
                : ""
              : 0,
            tbl_availmedicaltreatment: route.params.update
              ? hhinfo[0].tbl_availmedicaltreatment == 1
                ? true
                : false
              : false,
            tbl_treatmentspecification: route.params.update
              ? hhinfo[0].tbl_treatmentspecification
              : "",
            wallmaterial: route.params.update
              ? hhinfo[0].tbl_typeofconmaterials_id
                ? {
                    id: hhinfo[0].tbl_typeofconmaterials_id,
                    label: hhinfo[0].lib_wallmaterialsdesc,
                  }
                : ""
              : 0,

            awater: route.params.update
              ? hhinfo[0].tbl_hhaccesswater == 1
                ? true
                : false
              : false,
            wpotable: route.params.update
              ? hhinfo[0].tbl_hhwaterpotable == 1
                ? true
                : false
              : false,
            wtenuralstatus: route.params.update
              ? hhinfo[0].tbl_watertenuralstatus_id
                ? {
                    id: hhinfo[0].tbl_watertenuralstatus_id,
                    label: hhinfo[0].lib_wtdesc,
                  }
                : ""
              : "",
            wlvlsystem: route.params.update
              ? hhinfo[0].tbl_hhlvlwatersystem_id
                ? {
                    id: hhinfo[0].tbl_hhlvlwatersystem_id,
                    label: hhinfo[0].lib_hhlvldesc,
                  }
                : ""
              : "",
            tbl_hhfloodsoccurinarea: route.params.update
              ? hhinfo[0].tbl_hhfloodsoccurinarea == 1
                ? true
                : false
              : false,
            tbl_hhfloodsoccurinareayear: route.params.update
              ? hhinfo[0].tbl_hhfloodsoccurinareayear
              : "",
            tbl_hhexperienceevacuationoncalamity: route.params.update
              ? hhinfo[0].tbl_hhexperienceevacuationoncalamity == 1
                ? true
                : false
              : false,
            tbl_hhexperienceevacuationoncalamityyear: route.params.update
              ? hhinfo[0].tbl_hhexperienceevacuationoncalamityyear
              : "",
            evacuationarea: route.params.update
              ? hhinfo[0].tbl_evacuation_areas_id
                ? {
                    id: hhinfo[0].tbl_evacuation_areas_id,
                    label: hhinfo[0].lib_heaname,
                  }
                : ""
              : "",
            otherevacuation: "",
            accessmedfacility: route.params.update
              ? hhinfo[0].tbl_hhhasaccesshealtmedicalfacility == 1
                ? true
                : false
              : false,
            accesstelecommunication: route.params.update
              ? hhinfo[0].tbl_hhhasaccesstelecom == 1
                ? true
                : false
              : false,
            accessdrillsimulation: route.params.update
              ? hhinfo[0].tbl_hasaccessdrillsandsimulations == 1
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
          <FormField
            autoCorrect={false}
            icon="account"
            name="respondentname"
            placeholder="Respondent Name *"
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
            autoCorrect={false}
            icon="earth"
            name="purok"
            placeholder="Purok/Sitio"
            width="70%"
          />

          <FormLocationPicker
            name="coordinates"
            icon="add-location"
            placeholder="coordinates *"
            width="50%"
          />

          <Picker
            icon="warehouse"
            items={typebuilding}
            name="typebuilding"
            PickerItemComponent={PickerItem}
            placeholder="Type of building *"
          />
          <Picker
            icon="alpha-t-box"
            items={tenuralStatus}
            name="tenuralstatus"
            PickerItemComponent={PickerItem}
            placeholder="Tenural Status"
          />

          <FormField
            autoCorrect={false}
            name="yearconstract"
            icon="calendar"
            placeholder="Year construct"
            width="75%"
            keyboardType="number-pad"
          />

          <FormField
            autoCorrect={false}
            icon="cash"
            name="cost"
            placeholder="Estimated cost"
            width="75%"
            keyboardType="number-pad"
          />

          <FormField
            autoCorrect={false}
            icon="bed-empty"
            name="beadroom"
            placeholder="Number of bedrooms"
            width="75%"
            keyboardType="number-pad"
          />

          <FormField
            autoCorrect={false}
            icon="office-building"
            name="storeys"
            placeholder="Number of storeys"
            width="75%"
            keyboardType="number-pad"
          />

          <SwitchInput
            icon="electric-switch"
            name="aelectricity"
            placeholder="Access to electricity"
          />

          <SwitchInput
            icon="internet-explorer"
            name="internet"
            placeholder="Access to internet"
          />

          <Picker
            icon="material-ui"
            items={roofmaterials}
            name="roofmaterial"
            PickerItemComponent={PickerItem}
            placeholder="Roof material"
          />
          <Picker
            icon="wall"
            items={wallmaterials}
            name="wallmaterial"
            PickerItemComponent={PickerItem}
            placeholder="Wall material"
          />

          <SwitchInput
            icon="medical-bag"
            name="tbl_availmedicaltreatment"
            placeholder="Did you or any member of the household avail of medical treatment for any serious illnesses?"
            setAvail={setAvailtreatment}
            initavail={availtreatment}
          />

          {availtreatment && (
            <FormField
              autoCorrect={false}
              icon="medical-bag"
              name="tbl_treatmentspecification"
              placeholder="Specification"
            />
          )}

          <SwitchInput
            icon="water-pump"
            name="awater"
            placeholder="Access to Water"
          />

          <SwitchInput
            icon="water"
            name="wpotable"
            placeholder="Water is potable"
          />

          <Picker
            icon="infinity"
            items={watertenuralstatus}
            name="wtenuralstatus"
            PickerItemComponent={PickerItem}
            placeholder="Water tenural status"
          />

          <Picker
            icon="cup-water"
            items={lvlwatersystem}
            name="wlvlsystem"
            PickerItemComponent={PickerItem}
            placeholder="Level of water"
          />

          <SwitchInput
            icon="water-percent"
            name="tbl_hhfloodsoccurinarea"
            placeholder="Do floods occure in your area?"
            setAvail={setFloodsoccured}
            initavail={floodsoccured}
          />

          {floodsoccured && (
            <FormField
              autoCorrect={false}
              name="tbl_hhfloodsoccurinareayear"
              icon="calendar"
              placeholder="Year occured"
              width="75%"
              keyboardType="number-pad"
            />
          )}

          <SwitchInput
            icon="home-flood"
            name="tbl_hhexperienceevacuationoncalamity"
            placeholder="Do you experience evacuation during calamity ?"
            setAvail={setExpevacuation}
            initavail={expevacuation}
          />

          {expevacuation && (
            <FormField
              autoCorrect={false}
              name="tbl_hhexperienceevacuationoncalamityyear"
              icon="calendar"
              placeholder="Year experienced"
              width="75%"
              keyboardType="number-pad"
            />
          )}

          <Picker
            icon="home-flood"
            items={evacuationarea}
            name="evacuationarea"
            PickerItemComponent={PickerItem}
            placeholder="Evacuation center location"
            setOther={setOtherEvacuation}
          />

          {otherEvacuation && (
            <FormField
              autoCorrect={false}
              icon="bank-plus"
              name="otherevacuation"
              placeholder="Add other evacuation center *"
            />
          )}

          <SwitchInput
            icon="medical-bag"
            name="accessmedfacility"
            placeholder="Access to health/medical Fac"
          />

          <SwitchInput
            icon="access-point-network"
            name="accesstelecommunication"
            placeholder="Access to Telecomunications"
          />

          <SwitchInput
            icon="bag-personal"
            name="accessdrillsimulation"
            placeholder="Access to drill/simulation"
          />

          {route.params.update ? (
            <SubmitButton title="Update" />
          ) : (
            <SubmitButton title="Save" />
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
                Review Add Household Input
              </Text>
              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Respondent Name</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.respondentname}
                  </Text>
                </View>
              </View>

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
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.mun.label +
                      " " +
                      tempData.brgy.label +
                      " " +
                      tempData.purok}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Coordinates</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {"Lat: "}
                    {tempData.coordinates.latitude}
                    {"\n"}
                    {"Lng: "}
                    {tempData.coordinates.longitude}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Type of Building</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.typebuilding.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Tenural Status</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tenuralstatus.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Year construct</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.yearconstract}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Estimated cost</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>{tempData.cost}</Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Number of Bedrooms
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.beadroom}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Number of Storey</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.storeys}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Has access to electricity?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.aelectricity ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Has access to internet?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.internet ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Roof material</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.roofmaterial.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Wall material</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.wallmaterial.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Did you or any member of the household avail of medical
                    treatment for any serious illnesses?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_availmedicaltreatment ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Specification</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_treatmentspecification}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Has access to water?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.awater ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Has access to water?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.wpotable ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Has access to water?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.wpotable ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Tenural status of water
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.wtenuralstatus.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Level of water</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.wlvlsystem.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Do floods occure in your area?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_hhfloodsoccurinarea ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Year occured</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_hhfloodsoccurinareayear}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Do you experience evacuation duuring calamity?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_hhexperienceevacuationoncalamity
                      ? "Yes"
                      : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>Year experienced</Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.tbl_hhexperienceevacuationoncalamityyear}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Evacuation center location
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.evacuationarea.label}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Access to health/medical Facility?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.accessmedfacility ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Access to Telecomunications?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.accesstelecommunication ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.moreInfoTable}>
                <View style={styles.moreInfolabel}>
                  <Text style={styles.moreInfolabeltxt}>
                    Access to drill/simulation?
                  </Text>
                </View>
                <View
                  style={
                    (styles.moreInforData,
                    { flexDirection: "row", flex: 1, flexWrap: "wrap" })
                  }
                >
                  <Text style={styles.moreInforDataTxt}>
                    {tempData.accessdrillsimulation ? "Yes" : "No"}
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
    flex: 1,
    textAlign: "center",
    padding: 10,
  },
  spinnerTextStyle: {
    color: "#FFF",
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
  moreInforDataTxt: {
    paddingTop: 5,
  },
});

export default ProfilerScreen;
