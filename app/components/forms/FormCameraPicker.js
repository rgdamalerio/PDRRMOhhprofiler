import React from "react";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import CameraInput from "../CameraInput";

function FormCameraPicker({ name }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const imageUri = values[name];

  const onChangeImage = (uri) => {
    setFieldValue(name, uri);
  };

  return (
    <>
      <CameraInput imageUri={imageUri} onChangeImage={onChangeImage} />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default FormCameraPicker;
