import React, { useState } from "react";
import { useFormikContext } from "formik";
import { View, Text, Switch, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import ErrorMessage from "../components/forms/ErrorMessage";

function SwitchInput({
  name,
  icon,
  width = "100%",
  placeholder,
  setAvail,
  initavail,
}) {
  const { setFieldValue, values, errors, touched } = useFormikContext();

  return (
    <View style={[styles.container, { width }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <Text style={[defaultStyles.text, styles.text]}>{placeholder}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#c3fdff" }}
        thumbColor={values[name] ? "#81b0ff" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={(value) => {
          setFieldValue(name, value);
          setAvail ? setAvail(!initavail) : "";
        }}
        value={values[name]}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    color: defaultStyles.colors.medium,
  },
});

export default SwitchInput;
