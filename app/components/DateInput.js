import React, { useState, useEffect } from "react";
import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import defaultStyles from "../config/styles";
import Text from "./Text";

function DateInput({
  datevalue,
  onChangeDate,
  mode,
  display,
  icon,
  width,
  placeholder,
  year,
  month,
  day,
  fullDate,
}) {
  const [date, setDate] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setDate(new Date(1598051730000));
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    onChangeDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <>
      <TouchableOpacity onPress={showDatepicker}>
        <View style={[styles.container, { width }, { marginTop: 20 }]}>
          {icon && (
            <Fontisto
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
          )}
          {datevalue ? (
            <Text style={styles.text}>
              {year && datevalue.getFullYear()}
              {month && datevalue.getMonth()}
              {day && datevalue.getDate()}
              {fullDate &&
                datevalue.getMonth() +
                  "/" +
                  datevalue.getDate() +
                  "/" +
                  datevalue.getFullYear()}
            </Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </View>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display={display}
          onChange={onChange}
        />
      )}
    </>
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
  placeholder: {
    color: defaultStyles.colors.medium,
    flex: 1,
  },
  text: {
    color: defaultStyles.colors.black,
    flex: 1,
  },
});

export default DateInput;
