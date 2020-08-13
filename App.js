import React from "react";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

import Respondents from "./app/screens/RespondentScreen";

export default function App() {
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

  return <Respondents />;
}
