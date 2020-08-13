import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

import Respondents from "./app/screens/RespondentScreen";

export default function App() {
  /*
  async function openDatabaseIShipWithApp() {
    const internalDbName = "hhprofiler.db"; // Call whatever you want
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
      await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true });
      const asset = Asset.fromModule(
        require("./app/assets/database/hhprofiler.db")
      );
      await FileSystem.downloadAsync(asset.uri, sqlDir + internalDbName);
    }
    this.database = SQLite.openDatabase(internalDbName);
  }

  const db = SQLite.openDatabase("hhprofiler.db");

  console.log(db);
  */
  const [db, setDb] = useState(null);

  const openDatabaseIShipWithApp = async () => {
    const internalDbName = "hhprofiler.db"; // Call whatever you want
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
      await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true });
      const asset = Asset.fromModule(
        require("./app/assets/database/hhprofiler.db")
      );
      await FileSystem.downloadAsync(asset.uri, sqlDir + internalDbName);
    }
    setDb(SQLite.openDatabase("hhprofiler"));
  };

  /*useEffect(() => {
    const db = openDatabaseIShipWithApp();
    //console.log(db);
  }, []);
  */
  return <Respondents />;
}
