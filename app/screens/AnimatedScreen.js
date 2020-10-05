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
import * as SQLite from "expo-sqlite";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

import { mapDarkStyle, mapStandardStyle } from "../model/mapData";
import useAuth from "../auth/useAuth";

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
  const [moreinfo, setMoreinfo] = React.useState([]);
  const [programs, setPrograms] = React.useState([]);
  const [household, setHousehold] = React.useState([]);
  const [demographys, setDemographys] = React.useState([]);
  const [livelihoods, setLivelihoods] = React.useState([]);

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchHousehold();
  }, []);

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
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const fetchHousehold = () => {
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
            "where tbl_enumerator_id_fk = ?",
          [user.idtbl_enumerator],
          (_, { rows: { _array } }) => {
            setMarkers(_array);
            setRespondents(_array);
          }
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
        {/*state.categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.chipsItem}>
            {category.icon}
            <Text>{category.name}</Text>
          </TouchableOpacity>
        ))*/}
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
});

export default AnimatedScreen;
