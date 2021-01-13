import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import Profiler from "../screens/ProfilerScreen";
import Enumeratorlist from "../screens/EnumeratorListScreen";
import Householdlist from "../screens/HouseholdListScreen";
import Updateuser from "../screens/RegisterScreen";
import Animated from "../screens/AnimatedScreen";
import Program from "../screens/AddProgramScreen";
import Demography from "../screens/AddDemographyScreen";
import Livelihood from "../screens/AddLivelihood";
import AddImage from "../screens/AddImage";
import Done from "../screens/Done";

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
      name="Enumeratorlist"
      options={{ title: "List of enumerator" }}
      component={Enumeratorlist}
    />
    <Stack.Screen
      name="Householdlist"
      options={{ title: "List of household" }}
      component={Householdlist}
    />
    <Stack.Screen
      name="Updateuser"
      options={{ title: "Update enumerator info" }}
      component={Updateuser}
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

    <Stack.Screen
      options={{ headerShown: false }}
      name="AddImage"
      component={AddImage}
      //options={{headerLeft: () => null}}
    />

    <Stack.Screen
      options={{ headerShown: false }}
      name="Done"
      component={Done}
    />
  </Stack.Navigator>
);

export default AppNavigator;
