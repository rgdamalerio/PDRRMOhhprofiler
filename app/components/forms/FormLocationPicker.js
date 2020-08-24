import React from "react";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import LocationInput from "../LocationInput";

function FormLocationPicker({ name, icon, placeholder, width = "100%" }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const coordinates = values[name];

  const onChangeCoordinates = (loc) => {
    setFieldValue(name, loc);
  };

  return (
    <>
      <LocationInput
        coordinates={coordinates}
        onChangeCoordinates={onChangeCoordinates}
        icon={icon}
        placeholder={placeholder}
        width={width}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default FormLocationPicker;
