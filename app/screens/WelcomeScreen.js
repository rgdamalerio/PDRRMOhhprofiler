import React from "react";
import { View, StyleSheet, ImageBackground, Image, Text } from "react-native";

import Button from "../components/Button";

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={2}
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={require("../assets/logo.png")}
        />
        <Text style={styles.tagline}>Comprehensive Information System</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title="Login"
          color="pdark"
          onPress={() => navigation.navigate("Login")}
        />
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 180,
    height: 180,
    //alignSelf: "center",
    //marginBottom: -100,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  tagline: {
    fontSize: 22,
    fontWeight: "800",
    paddingVertical: 2, //100
    //textAlign: "center",
    //marginBottom: 50,
  },
});

export default WelcomeScreen;
