import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import Profiler from "../screens/ProfilerScreen";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen
      name="Profiler"
      options={{ title: "Add Household profile" }}
      component={Profiler}
    />
  </Stack.Navigator>
);

export default AppNavigator;
