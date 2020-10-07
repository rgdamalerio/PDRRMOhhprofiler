import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  Modal,
  TouchableHighlight,
} from "react-native";
import Constants from "expo-constants";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Notifications } from "expo";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

import { mapDarkStyle, mapStandardStyle } from "../model/mapData";
import useAuth from "../auth/useAuth";

import {
  AppForm as Form,
  AppFormField as FormField,
  FormPicker as Picker,
  AddressPicker,
  SubmitButton,
} from "../components/forms";
import SwitchInput from "../components/SwitchInput";
import PickerItem from "../components/PickerItem";
import colors from "../config/colors";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const db = SQLite.openDatabase("hhprofiler21.db");

function AnimatedScreen({ navigation }) {
  const theme = useTheme();

  const initialMapState = {
    region: {
      latitude: 9.190489360418237,
      latitudeDelta: 2.239664674768459,
      longitude: 125.57549066841602,
      longitudeDelta: 1.365918293595314,
    },
  };

  const [state, setState] = React.useState(initialMapState);
  const [search, setSearch] = React.useState("");
  const [respondents, setRespondents] = React.useState();
  const [markers, setMarkers] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalSearch, setModalSearch] = React.useState(false);
  const [moreinfo, setMoreinfo] = React.useState([]);
  const [programs, setPrograms] = React.useState([]);
  const [dateInterviews, setDateInterviews] = React.useState([]);
  const [household, setHousehold] = React.useState([]);
  const [demographys, setDemographys] = React.useState([]);
  const [livelihoods, setLivelihoods] = React.useState([]);
  const [mun, setMun] = React.useState();
  const [brgy, setBrgy] = React.useState();
  const [typebuilding, setTypebuilding] = React.useState();
  const [tenuralStatus, settenuralStatus] = React.useState();
  const [roofmaterials, setRoofmaterials] = React.useState();
  const [wallmaterials, setWallmaterials] = React.useState();
  const [watertenuralstatus, setWatertenuralstatus] = React.useState();
  const [lvlwatersystem, setLvlwatersystems] = React.useState();
  const [evacuationarea, setEvacuationarea] = React.useState();
  const [filter, setFilter] = React.useState();

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchHousehold();
    fetchInterviewByGroup();
    getMunicipality();
    gettypeBuilding();
    gettenuralStatus();
    getBrgy();
    getroofMaterials();
    getwallMaterials();
    getWaterTenuralStatus();
    getLvlWaterSystem();
    getEvacuationareas();
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

  const getBrgy = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select idtbl_psgc_brgy AS id, tbl_psgc_brgyname AS label from tbl_psgc_brgy`,
          [],
          (_, { rows: { _array } }) => setBrgy(_array)
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

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= markers.length) {
        index = markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { tbl_hhlatitude, tbl_hhlongitude } = markers[index];
          const { longitudeDelta, latitudeDelta } = _map.current.__lastRegion;
          _map.current.animateToRegion(
            {
              latitude: parseFloat(tbl_hhlatitude),
              longitude: parseFloat(tbl_hhlongitude),
              latitudeDelta: latitudeDelta, //state.region.latitudeDelta,
              longitudeDelta: longitudeDelta, //state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchHousehold();
      fetchInterviewByGroup();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const fetchInterviewByGroup = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT tbl_hhdateinterview FROM tbl_household WHERE tbl_enumerator_id_fk = ? GROUP BY tbl_hhdateinterview",
          [user.idtbl_enumerator],
          (_, { rows: { _array } }) => {
            setDateInterviews(_array);
          }
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Household data, Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const fetchHousehold = (filterdate = null) => {
    let query =
      "SELECT tbl_household_id," +
      "tbl_hhissethead," +
      "tbl_hhcontrolnumber," +
      "tbl_hhdateinterview," +
      "tbl_hhlatitude," +
      "tbl_hhlongitude," +
      "tbl_hhfield_editor," +
      "tbl_hhyearconstruct," +
      "tbl_hhyearconstruct," +
      "tbl_hhyearconstruct," +
      "tbl_hhnobedroms," +
      "tbl_hhnostorey," +
      "tbl_hhaelectricity," +
      "tbl_hhainternet," +
      "tbl_hhainternet," +
      "tbl_enumerator_id_fk," +
      "tbl_psgc_brgy_id," +
      "tbl_psgc_mun_id," +
      "tbl_psgc_pro_id," +
      "lib_typeofbuilding_id," +
      "tbl_hhecost," +
      "tbl_tenuralstatus_id," +
      "tbl_typeofconmaterials_id," +
      "tbl_wallconmaterials_id," +
      "tbl_hhaccesswater," +
      "tbl_hhwaterpotable," +
      "tbl_watertenuralstatus_id," +
      "tbl_hhlvlwatersystem_id," +
      "tbl_evacuation_areas_id," +
      "tbl_hhhasaccesshealtmedicalfacility," +
      "tbl_hhhasaccesshealtmedicalfacility," +
      "tbl_hhhasaccesstelecom," +
      "tbl_hasaccessdrillsandsimulations," +
      "tbl_household.created_at," +
      "tbl_household.updated_at," +
      "tbl_household.created_by," +
      "tbl_household.updatedy_by," +
      "tbl_householdpuroksittio," +
      "tbl_hhimage," +
      "tbl_respondent," +
      "tbl_uri," +
      "idtbl_psgc_brgy," + //tbl_psgc_brgy
      "tbl_psgc_brgyname," +
      "tbl_psgc_mun_id_fk," +
      "idtbl_psgc_mun," + //tbl_psgc_municipality
      "tbl_psgc_munname," +
      "tbl_psgc_prov_id_fk," +
      "idtbl_psgc_prov," + //tbl_psgc_prov
      "tbl_psgc_provname," +
      "tbl_psgc_region_id_fk," +
      "idtbl_enumerator," + //tbl_enumerator
      "tbl_enumeratorfname," +
      "tbl_enumeratorlname," +
      "tbl_enumeratormname," +
      "tbl_enumeratoremail," +
      "tbl_enumeratorcontact," +
      "tbl_enumeratorprov," +
      "tbl_enumeratormun," +
      "tbl_enumeratorbrgy," +
      "tbl_imagepath," +
      "lib_buildingtypedesc," + //lib_hhtypeofbuilding
      "lib_tenuralstatusdesc," + //lib_hhtenuralstatus
      "lib_roofmaterialsdesc," + //lib_hhroofmaterials
      "lib_wallmaterialsdesc," + //lib_hhwallconmaterials
      "lib_wtdesc," + //lib_hhwatertenuralstatus
      "lib_hhwatersystemlvl," + //lib_hhlvlwatersystem
      "lib_hhlvldesc," +
      "lib_heaname " + //lib_hhevacuationarea
      "FROM tbl_household " +
      "LEFT JOIN tbl_psgc_brgy ON tbl_household.tbl_psgc_brgy_id=tbl_psgc_brgy.idtbl_psgc_brgy " + //tbl_psgc_brgy
      "LEFT JOIN tbl_psgc_mun ON tbl_household.tbl_psgc_mun_id=tbl_psgc_mun.idtbl_psgc_mun " + //tbl_psgc_municipality
      "LEFT JOIN tbl_psgc_prov ON tbl_household.tbl_psgc_pro_id=tbl_psgc_prov.idtbl_psgc_prov " + //tbl_psgc_prov
      "LEFT JOIN tbl_enumerator ON tbl_household.tbl_enumerator_id_fk=tbl_enumerator.idtbl_enumerator " + //tbl_enumerator
      "LEFT JOIN lib_hhtypeofbuilding ON tbl_household.lib_typeofbuilding_id=lib_hhtypeofbuilding.id " + //lib_hhtypeofbuilding
      "LEFT JOIN lib_hhtenuralstatus ON tbl_household.tbl_tenuralstatus_id=lib_hhtenuralstatus.id " + //lib_hhtenuralstatus
      "LEFT JOIN lib_hhroofmaterials ON tbl_household.tbl_typeofconmaterials_id=lib_hhroofmaterials.id " + //lib_hhroofmaterials
      "LEFT JOIN lib_hhwallconmaterials ON tbl_household.tbl_wallconmaterials_id=lib_hhwallconmaterials.id " + //lib_hhwallconmaterials
      "LEFT JOIN lib_hhwatertenuralstatus ON tbl_household.tbl_watertenuralstatus_id=lib_hhwatertenuralstatus.id " + //lib_hhwatertenuralstatus
      "LEFT JOIN lib_hhlvlwatersystem ON tbl_household.tbl_hhlvlwatersystem_id=lib_hhlvlwatersystem.id " + //lib_hhlvlwatersystem
      "LEFT JOIN lib_hhevacuationarea ON tbl_household.tbl_evacuation_areas_id=lib_hhevacuationarea.id " + //lib_hhevacuationarea
      "WHERE tbl_enumerator_id_fk = ? ";

    if (filterdate != null)
      query += " AND tbl_hhdateinterview = '" + filterdate + "'";

    db.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [user.idtbl_enumerator],
          (_, { rows: { _array } }) => {
            setMarkers(_array);
            setRespondents(_array);
          }
        );
      },
      (error) => {
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Household data, Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const moreInformation = (marker) => {
    setMoreinfo(marker);
    fetchHHprofile(marker.tbl_household_id);
    fetchPrograms(marker.tbl_household_id);
    fetchDemographys(marker.tbl_household_id);
    fetchLivelihood(marker.tbl_household_id);
    setModalVisible(true);
  };

  const fetchHHprofile = (householdid) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT tbl_household_id," +
            "tbl_hhissethead," +
            "tbl_hhcontrolnumber," +
            "tbl_hhdateinterview," +
            "tbl_hhlatitude," +
            "tbl_hhlongitude," +
            "tbl_hhfield_editor," +
            "tbl_hhyearconstruct," +
            "tbl_hhyearconstruct," +
            "tbl_hhyearconstruct," +
            "tbl_hhnobedroms," +
            "tbl_hhnostorey," +
            "tbl_hhaelectricity," +
            "tbl_hhainternet," +
            "tbl_hhainternet," +
            "tbl_enumerator_id_fk," +
            "tbl_psgc_brgy_id," +
            "tbl_psgc_mun_id," +
            "tbl_psgc_pro_id," +
            "lib_typeofbuilding_id," +
            "tbl_hhecost," +
            "tbl_tenuralstatus_id," +
            "tbl_typeofconmaterials_id," +
            "tbl_wallconmaterials_id," +
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
            "tbl_hhhasaccesshealtmedicalfacility," +
            "tbl_hhhasaccesstelecom," +
            "tbl_hasaccessdrillsandsimulations," +
            "tbl_household.created_at," +
            "tbl_household.updated_at," +
            "tbl_household.created_by," +
            "tbl_household.updatedy_by," +
            "tbl_householdpuroksittio," +
            "tbl_hhimage," +
            "tbl_respondent," +
            "idtbl_psgc_brgy," + //tbl_psgc_brgy
            "tbl_psgc_brgyname," +
            "tbl_psgc_mun_id_fk," +
            "idtbl_psgc_mun," + //tbl_psgc_municipality
            "tbl_psgc_munname," +
            "tbl_psgc_prov_id_fk," +
            "idtbl_psgc_prov," + //tbl_psgc_prov
            "tbl_psgc_provname," +
            "tbl_psgc_region_id_fk," +
            "idtbl_enumerator," + //tbl_enumerator
            "tbl_enumeratorfname," +
            "tbl_enumeratorlname," +
            "tbl_enumeratormname," +
            "tbl_enumeratoremail," +
            "tbl_enumeratorcontact," +
            "tbl_enumeratorprov," +
            "tbl_enumeratormun," +
            "tbl_enumeratorbrgy," +
            "tbl_imagepath," +
            "lib_buildingtypedesc," + //lib_hhtypeofbuilding
            "lib_tenuralstatusdesc," + //lib_hhtenuralstatus
            "lib_roofmaterialsdesc," + //lib_hhroofmaterials
            "lib_wallmaterialsdesc," + //lib_hhwallconmaterials
            "lib_wtdesc," + //lib_hhwatertenuralstatus
            "lib_hhwatersystemlvl," + //lib_hhlvlwatersystem
            "lib_hhlvldesc," +
            "lib_heaname " + //lib_hhevacuationarea
            "FROM tbl_household " +
            "LEFT JOIN tbl_psgc_brgy ON tbl_household.tbl_psgc_brgy_id=tbl_psgc_brgy.idtbl_psgc_brgy " + //tbl_psgc_brgy
            "LEFT JOIN tbl_psgc_mun ON tbl_household.tbl_psgc_mun_id=tbl_psgc_mun.idtbl_psgc_mun " + //tbl_psgc_municipality
            "LEFT JOIN tbl_psgc_prov ON tbl_household.tbl_psgc_pro_id=tbl_psgc_prov.idtbl_psgc_prov " + //tbl_psgc_prov
            "LEFT JOIN tbl_enumerator ON tbl_household.tbl_enumerator_id_fk=tbl_enumerator.idtbl_enumerator " + //tbl_enumerator
            "LEFT JOIN lib_hhtypeofbuilding ON tbl_household.lib_typeofbuilding_id=lib_hhtypeofbuilding.id " + //lib_hhtypeofbuilding
            "LEFT JOIN lib_hhtenuralstatus ON tbl_household.tbl_tenuralstatus_id=lib_hhtenuralstatus.id " + //lib_hhtenuralstatus
            "LEFT JOIN lib_hhroofmaterials ON tbl_household.tbl_typeofconmaterials_id=lib_hhroofmaterials.id " + //lib_hhroofmaterials
            "LEFT JOIN lib_hhwallconmaterials ON tbl_household.tbl_wallconmaterials_id=lib_hhwallconmaterials.id " + //lib_hhwallconmaterials
            "LEFT JOIN lib_hhwatertenuralstatus ON tbl_household.tbl_watertenuralstatus_id=lib_hhwatertenuralstatus.id " + //lib_hhwatertenuralstatus
            "LEFT JOIN lib_hhlvlwatersystem ON tbl_household.tbl_hhlvlwatersystem_id=lib_hhlvlwatersystem.id " + //lib_hhlvlwatersystem
            "LEFT JOIN lib_hhevacuationarea ON tbl_household.tbl_evacuation_areas_id=lib_hhevacuationarea.id " + //lib_hhevacuationarea
            "where tbl_household_id = ?",
          [householdid],
          (_, { rows: { _array } }) => setHousehold(_array)
        );
      },
      (error) => {
        console.log(error);
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Household data, Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const fetchPrograms = (householdid) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT lib_pname," +
            "tbl_household_id," +
            "lib_pname," +
            "lib_pnumbeni," +
            "lib_pimplementor," +
            "lib_typeofprogram.id as typeofprogramid," + //lib_typeofprogram
            "lib_topname " +
            "FROM tbl_programs " +
            "LEFT JOIN lib_typeofprogram ON tbl_programs.lib_typeofprogram_id=lib_typeofprogram.id " + //lib_typeofprogram
            "where tbl_household_id = ?",
          [householdid],
          (_, { rows: { _array } }) => setPrograms(_array)
        );
      },
      (error) => {
        console.log(error);
        Alert.alert(
          "SQLITE ERROR",
          "Error loading availed program, Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const fetchDemographys = (householdid) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT tbl_hhdemography.id," +
            "tbl_household_id," +
            "tbl_fname," +
            "tbl_lname," +
            "tbl_mname," +
            "tbl_extension," +
            "tbl_ishead," +
            "lib_familybelongs_id," +
            "lib_gender_id," +
            "lib_gname," +
            "tbl_relationshiphead_id," +
            "lib_rhname," +
            "tbl_datebirth," +
            "lib_maritalstatus_id," +
            "lib_msname," +
            "lib_ethnicity_id," +
            "lib_religion_id," +
            "tbl_withspecialneeds," +
            "lib_disability_id," +
            "lib_dname," +
            "tbl_isofw," +
            "tbl_is3yrsinlocation," +
            "lib_nutritioanalstatus_id," +
            "lib_nsname," +
            "tbl_iscurattschool," +
            "lib_gradelvl_id," +
            "lvl.lib_glname as lvllib_glname," +
            "lib_hea_id," +
            "hea.lib_glname as healib_glname," +
            "lib_tscshvc_id," +
            "lib_tscshvcname," +
            "tbl_canreadwriteorhighschoolgrade," +
            "tbl_primary_occupation," +
            "lib_monthlyincome_id," +
            "lib_miname," +
            "tbl_ismembersss," +
            "tbl_ismembergsis," +
            "tbl_ismemberphilhealth," +
            "tbl_adependentofaphilhealthmember " +
            "FROM tbl_hhdemography " +
            "LEFT JOIN lib_gender ON tbl_hhdemography.lib_gender_id=lib_gender.id " + //lib_gender
            "LEFT JOIN lib_maritalstatus ON tbl_hhdemography.lib_maritalstatus_id=lib_maritalstatus.id " + //lib_maritalstatus
            "LEFT JOIN libl_relationshiphead ON tbl_hhdemography.tbl_relationshiphead_id=libl_relationshiphead.id " + //libl_relationshiphead
            "LEFT JOIN lib_disability ON tbl_hhdemography.lib_disability_id=lib_disability.id " + //lib_disability
            "LEFT JOIN lib_nutritioanalstatus ON tbl_hhdemography.lib_nutritioanalstatus_id=lib_nutritioanalstatus.id " + //lib_nutritioanalstatus
            "LEFT JOIN lib_gradelvl as lvl ON tbl_hhdemography.lib_gradelvl_id=lvl.id " + //lib_gradelvl_id
            "LEFT JOIN lib_gradelvl as hea ON tbl_hhdemography.lib_hea_id=hea.id " + //lib_hea_id
            "LEFT JOIN lib_tscshvc ON tbl_hhdemography.lib_tscshvc_id=lib_tscshvc.id " + //lib_tscshvc
            "LEFT JOIN lib_monthlyincome ON tbl_hhdemography.lib_monthlyincome_id=lib_monthlyincome.id " + //lib_monthlyincome
            "where tbl_household_id = ?",
          [householdid],
          (_, { rows: { _array } }) => setDemographys(_array)
        );
      },
      (error) => {
        console.log(error);
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Demography, Please contact developer, " + error,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    );
  };

  const fetchLivelihood = (householdid) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT tbl_livelihood.id," +
            "lib_typeoflivelihood," +
            "lib_desc," +
            "tbl_livelihoodmarketvalue," +
            "tbl_livelihoodtotalarea," +
            "tbl_livelihoodproducts," +
            "lib_tenuralstatus_id," +
            "tbl_tsname," +
            "tbl_livelihoodiswithinsurance " +
            "FROM tbl_livelihood " +
            "LEFT JOIN lib_livelihood ON tbl_livelihood.lib_typeoflivelihood=lib_livelihood.id " + //lib_livelihood
            "LEFT JOIN libl_tenuralstatus ON tbl_livelihood.lib_tenuralstatus_id=libl_tenuralstatus.id " + //libl_tenuralstatus
            "where tbl_household_id = ?",
          [householdid],
          (_, { rows: { _array } }) => setLivelihoods(_array)
        );
      },
      (error) => {
        console.log(error);
        Alert.alert(
          "SQLITE ERROR",
          "Error loading Livelihood details, Please contact developer, " +
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

  const interpolations = markers.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.6, 1],
      extrapolate: "clamp",
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
  };

  const handleSearch = (txt) => {
    const newRespondent = respondents.filter(
      (respondent) =>
        respondent.tbl_respondent.toUpperCase().indexOf(txt.toUpperCase()) > -1
    );
    setMarkers(newRespondent);

    _map.current.fitToSuppliedMarkers(["mk1"], {
      edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
      animated: false,
    });
  };
  const handleAdvanceSearch = (data) => {
    setFilter(data);
    try {
      let query =
        "SELECT tbl_household_id," +
        "tbl_hhissethead," +
        "tbl_hhcontrolnumber," +
        "tbl_hhdateinterview," +
        "tbl_hhlatitude," +
        "tbl_hhlongitude," +
        "tbl_hhfield_editor," +
        "tbl_hhyearconstruct," +
        "tbl_hhyearconstruct," +
        "tbl_hhyearconstruct," +
        "tbl_hhnobedroms," +
        "tbl_hhnostorey," +
        "tbl_hhaelectricity," +
        "tbl_hhainternet," +
        "tbl_hhainternet," +
        "tbl_enumerator_id_fk," +
        "tbl_psgc_brgy_id," +
        "tbl_psgc_mun_id," +
        "tbl_psgc_pro_id," +
        "lib_typeofbuilding_id," +
        "tbl_hhecost," +
        "tbl_tenuralstatus_id," +
        "tbl_typeofconmaterials_id," +
        "tbl_wallconmaterials_id," +
        "tbl_hhaccesswater," +
        "tbl_hhwaterpotable," +
        "tbl_watertenuralstatus_id," +
        "tbl_hhlvlwatersystem_id," +
        "tbl_evacuation_areas_id," +
        "tbl_hhhasaccesshealtmedicalfacility," +
        "tbl_hhhasaccesshealtmedicalfacility," +
        "tbl_hhhasaccesstelecom," +
        "tbl_hasaccessdrillsandsimulations," +
        "tbl_household.created_at," +
        "tbl_household.updated_at," +
        "tbl_household.created_by," +
        "tbl_household.updatedy_by," +
        "tbl_householdpuroksittio," +
        "tbl_hhimage," +
        "tbl_respondent," +
        "tbl_uri," +
        "idtbl_psgc_brgy," + //tbl_psgc_brgy
        "tbl_psgc_brgyname," +
        "tbl_psgc_mun_id_fk," +
        "idtbl_psgc_mun," + //tbl_psgc_municipality
        "tbl_psgc_munname," +
        "tbl_psgc_prov_id_fk," +
        "idtbl_psgc_prov," + //tbl_psgc_prov
        "tbl_psgc_provname," +
        "tbl_psgc_region_id_fk," +
        "idtbl_enumerator," + //tbl_enumerator
        "tbl_enumeratorfname," +
        "tbl_enumeratorlname," +
        "tbl_enumeratormname," +
        "tbl_enumeratoremail," +
        "tbl_enumeratorcontact," +
        "tbl_enumeratorprov," +
        "tbl_enumeratormun," +
        "tbl_enumeratorbrgy," +
        "tbl_imagepath," +
        "lib_buildingtypedesc," + //lib_hhtypeofbuilding
        "lib_tenuralstatusdesc," + //lib_hhtenuralstatus
        "lib_roofmaterialsdesc," + //lib_hhroofmaterials
        "lib_wallmaterialsdesc," + //lib_hhwallconmaterials
        "lib_wtdesc," + //lib_hhwatertenuralstatus
        "lib_hhwatersystemlvl," + //lib_hhlvlwatersystem
        "lib_hhlvldesc," +
        "lib_heaname " + //lib_hhevacuationarea
        "FROM tbl_household " +
        "LEFT JOIN tbl_psgc_brgy ON tbl_household.tbl_psgc_brgy_id=tbl_psgc_brgy.idtbl_psgc_brgy " + //tbl_psgc_brgy
        "LEFT JOIN tbl_psgc_mun ON tbl_household.tbl_psgc_mun_id=tbl_psgc_mun.idtbl_psgc_mun " + //tbl_psgc_municipality
        "LEFT JOIN tbl_psgc_prov ON tbl_household.tbl_psgc_pro_id=tbl_psgc_prov.idtbl_psgc_prov " + //tbl_psgc_prov
        "LEFT JOIN tbl_enumerator ON tbl_household.tbl_enumerator_id_fk=tbl_enumerator.idtbl_enumerator " + //tbl_enumerator
        "LEFT JOIN lib_hhtypeofbuilding ON tbl_household.lib_typeofbuilding_id=lib_hhtypeofbuilding.id " + //lib_hhtypeofbuilding
        "LEFT JOIN lib_hhtenuralstatus ON tbl_household.tbl_tenuralstatus_id=lib_hhtenuralstatus.id " + //lib_hhtenuralstatus
        "LEFT JOIN lib_hhroofmaterials ON tbl_household.tbl_typeofconmaterials_id=lib_hhroofmaterials.id " + //lib_hhroofmaterials
        "LEFT JOIN lib_hhwallconmaterials ON tbl_household.tbl_wallconmaterials_id=lib_hhwallconmaterials.id " + //lib_hhwallconmaterials
        "LEFT JOIN lib_hhwatertenuralstatus ON tbl_household.tbl_watertenuralstatus_id=lib_hhwatertenuralstatus.id " + //lib_hhwatertenuralstatus
        "LEFT JOIN lib_hhlvlwatersystem ON tbl_household.tbl_hhlvlwatersystem_id=lib_hhlvlwatersystem.id " + //lib_hhlvlwatersystem
        "LEFT JOIN lib_hhevacuationarea ON tbl_household.tbl_evacuation_areas_id=lib_hhevacuationarea.id " + //lib_hhevacuationarea
        "WHERE tbl_enumerator_id_fk = ? ";

      if (data.tbl_respondent)
        query += " AND tbl_respondent LIKE '%" + data.tbl_respondent + "%'";
      if (data.tbl_psgc_mun_id)
        query += " AND tbl_psgc_mun_id = '" + data.tbl_psgc_mun_id.id + "'";
      if (data.tbl_psgc_brgy_id)
        query += " AND tbl_psgc_brgy_id = '" + data.tbl_psgc_brgy_id.id + "'";
      if (data.tbl_householdpuroksittio)
        query +=
          " AND tbl_householdpuroksittio = '" +
          data.tbl_householdpuroksittio +
          "'";
      if (data.lib_typeofbuilding_id)
        query +=
          " AND lib_typeofbuilding_id = " + data.lib_typeofbuilding_id.id;
      if (data.tbl_tenuralstatus_id)
        query += " AND tbl_tenuralstatus_id = " + data.tbl_tenuralstatus_id.id;
      if (data.tbl_hhyearconstruct)
        query +=
          " AND tbl_hhyearconstruct = '" + data.tbl_hhyearconstruct + "'";
      if (data.tbl_hhecost) query += " AND tbl_hhecost = " + data.tbl_hhecost;
      if (data.tbl_hhnobedroms)
        query += " AND tbl_hhnobedroms = " + data.tbl_hhnobedroms;
      if (data.tbl_hhnostorey)
        query += " AND tbl_hhnostorey = " + data.tbl_hhnostorey;
      if (data.tbl_hhaelectricity) {
        data.tbl_hhaelectricity == true
          ? (query += " AND tbl_hhaelectricity = 1")
          : (query += " AND tbl_hhaelectricity = 0");
      }
      if (data.tbl_hhainternet) {
        data.tbl_hhainternet == true
          ? (query += " AND tbl_hhainternet = 1")
          : (query += " AND tbl_hhainternet = 0");
      }
      if (data.tbl_typeofconmaterials_id)
        query +=
          " AND tbl_typeofconmaterials_id = " +
          data.tbl_typeofconmaterials_id.id;
      if (data.tbl_wallconmaterials_id)
        query +=
          " AND tbl_wallconmaterials_id = " + data.tbl_wallconmaterials_id.id;
      if (data.tbl_hhaccesswater) {
        data.tbl_hhaccesswater == true
          ? (query += " AND tbl_hhaccesswater = 1")
          : (query += " AND tbl_hhaccesswater = 0");
      }
      if (data.tbl_hhwaterpotable) {
        data.tbl_hhwaterpotable == true
          ? (query += " AND tbl_hhwaterpotable = 1")
          : (query += " AND tbl_hhwaterpotable = 0");
      }
      if (data.tbl_watertenuralstatus_id)
        query +=
          " AND tbl_watertenuralstatus_id = " +
          data.tbl_watertenuralstatus_id.id;
      if (data.tbl_hhlvlwatersystem_id)
        query +=
          " AND tbl_hhlvlwatersystem_id = " + data.tbl_hhlvlwatersystem_id.id;
      if (data.tbl_evacuation_areas_id)
        query +=
          " AND tbl_evacuation_areas_id = " + data.tbl_evacuation_areas_id.id;

      db.transaction(
        (tx) => {
          tx.executeSql(
            query,
            [user.idtbl_enumerator],
            (_, { rows: { _array } }) => {
              setMarkers(_array);
              setRespondents(_array);
            }
          );
        },
        (error) => {
          Alert.alert(
            "SQLITE ERROR",
            "Error loading Household data, Please contact developer, " + error,
            [
              {
                text: "OK",
              },
            ]
          );
        }
      );
    } catch (error) {
      logger.log(new Error(error));
      setModalSearch(false);
    }

    _map.current.fitToSuppliedMarkers(["mk1"], {
      edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
      animated: false,
    });
    setModalSearch(false);
  };

  const exportcsv = async () => {
    let data = filter;

    try {
      let query =
        "SELECT tbl_household.tbl_household_id," +
        "tbl_hhissethead," +
        "tbl_hhcontrolnumber," +
        "tbl_hhdateinterview," +
        "tbl_hhlatitude," +
        "tbl_hhlongitude," +
        "tbl_hhfield_editor," +
        "tbl_hhyearconstruct," +
        "tbl_hhyearconstruct," +
        "tbl_hhyearconstruct," +
        "tbl_hhnobedroms," +
        "tbl_hhnostorey," +
        "tbl_hhaelectricity," +
        "tbl_hhainternet," +
        "tbl_hhainternet," +
        "tbl_enumerator_id_fk," +
        "tbl_psgc_brgy_id," +
        "tbl_psgc_mun_id," +
        "tbl_psgc_pro_id," +
        "lib_typeofbuilding_id," +
        "tbl_hhecost," +
        "tbl_tenuralstatus_id," +
        "tbl_typeofconmaterials_id," +
        "tbl_wallconmaterials_id," +
        "tbl_hhaccesswater," +
        "tbl_hhwaterpotable," +
        "tbl_watertenuralstatus_id," +
        "tbl_hhlvlwatersystem_id," +
        "tbl_evacuation_areas_id," +
        "tbl_hhhasaccesshealtmedicalfacility," +
        "tbl_hhhasaccesshealtmedicalfacility," +
        "tbl_hhhasaccesstelecom," +
        "tbl_hasaccessdrillsandsimulations," +
        "tbl_household.created_at," +
        "tbl_household.updated_at," +
        "tbl_household.created_by," +
        "tbl_household.updatedy_by," +
        "tbl_householdpuroksittio," +
        "tbl_hhimage," +
        "tbl_respondent," +
        "tbl_uri," +
        "idtbl_psgc_brgy," + //tbl_psgc_brgy
        "tbl_psgc_brgyname," +
        "tbl_psgc_mun_id_fk," +
        "idtbl_psgc_mun," + //tbl_psgc_municipality
        "tbl_psgc_munname," +
        "tbl_psgc_prov_id_fk," +
        "idtbl_psgc_prov," + //tbl_psgc_prov
        "tbl_psgc_provname," +
        "tbl_psgc_region_id_fk," +
        "idtbl_enumerator," + //tbl_enumerator
        "tbl_enumeratorfname," +
        "tbl_enumeratorlname," +
        "tbl_enumeratormname," +
        "tbl_enumeratoremail," +
        "tbl_enumeratorcontact," +
        "tbl_enumeratorprov," +
        "tbl_enumeratormun," +
        "tbl_enumeratorbrgy," +
        "tbl_imagepath," +
        "lib_buildingtypedesc," + //lib_hhtypeofbuilding
        "lib_tenuralstatusdesc," + //lib_hhtenuralstatus
        "lib_roofmaterialsdesc," + //lib_hhroofmaterials
        "lib_wallmaterialsdesc," + //lib_hhwallconmaterials
        "lib_wtdesc," + //lib_hhwatertenuralstatus
        "lib_hhwatersystemlvl," + //lib_hhlvlwatersystem
        "lib_hhlvldesc," +
        "lib_heaname," + //lib_hhevacuationarea
        "tbl_fname," + //tbl_hhdemography
        "tbl_lname," +
        "tbl_mname," +
        "tbl_extension," +
        "tbl_ishead," +
        "lib_familybelongs_id," +
        "lib_gender_id," + //tbl_hhdemography->lib_gender
        "lib_gname," +
        "tbl_relationshiphead_id," + //tbl_hhdemography->libl_relationshiphead
        "lib_rhname," +
        "tbl_datebirth," +
        "lib_maritalstatus_id," + //lib_maritalstatus
        "lib_msname " + //lib_maritalstatus
        "FROM tbl_household " +
        "LEFT JOIN tbl_psgc_brgy ON tbl_household.tbl_psgc_brgy_id=tbl_psgc_brgy.idtbl_psgc_brgy " + //tbl_psgc_brgy
        "LEFT JOIN tbl_psgc_mun ON tbl_household.tbl_psgc_mun_id=tbl_psgc_mun.idtbl_psgc_mun " + //tbl_psgc_municipality
        "LEFT JOIN tbl_psgc_prov ON tbl_household.tbl_psgc_pro_id=tbl_psgc_prov.idtbl_psgc_prov " + //tbl_psgc_prov
        "LEFT JOIN tbl_enumerator ON tbl_household.tbl_enumerator_id_fk=tbl_enumerator.idtbl_enumerator " + //tbl_enumerator
        "LEFT JOIN lib_hhtypeofbuilding ON tbl_household.lib_typeofbuilding_id=lib_hhtypeofbuilding.id " + //lib_hhtypeofbuilding
        "LEFT JOIN lib_hhtenuralstatus ON tbl_household.tbl_tenuralstatus_id=lib_hhtenuralstatus.id " + //lib_hhtenuralstatus
        "LEFT JOIN lib_hhroofmaterials ON tbl_household.tbl_typeofconmaterials_id=lib_hhroofmaterials.id " + //lib_hhroofmaterials
        "LEFT JOIN lib_hhwallconmaterials ON tbl_household.tbl_wallconmaterials_id=lib_hhwallconmaterials.id " + //lib_hhwallconmaterials
        "LEFT JOIN lib_hhwatertenuralstatus ON tbl_household.tbl_watertenuralstatus_id=lib_hhwatertenuralstatus.id " + //lib_hhwatertenuralstatus
        "LEFT JOIN lib_hhlvlwatersystem ON tbl_household.tbl_hhlvlwatersystem_id=lib_hhlvlwatersystem.id " + //lib_hhlvlwatersystem
        "LEFT JOIN lib_hhevacuationarea ON tbl_household.tbl_evacuation_areas_id=lib_hhevacuationarea.id " + //lib_hhevacuationarea
        "INNER JOIN tbl_hhdemography ON tbl_household.tbl_household_id=tbl_hhdemography.tbl_household_id " + //tbl_hhdemography
        "LEFT JOIN lib_gender ON tbl_hhdemography.lib_gender_id=lib_gender.id " + //tbl_hhdemography->lib_gender
        "LEFT JOIN libl_relationshiphead ON tbl_hhdemography.tbl_relationshiphead_id=libl_relationshiphead.id " + //tbl_hhdemography->libl_relationshiphead
        "LEFT JOIN lib_maritalstatus ON tbl_hhdemography.lib_maritalstatus_id=lib_maritalstatus.id " + //tbl_hhdemography->lib_maritalstatus
        "WHERE tbl_enumerator_id_fk = ? ";

      if (data.tbl_respondent)
        query += " AND tbl_respondent LIKE '%" + data.tbl_respondent + "%'";
      if (data.tbl_psgc_mun_id)
        query += " AND tbl_psgc_mun_id = '" + data.tbl_psgc_mun_id.id + "'";
      if (data.tbl_psgc_brgy_id)
        query += " AND tbl_psgc_brgy_id = '" + data.tbl_psgc_brgy_id.id + "'";
      if (data.tbl_householdpuroksittio)
        query +=
          " AND tbl_householdpuroksittio = '" +
          data.tbl_householdpuroksittio +
          "'";
      if (data.lib_typeofbuilding_id)
        query +=
          " AND lib_typeofbuilding_id = " + data.lib_typeofbuilding_id.id;
      if (data.tbl_tenuralstatus_id)
        query += " AND tbl_tenuralstatus_id = " + data.tbl_tenuralstatus_id.id;
      if (data.tbl_hhyearconstruct)
        query +=
          " AND tbl_hhyearconstruct = '" + data.tbl_hhyearconstruct + "'";
      if (data.tbl_hhecost) query += " AND tbl_hhecost = " + data.tbl_hhecost;
      if (data.tbl_hhnobedroms)
        query += " AND tbl_hhnobedroms = " + data.tbl_hhnobedroms;
      if (data.tbl_hhnostorey)
        query += " AND tbl_hhnostorey = " + data.tbl_hhnostorey;
      if (data.tbl_hhaelectricity) {
        data.tbl_hhaelectricity == true
          ? (query += " AND tbl_hhaelectricity = 1")
          : (query += " AND tbl_hhaelectricity = 0");
      }
      if (data.tbl_hhainternet) {
        data.tbl_hhainternet == true
          ? (query += " AND tbl_hhainternet = 1")
          : (query += " AND tbl_hhainternet = 0");
      }
      if (data.tbl_typeofconmaterials_id)
        query +=
          " AND tbl_typeofconmaterials_id = " +
          data.tbl_typeofconmaterials_id.id;
      if (data.tbl_wallconmaterials_id)
        query +=
          " AND tbl_wallconmaterials_id = " + data.tbl_wallconmaterials_id.id;
      if (data.tbl_hhaccesswater) {
        data.tbl_hhaccesswater == true
          ? (query += " AND tbl_hhaccesswater = 1")
          : (query += " AND tbl_hhaccesswater = 0");
      }
      if (data.tbl_hhwaterpotable) {
        data.tbl_hhwaterpotable == true
          ? (query += " AND tbl_hhwaterpotable = 1")
          : (query += " AND tbl_hhwaterpotable = 0");
      }
      if (data.tbl_watertenuralstatus_id)
        query +=
          " AND tbl_watertenuralstatus_id = " +
          data.tbl_watertenuralstatus_id.id;
      if (data.tbl_hhlvlwatersystem_id)
        query +=
          " AND tbl_hhlvlwatersystem_id = " + data.tbl_hhlvlwatersystem_id.id;
      if (data.tbl_evacuation_areas_id)
        query +=
          " AND tbl_evacuation_areas_id = " + data.tbl_evacuation_areas_id.id;

      db.transaction(
        (tx) => {
          tx.executeSql(
            query,
            [user.idtbl_enumerator],
            (_, { rows: { _array } }) => {
              console.log(_array);
            }
          );
        },
        (error) => {
          Alert.alert(
            "SQLITE ERROR",
            "Error loading Household data, Please contact developer, " + error,
            [
              {
                text: "OK",
              },
            ]
          );
        }
      );
    } catch (error) {
      logger.log(new Error(error));
    }

    let rows = [
      ["종목명", "세트번호", "무게", "반복횟수", "휴식시간", "볼륨", "날짜"],
    ];
    let csvContent = "\uFEFF";
    try {
      rows.forEach((rowArray) => {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
      });
    } catch (e) {
      console.log("Error in join" + e);
    }

    try {
      const tempname = "filename";
      const fileUri = FileSystem.documentDirectory + tempname + ".csv";
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: `FileSystem.EncodingType.UTF8`,
      })
        .then(() => {
          download(fileUri);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const download = async (fileUri) => {
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync("Download", asset, false)
      .then(() => {
        Notifications.presentLocalNotificationAsync({
          title: "PDRRMO Profiler",
          body: "Download csv file successfully",
          data: {
            _displayInForeground: true,
          },
        });
      })
      .catch((error) => {
        alert("Error saving image, Error details: " + error);
      });
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        initialRegion={state.region}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        mapType="satellite"
        customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}
        onMapReady={() => {
          _map.current.fitToSuppliedMarkers(["mk1"], {
            edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
            animated: false,
          });
        }}
      >
        {markers.map((marker, index) => {
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale,
              },
            ],
          };
          return (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: parseFloat(marker.tbl_hhlatitude),
                longitude: parseFloat(marker.tbl_hhlongitude),
              }}
              onPress={(e) => onMarkerPress(e)}
              identifier={"mk1"}
            >
              <Animated.View style={[styles.markerWrap]}>
                <Animated.Image
                  source={require("../assets/map_marker.png")}
                  style={[styles.marker, scaleStyle]}
                  resizeMode="cover"
                />
              </Animated.View>
            </MapView.Marker>
          );
        })}
      </MapView>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search here"
          placeholderTextColor="#000"
          autoCapitalize="none"
          style={{ flex: 1, padding: 0 }}
          onChangeText={(text) => setSearch(text)}
        />
        <TouchableHighlight
          onPress={() => {
            handleSearch(search);
          }}
        >
          <Ionicons name="ios-search" size={20} />
        </TouchableHighlight>
      </View>
      <TouchableOpacity
        onPress={() => {
          //downloadCSV();
          exportcsv();
        }}
        style={styles.fab}
      >
        <MaterialCommunityIcons name="cloud-download" style={styles.fabIcon} />
      </TouchableOpacity>
      <ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        height={50}
        style={styles.chipsScrollView}
        contentInset={{
          // iOS only
          top: 0,
          left: 0,
          bottom: 0,
          right: 20,
        }}
        contentContainerStyle={{
          paddingRight: Platform.OS === "android" ? 20 : 0,
        }}
      >
        <TouchableOpacity
          style={styles.chipsItem}
          onPress={() => {
            setModalSearch(true);
          }}
        >
          <Text>Advance Search</Text>
        </TouchableOpacity>
        {dateInterviews.map((dateInterview, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chipsItem}
            onPress={() => {
              fetchHousehold(dateInterview.tbl_hhdateinterview);
            }}
          >
            <Text>{dateInterview.tbl_hhdateinterview}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal:
            Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
      >
        {markers.map((marker, index) => (
          <View style={styles.card} key={index}>
            <Image
              source={
                marker.tbl_hhimage === ""
                  ? require("../assets/no-image.jpg")
                  : {
                      uri:
                        "file:///storage/emulated/0/PDRRMOProfiler/" +
                        marker.tbl_hhimage,
                    }
              }
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.cardtitle}>
                {marker.tbl_respondent}
              </Text>
              <Text numberOfLines={1} style={styles.cardDescription}>
                {marker.tbl_psgc_brgyname +
                  " " +
                  marker.tbl_psgc_munname +
                  " " +
                  marker.tbl_psgc_provname}
              </Text>
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => {
                    moreInformation(marker);
                  }}
                  style={[
                    styles.signIn,
                    {
                      borderColor: "#FF6347",
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: "#FF6347",
                      },
                    ]}
                  >
                    More Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      <Modal animationType="slide" transparent={true} visible={modalSearch}>
        <View style={styles.modalView}>
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontWeight: "bold", color: colors.pdark }}>
              ADVANCED SEARCH
            </Text>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: -20,
                right: 0,
                backgroundColor: "transparent",
              }}
              onPress={() => setModalSearch(false)}
            >
              <MaterialCommunityIcons
                name="close-circle"
                style={{ color: colors.danger, fontSize: 40 }}
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Form
              initialValues={{}}
              onSubmit={(values) => {
                handleAdvanceSearch(values);
              }}
            >
              <FormField
                autoCorrect={false}
                icon="account"
                name="tbl_respondent"
                placeholder="Respondent Name"
              />

              <AddressPicker
                icon="earth"
                items={mun}
                name="tbl_psgc_mun_id"
                PickerItemComponent={PickerItem}
                placeholder="Municipality"
                setBrgy={handleMunChange}
                searchable
              />

              <AddressPicker
                icon="earth"
                items={brgy}
                name="tbl_psgc_brgy_id"
                PickerItemComponent={PickerItem}
                placeholder="Barangay"
                setbrgyValue
                searchable
              />

              <FormField
                autoCorrect={false}
                icon="earth"
                name="tbl_householdpuroksittio"
                placeholder="Purok/Sitio"
                width="70%"
              />

              <Picker
                icon="warehouse"
                items={typebuilding}
                name="lib_typeofbuilding_id"
                PickerItemComponent={PickerItem}
                placeholder="Type of building"
              />

              <Picker
                icon="alpha-t-box"
                items={tenuralStatus}
                name="tbl_tenuralstatus_id"
                PickerItemComponent={PickerItem}
                placeholder="Tenural Status"
              />

              <FormField
                autoCorrect={false}
                name="tbl_hhyearconstruct"
                icon="calendar"
                placeholder="Year construct"
                width="75%"
                keyboardType="number-pad"
              />

              <FormField
                autoCorrect={false}
                icon="cash"
                name="tbl_hhecost"
                placeholder="Estimated cost"
                width="75%"
                keyboardType="number-pad"
              />

              <FormField
                autoCorrect={false}
                icon="bed-empty"
                name="tbl_hhnobedroms"
                placeholder="Number of bedrooms"
                width="75%"
                keyboardType="number-pad"
              />

              <FormField
                autoCorrect={false}
                icon="office-building"
                name="tbl_hhnostorey"
                placeholder="Number of storeys"
                width="75%"
                keyboardType="number-pad"
              />

              <SwitchInput
                icon="electric-switch"
                name="tbl_hhaelectricity"
                placeholder="Access to electricity"
              />

              <SwitchInput
                icon="internet-explorer"
                name="tbl_hhainternet"
                placeholder="Access to internet"
              />

              <Picker
                icon="material-ui"
                items={roofmaterials}
                name="tbl_typeofconmaterials_id"
                PickerItemComponent={PickerItem}
                placeholder="Roof material"
              />

              <Picker
                icon="wall"
                items={wallmaterials}
                name="tbl_wallconmaterials_id"
                PickerItemComponent={PickerItem}
                placeholder="Wall material"
              />

              <SwitchInput
                icon="water-pump"
                name="tbl_hhaccesswater"
                placeholder="Access to Water"
              />

              <SwitchInput
                icon="water"
                name="tbl_hhwaterpotable"
                placeholder="Water is potable"
              />

              <Picker
                icon="infinity"
                items={watertenuralstatus}
                name="tbl_watertenuralstatus_id"
                PickerItemComponent={PickerItem}
                placeholder="Water tenural status"
              />

              <Picker
                icon="cup-water"
                items={lvlwatersystem}
                name="tbl_hhlvlwatersystem_id"
                PickerItemComponent={PickerItem}
                placeholder="Level of water"
              />

              <Picker
                icon="home-flood"
                items={evacuationarea}
                name="tbl_evacuation_areas_id"
                PickerItemComponent={PickerItem}
                placeholder="Evacuation center location"
              />

              <SubmitButton title="Search" />
            </Form>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignContent: "space-between",
                marginBottom: 15,
                marginTop: 15,
              }}
            ></View>
          </ScrollView>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <ScrollView>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={{ fontWeight: "bold" }}>Respondent</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_respondent ? moreinfo.tbl_respondent : ""}
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
                  {moreinfo.tbl_psgc_brgyname ? moreinfo.tbl_psgc_brgyname : ""}{" "}
                  {moreinfo.tbl_psgc_munname ? moreinfo.tbl_psgc_munname : ""}{" "}
                  {moreinfo.tbl_psgc_provname ? moreinfo.tbl_psgc_provname : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Control Number</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhcontrolnumber
                    ? moreinfo.tbl_hhcontrolnumber
                    : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Coordinates</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {"Lat: "}
                  {moreinfo.tbl_hhlatitude ? moreinfo.tbl_hhlatitude : ""}
                  {"\n"}
                  {"Lng: "}
                  {moreinfo.tbl_hhlongitude ? moreinfo.tbl_hhlongitude : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Date of Interview</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhdateinterview
                    ? moreinfo.tbl_hhdateinterview
                    : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Enumarator</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_enumeratorlname
                    ? moreinfo.tbl_enumeratorlname
                    : ""}{" "}
                  {moreinfo.tbl_enumeratorfname
                    ? moreinfo.tbl_enumeratorfname
                    : ""}{" "}
                  {moreinfo.tbl_enumeratormname
                    ? moreinfo.tbl_enumeratormname
                    : ""}{" "}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Type of Building</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.lib_buildingtypedesc
                    ? moreinfo.lib_buildingtypedesc
                    : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Tenural status</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.lib_tenuralstatusdesc
                    ? moreinfo.lib_tenuralstatusdesc
                    : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Year constructed</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhyearconstruct
                    ? moreinfo.tbl_hhyearconstruct
                    : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>
                  Estimated construction cost
                </Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhecost ? moreinfo.tbl_hhecost : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Number of bedrooms</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhnobedroms ? moreinfo.tbl_hhnobedroms : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Number of storeys</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhnostorey ? moreinfo.tbl_hhnostorey : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>
                  Access to electricity
                </Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhaelectricity == 1 ? "Yes" : "No"}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Access to Internet</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhainternet == 1 ? "Yes" : "No"}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Roof materials</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.lib_roofmaterialsdesc
                    ? moreinfo.lib_roofmaterialsdesc
                    : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Wall materials</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.lib_wallmaterialsdesc
                    ? moreinfo.lib_wallmaterialsdesc
                    : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>
                  Access to water supply
                </Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhaccesswater == 1 ? "Yes" : "No"}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Water is potable</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhwaterpotable == 1 ? "Yes" : "No"}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>
                  Tenural status of water
                </Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.lib_wtdesc ? moreinfo.lib_wtdesc : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Level of water</Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.lib_hhlvldesc ? moreinfo.lib_hhlvldesc : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>
                  Location of evacuation area
                </Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.lib_heaname ? moreinfo.lib_heaname : ""}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>
                  Acces to health and medical facilities?
                </Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhhasaccesshealtmedicalfacility == 1
                    ? "Yes"
                    : "No"}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>
                  Acces to telecommunications?
                </Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hhhasaccesstelecom == 1 ? "Yes" : "No"}
                </Text>
              </View>
            </View>
            <View style={styles.moreInfoTable}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>
                  Acces to drills and simulations?
                </Text>
              </View>
              <View style={styles.moreInforData}>
                <Text style={styles.moreInforDataTxt}>
                  {moreinfo.tbl_hasaccessdrillsandsimulations == 1
                    ? "Yes"
                    : "No"}
                </Text>
              </View>
            </View>

            <View style={(styles.moreInfoTable, styles.relatedInfo)}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Availed program</Text>
              </View>
              <View style={styles.moreInforData}>
                {programs.map((program, index) => (
                  <TouchableHighlight
                    style={{
                      flex: 1,
                    }}
                    key={index}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      navigation.navigate("Program", {
                        id: moreinfo.tbl_household_id,
                        program: program,
                        addmore: false,
                        update: true,
                      });
                    }}
                  >
                    <Text style={{ color: "blue" }}>{program.lib_topname}</Text>
                  </TouchableHighlight>
                ))}
                <TouchableHighlight
                  style={{
                    flex: 1,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate("Program", {
                      id: moreinfo.tbl_household_id,
                      addmore: true,
                      update: false,
                    });
                  }}
                >
                  <Text style={{ ...styles.moreInforDataTxt, color: "red" }}>
                    Add more....
                  </Text>
                </TouchableHighlight>
              </View>
            </View>

            <View style={(styles.moreInfoTable, styles.relatedInfo)}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Demography</Text>
              </View>
              <View style={styles.moreInforData}>
                {demographys.map((demography, index) => (
                  <TouchableHighlight
                    style={{
                      flex: 1,
                    }}
                    key={index}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      navigation.navigate("Demography", {
                        id: moreinfo.tbl_household_id,
                        memberinfo: demography,
                        update: true,
                        addmore: false,
                        new: false,
                      });
                    }}
                  >
                    <Text style={{ color: "blue" }}>
                      {demography.tbl_fname} {demography.tbl_lname}{" "}
                      {demography.tbl_mname}{" "}
                      {demography.tbl_relationshiphead_id == 1 ? "(Head)" : ""}
                    </Text>
                  </TouchableHighlight>
                ))}
                <TouchableHighlight
                  style={{
                    flex: 1,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate("Demography", {
                      id: moreinfo.tbl_household_id,
                      addmore: true,
                      update: false,
                      new: false,
                    });
                  }}
                >
                  <Text style={{ ...styles.moreInforDataTxt, color: "red" }}>
                    Add more....
                  </Text>
                </TouchableHighlight>
              </View>
            </View>

            <View style={(styles.moreInfoTable, styles.relatedInfo)}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Livelihood</Text>
              </View>
              <View style={styles.moreInforData}>
                {livelihoods.map((livelihood, index) => (
                  <TouchableHighlight
                    style={{
                      flex: 1,
                    }}
                    key={index}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      navigation.navigate("Livelihood", {
                        id: moreinfo.tbl_household_id,
                        hhlivelihood: livelihood,
                        update: true,
                        addmore: false,
                        new: false,
                      });
                    }}
                  >
                    <Text style={{ color: "blue" }}>
                      {livelihood.tbl_livelihoodproducts}
                    </Text>
                  </TouchableHighlight>
                ))}
                <TouchableHighlight
                  style={{
                    flex: 1,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate("Livelihood", {
                      id: moreinfo.tbl_household_id,
                      addmore: true,
                      update: false,
                      new: false,
                    });
                  }}
                >
                  <Text style={{ ...styles.moreInforDataTxt, color: "red" }}>
                    Add more....
                  </Text>
                </TouchableHighlight>
              </View>
            </View>

            <View style={(styles.moreInfoTable, styles.relatedInfo)}>
              <View style={styles.moreInfolabel}>
                <Text style={styles.moreInfolabeltxt}>Picture</Text>
              </View>
              <View style={styles.moreInforData}>
                <TouchableHighlight
                  style={{
                    flex: 1,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate("AddImage", {
                      id: moreinfo.tbl_household_id,
                      new: false,
                      addmore: false,
                      update: true,
                    });
                  }}
                >
                  <Image
                    source={{
                      uri:
                        "file:///storage/emulated/0/PDRRMOProfiler/" +
                        moreinfo.tbl_hhimage,
                    }}
                    // style={styles.cardImage}
                    resizeMode="cover"
                  />
                </TouchableHighlight>

                <TouchableHighlight
                  style={{
                    flex: 1,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate("AddImage", {
                      id: moreinfo.tbl_household_id,
                      addmore: false,
                      update: true,
                      new: false,
                    });
                  }}
                >
                  <Text style={{ ...styles.moreInforDataTxt, color: "red" }}>
                    Update Picture....{" ("}
                    {moreinfo.tbl_hhimage}
                    {")"}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignContent: "space-between",
                marginBottom: 15,
                marginTop: 15,
              }}
            >
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: "gold",
                  marginTop: 15,
                  flex: 1,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate("Profiler", {
                    id: moreinfo.tbl_household_id,
                    hhinfo: household,
                    update: true,
                  });
                }}
              >
                <Text style={styles.textStyle}>Update</Text>
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
                }}
              >
                <Text style={styles.textStyle}>Close Information</Text>
              </TouchableHighlight>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: "absolute",
    marginTop: Constants.statusBarHeight + 5,
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 80,
    paddingHorizontal: 10,
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: "center",
    marginTop: 5,
  },
  signIn: {
    width: "100%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalView: {
    backgroundColor: "white",
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
  relatedInfo: {
    borderColor: "black",
    borderStyle: "dotted",
    borderWidth: 2,
    borderRadius: 1,
    padding: 5,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    //elevation: 8,
    zIndex: 1,
  },
  fabIcon: {
    fontSize: 40,
    color: "white",
  },
});

export default AnimatedScreen;
