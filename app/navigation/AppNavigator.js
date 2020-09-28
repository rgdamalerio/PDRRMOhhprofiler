import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import Profiler from "../screens/ProfilerScreen";
import Household from "../screens/HouseholdScreen";
import Animated from "../screens/AnimatedScreen";
import Program from "../screens/AddProgramScreen";
import Demography from "../screens/AddDemographyScreen";
import Livelihood from "../screens/AddLivelihood";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen
      name="Profiler"
      options={{ title: "Add Household profile" }}
      component={Profiler}
    />
    <Stack.Screen
      name="Household"
      options={{ headerShown: false }}
      component={Household}
    />
    <Stack.Screen
      name="AnimatedMap"
      options={{ headerShown: false }}
      component={Animated}
    />
    <Stack.Screen
      name="Program"
      options={{ title: "Add avail program's" }}
      component={Program}
    />
    <Stack.Screen
      name="Demography"
      options={{ title: "Add Demography" }}
      component={Demography}
    />
    <Stack.Screen
      name="Livelihood"
      options={{ title: "Add Livelihood" }}
      component={Livelihood}
    />
  </Stack.Navigator>
);

export default AppNavigator;
