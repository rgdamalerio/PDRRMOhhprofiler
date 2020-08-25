import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import * as Yup from "yup";
import * as SQLite from "expo-sqlite";

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

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
  respondentname: Yup.string().required().label("Respondent Name"),
  prov: Yup.string().required().label("Province"),
  mun: Yup.string().required().label("Municipality"),
  brgy: Yup.string().required().label("Barangay"),
  coordinates: Yup.string().required().nullable().label("Coordinates"),
  image: Yup.string().required().nullable().label("Image"),
  typebuilding: Yup.string().required().label("Type of building"),
  //yearconstract: Yup.string().required().label("Year construct"),
  beadroom: Yup.number().label("Number of bedrooms"),
});

const categories = [
  { label: "Furniture", value: 1 },
  { label: "Clothing", value: 2 },
  { label: "Camera", value: 3 },
];

const db = SQLite.openDatabase("hhprofiler.db");

function ProfilerScreen({ navigation }) {
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

  useEffect(() => {
    getProvince();
    gettypeBuilding();
    gettenuralStatus();
    getroofMaterials();
    getwallMaterials();
    getWaterTenuralStatus();
    getLvlWaterSystem();
    getEvacuationareas();
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

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <Form
          initialValues={{
            respondentname: "",
            prov: "",
            mun: "",
            brgy: "",
            purok: "",
            coordinates: null,
            image: null,
            yearconstract: "",
            beadroom: 0,
            storeys: 0,
            aelectricity: 0,
            internet: 0,
            roofmaterial: 0,
            wallmaterial: 0,
            awater: 0,
            wpotable: 0,
            wtenuralstatus: 0,
            wlvlsystem: 0,
            evacuationarea: 0,
            accessmedfacility: 0,
            accesstelecommunication: 0,
            accessdrillsimulation: 0,
            typebuilding: "",
            tenuralstatus: 0,
          }}
          onSubmit={(values) =>
            db.transaction(
              (tx) => {
                tx.executeSql(
                  "insert into tbl_enumerator (tbl_enumeratorprov,tbl_enumeratormun,tbl_enumeratorbrgy) values (?,?,?)",
                  [values.prov.id, values.mun.id, values.brgy.id],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      Alert.alert(
                        "Success",
                        "You are Registered Successfully, you can now Login to start encoding household information",
                        [
                          {
                            text: "OK",
                            onPress: () => navigation.navigate("Login"),
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
                  alert(
                    "Email address already exist! Please try to use another email"
                  );
                }
              }
            )
          }
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
          />

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ProfilerScreen;
