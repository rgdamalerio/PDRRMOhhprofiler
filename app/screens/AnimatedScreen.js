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
import Fontisto from "react-native-vector-icons/Fontisto";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as SQLite from "expo-sqlite";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";

import { mapDarkStyle, mapStandardStyle } from "../model/mapData";
import useAuth from "../auth/useAuth";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const db = SQLite.openDatabase("hhprofiler.sqlite");

function AnimatedScreen(props) {
  const theme = useTheme();

  const initialMapState = {
    categories: [
      {
        name: "Fastfood Center",
        icon: (
          <MaterialCommunityIcons
            style={styles.chipsIcon}
            name="food-fork-drink"
            size={18}
          />
        ),
      },
      {
        name: "Restaurant",
        icon: (
          <Ionicons name="ios-restaurant" style={styles.chipsIcon} size={18} />
        ),
      },
      {
        name: "Dineouts",
        icon: (
          <Ionicons name="md-restaurant" style={styles.chipsIcon} size={18} />
        ),
      },
      {
        name: "Snacks Corner",
        icon: (
          <MaterialCommunityIcons
            name="food"
            style={styles.chipsIcon}
            size={18}
          />
        ),
      },
      {
        name: "Hotel",
        icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
      },
    ],
    region: {
      latitude: 9.190489360418237,
      latitudeDelta: 2.239664674768459,
      longitude: 125.57549066841602,
      longitudeDelta: 1.365918293595314,
    },
  };

  const [state, setState] = React.useState(initialMapState);
  const [markers, setMarkers] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [moreinfo, setMoreinfo] = React.useState([]);

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
            "lib_hhlvldesc " +
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
          (_, { rows: { _array } }) => setMarkers(_array)
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
    console.log(marker);
    setMoreinfo(marker);
    setModalVisible(true);
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
        />
        <Ionicons name="ios-search" size={20} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: "absolute",
    marginTop: Platform.OS === "ios" ? 40 : 20,
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
    //margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    //alignItems: "center",
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
    //flexDirection: "row",
    //justifyContent: "flex-end",
    //alignContent: "stretch",
    width: "60%",
    padding: 5,
    backgroundColor: "#F194FF",
  },
  moreInforDataTxt: {
    //color: "red",
  },
});

export default AnimatedScreen;
