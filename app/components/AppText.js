import React from "react";
import { Text } from "react-native";

import defaultStyles from "../config/styles";

function AppText({ children, style, onPress }) {
  return (
    <Text style={[defaultStyles.text, style]} onPress={onPress}>
      {children}
    </Text>
  );
}

export default AppText;
