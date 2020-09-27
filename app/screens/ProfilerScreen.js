import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import * as Random from "expo-random";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";
import Constants from "expo-constants";
import * as MediaLibrary from "expo-media-library";

import Screen from "../components/Screen";
import PickerItem from "../components/PickerItem";
import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  AddressPicker,
  FormCameraPicker,
  FormLocationPicker,
  FormDatePicker,
  SubmitButton,
} from "../components/forms";
import SwitchInput from "../components/SwitchInput";
import ActivityIndicator from "../components/ActivityIndicator";
import useAuth from "../auth/useAuth";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  respondentname: Yup.string().required().label("Respondent Name"),
  prov: Yup.string().required().label("Province"),
  mun: Yup.string().required().label("Municipality"),
  brgy: Yup.string().required().label("Barangay"),
  image: Yup.string().required().nullable().label("Image"),
  coordinates: Yup.string().required().nullable().label("Coordinates"),
  typebuilding: Yup.string().required().label("Type of building"),
  yearconstract: Yup.string().label("Number of Storey"),
  cost: Yup.number().label("Estimated Cost"),
  beadroom: Yup.number().label("Number of bedrooms"),
  storeys: Yup.number().required().label("Number of Storey"),
  wallmaterial: Yup.string().required().label("Wall material"),
  evacuationarea: Yup.object().nullable(),
  otherevacuation: Yup.string().when("evacuationarea.label", {
    is: "Other, Please specify",
    then: Yup.string().required().label("Add other evacuation"),
  }), //adjust this if there is item added to evacuation area library
});

const db = SQLite.openDatabase("hhprofiler16.db");

function ProfilerScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [pro, setPro] = useState();
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
  const [randomBtyes, setRandomBtyes] = useState();
  const [date, setDate] = useState();
  const [uuid, setUuid] = useState(
    Constants.installationId + "-" + new Date().getTime()
  );
  const { user } = useAuth();

  useEffect(() => {
    getProvince();
    gettypeBuilding();
    gettenuralStatus();
    getroofMaterials();
    getwallMaterials();
    getWaterTenuralStatus();
    getLvlWaterSystem();
    getEvacuationareas();
    getRandomBytes();
    getDate();
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

  const parseYear = (date) => {
    try {
      return date.getFullYear();
    } catch (error) {
      return "";
    }
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
            "tbl_hhaccesswater," +
            "tbl_hhwaterpotable," +
            "tbl_watertenuralstatus_id," +
            "tbl_hhlvlwatersystem_id," +
            "tbl_evacuation_areas_id," +
            "tbl_hhhasaccesshealtmedicalfacility," +
            "tbl_hhhasaccesstelecom," +
            "tbl_hasaccessdrillsandsimulations," +
            "tbl_householdpuroksittio," +
            "tbl_hhimage," +
            "tbl_respondent" +
            ") values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            uuid,
            String(date),
            data.coordinates != null ? data.coordinates.latitude : "",
            data.coordinates != null ? data.coordinates.longitude : "",
            parseYear(data.yearconstract),
            data.cost,
            data.beadroom,
            data.storeys,
            data.aelectricity ? 1 : 0,
            data.internet ? 1 : 0,
            user.idtbl_enumerator,
            data.brgy.id,
            data.mun.id,
            data.prov.id,
            data.typebuilding.id ? data.typebuilding.id : 0,
            data.tenuralstatus.id ? data.tenuralstatus.id : 0,
            data.roofmaterial.id ? data.roofmaterial.id : 0,
            data.wallmaterial.id ? data.wallmaterial.id : 0,
            data.awater ? 1 : 0,
            data.wpotable ? 1 : 0,
            data.wtenuralstatus.id ? data.wtenuralstatus.id : 0,
            data.wlvlsystem.id ? data.wlvlsystem.id : 0,
            data.evacuationarea.id ? data.evacuationarea.id : 0,
            data.accessmedfacility ? 1 : 0,
            data.accesstelecommunication ? 1 : 0,
            data.accessdrillsimulation ? 1 : 0,
            data.purok,
            filename,
            data.respondentname,
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
                          console.log(
                            "Success update last item in evacuation area library"
                          );
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
                                    console.log(
                                      "Success adding new item in evacuation area library"
                                    );
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
                              console.log(error);
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
                    console.log("Error: " + error);
                  }
                );
              }

              createAlbum(data.image);
              setLoading(false);
              navigation.navigate("Program", {
                id: insertId,
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

  const createAlbum = async (uri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      MediaLibrary.createAlbumAsync("PDRRMOProfiler", asset, false)
        .then(() => {
          return asset.uri;
        })
        .catch((error) => {
          alert("Error saving image, Error details: " + error);
          return null;
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <ScrollView style={styles.container}>
        <Form
          initialValues={{
            respondentname: "",
            prov: "",
            mun: "",
            brgy: "",
            purok: "",
            coordinates: null,
            image: null,
            typebuilding: "",
            yearconstract: 0,
            cost: 0,
            beadroom: 0,
            storeys: 0,
            aelectricity: false,
            internet: false,
            roofmaterial: 0,
            wallmaterial: 0,
            awater: false,
            wpotable: false,
            wtenuralstatus: 0,
            wlvlsystem: 0,
            evacuationarea: 0,
            otherevacuation: "",
            accessmedfacility: false,
            accesstelecommunication: false,
            accessdrillsimulation: false,
            tenuralstatus: 0,
          }}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm);
          }}
          validationSchema={validationSchema}
        >
          <FormField
            autoCorrect={false}
            icon="account"
            name="respondentname"
            placeholder="Respondent Name"
          />
          <AddressPicker
            icon="earth"
            items={pro}
            name="prov"
            PickerItemComponent={PickerItem}
            placeholder="Province"
            setMun={handleProvChange}
          />
          <AddressPicker
            icon="earth"
            items={mun}
            name="mun"
            PickerItemComponent={PickerItem}
            placeholder="Municipality"
            setBrgy={handleMunChange}
          />
          <AddressPicker
            icon="earth"
            items={brgy}
            name="brgy"
            PickerItemComponent={PickerItem}
            placeholder="Barangay"
            //searchable
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
            placeholder="coordinates"
            width="50%"
          />
          <FormCameraPicker name="image" />

          <Picker
            icon="warehouse"
            items={typebuilding}
            name="typebuilding"
            PickerItemComponent={PickerItem}
            placeholder="Type of building"
          />
          <Picker
            icon="alpha-t-box"
            items={tenuralStatus}
            name="tenuralstatus"
            PickerItemComponent={PickerItem}
            placeholder="Tenural Status"
          />

          <FormDatePicker
            name="yearconstract"
            icon="date"
            placeholder="Year construct"
            width="50%"
            display="spinner"
            mode="date"
            year
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
              placeholder="Add other evacuation center"
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

          <SubmitButton title="Save" />
        </Form>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    textAlign: "center",
    padding: 10,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default ProfilerScreen;
