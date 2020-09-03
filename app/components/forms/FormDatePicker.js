import React from "react";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import DateInput from "../DateInput";

function FormDatePicker({
  name,
  display,
  mode,
  icon,
  placeholder,
  width = "100%",
  year,
  month,
  day,
  fullDate,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const date = values[name];

  const onChangeDate = (dat) => {
    setFieldValue(name, dat);
  };

  return (
    <>
      <DateInput
        datevalue={date}
        onChangeDate={onChangeDate}
        mode={mode}
        display={display}
        icon={icon}
        width={width}
        placeholder={placeholder}
        year={year}
        month={month}
        day={day}
        fullDate={fullDate}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default FormDatePicker;
