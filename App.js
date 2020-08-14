import React, { useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

import RegisterScreens from "./app/screens/RegisterScreen";
import RespondentScreen from "./app/screens/RespondentScreen";

async function removeDatabase() {
  const sqlDir = FileSystem.documentDirectory + "SQLite/";
  await FileSystem.deleteAsync(sqlDir + "hhprofiler.db", { idempotent: true });
}

const openDatabaseIShipWithApp = async () => {
  const internalDbName = "hhprofiler.db"; // Call whatever you want
  const sqlDir = FileSystem.documentDirectory + "SQLite/";
  if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
    await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true });
    const asset = Asset.fromModule(
      require("./app/assets/database/hhprofiler.db")
    );
    await FileSystem.downloadAsync(asset.uri, sqlDir + internalDbName)
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log("dir exists");
  }
};

//const db = SQLite.openDatabase("hhprofiler.db");

export default function App() {
  useEffect(() => {
    openDatabaseIShipWithApp();
  }, []);

  removeDatabase();
  /*
  const [items, setItems] = useState(null);

  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM tbl_psgc_prov;", [], (tx, results) => {
      setItems(results);
    });
  });

  //console.log(items);
  */
  return <RegisterScreens />;
}
