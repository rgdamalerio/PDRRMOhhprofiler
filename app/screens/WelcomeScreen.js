import React from "react";
import { View, StyleSheet, ImageBackground, Image, Text } from "react-native";

import colors from "../config/colors";
import Button from "../components/Button";

function WelcomeScreen(props) {
  return (
    <ImageBackground
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
        <Button title="Login" />
        <Button title="Register" color="secondary" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    opacity: 5,
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    //marginTop: 30,
    marginBottom: -100,
  },
  loginButton: {
    width: "100%",
    height: 70,
    backgroundColor: colors.primary,
  },
  tagline: {
    fontSize: 22,
    fontWeight: "800",
    paddingVertical: 100,
    textAlign: "center",
    marginBottom: 50,
  },
});

export default WelcomeScreen;
