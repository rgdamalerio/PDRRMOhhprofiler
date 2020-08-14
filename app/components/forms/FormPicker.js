import React from "react";
import { useFormikContext } from "formik";

import Picker from "../AppPicker";
import ErrorMessage from "./ErrorMessage";

function AppFormPicker({
  icon,
  items,
  name,
  numberOfColumns,
  PickerItemComponent,
  placeholder,
  width,
  searchable,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <Picker
        icon={icon}
        items={items}
        numberOfColumns={numberOfColumns}
        onSelectItem={(item) => setFieldValue(name, item)}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values[name]}
        width={width}
        searchable={searchable}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
