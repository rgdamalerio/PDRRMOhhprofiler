import React from "react";
import { useFormikContext } from "formik";

import AddressPicker from "../AddressPicker";
import ErrorMessage from "./ErrorMessage";

function FormAddressPicker({
  icon,
  items,
  name,
  numberOfColumns,
  PickerItemComponent,
  placeholder,
  width,
  searchable,
  setMun,
  setBrgy,
  setbrgyValue,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <AddressPicker
        icon={icon}
        items={items}
        numberOfColumns={numberOfColumns}
        onSelectItem={(item) => setFieldValue(name, item)} //console.log(item)
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values[name]}
        width={width}
        searchable={searchable}
        setMun={setMun}
        setBrgy={setBrgy}
        setbrgyValue={setbrgyValue}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default FormAddressPicker;
