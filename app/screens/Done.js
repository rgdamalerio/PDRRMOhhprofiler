import React, { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import LottieView from "lottie-react-native";

import colors from "../config/colors";

function Done({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  return (
    <Modal visible={loading}>
      <View style={styles.container}>
        <LottieView
          autoPlay
          loop={false}
          onAnimationFinish={() => {
            setTimeout(function () {
              setLoading(false);
              navigation.navigate(route.params.screen);
            }, 1000);
          }}
          source={require("../assets/animations/done.json")}
          style={styles.animation}
        />
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  animation: {
    width: 150,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
export default Done;
