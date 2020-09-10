import React, { useState } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";

const Images = [
  { uri: "https://i.imgur.com/sNam9iJ.jpg" },
  { uri: "https://i.imgur.com/N7rlQYt.jpg" },
  { uri: "https://i.imgur.com/UDrH0wm.jpg" },
  { uri: "https://i.imgur.com/Ka8kNST.jpg" },
];

const markers = [
  {
    coordinate: {
      latitude: 45.524548,
      longitude: -122.6749817,
    },
    title: "Best Place",
    description: "This is the best place in Portland",
    image: Images[0],
  },
  {
    coordinate: {
      latitude: 45.524698,
      longitude: -122.6655507,
    },
    title: "Second Best Place",
    description: "This is the second best place in Portland",
    image: Images[1],
  },
  {
    coordinate: {
      latitude: 45.5230786,
      longitude: -122.6701034,
    },
    title: "Third Best Place",
    description: "This is the third best place in Portland",
    image: Images[2],
  },
  {
    coordinate: {
      latitude: 45.521016,
      longitude: -122.6561917,
    },
    title: "Fourth Best Place",
    description: "This is the fourth best place in Portland",
    image: Images[3],
  },
];

const region = [
  {
    latitude: 45.52220671242907,
    longitude: -122.6653281029795,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,
  },
];

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

function AnimatedScreen(props) {
  const [index, setIndex] = useState(0);
  const [animation, setAnimation] = useState(new Animated.Value(0));

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {},
});

export default AnimatedScreen;
