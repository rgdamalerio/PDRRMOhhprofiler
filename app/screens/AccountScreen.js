import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";

const menuItems = [
  {
    title: "My Respondents",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    route: "AnimatedMap",
  },
  {
    title: "Add Respondent",
    icon: {
      name: "account-plus",
      backgroundColor: colors.sblack,
    },
    route: "Profiler",
  },
];

function AccountScreen({ navigation }) {
  const [filename, setFilename] = useState();
  const { user, logOut } = useAuth();

  useEffect(() => {
    if (user.tbl_imagepath != null) {
      const res = user.tbl_imagepath.split("/");
      setFilename(res[res.length - 1]);
    } else setFilename("");
  }, []);

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.tbl_enumeratorfname + " " + user.tbl_enumeratorlname}
          subTitle={user.tbl_enumeratoremail}
          image={
            user.tbl_imagepath === null
              ? require("../assets/user.png")
              : {
                  uri: "file:///storage/emulated/0/PDRRMOProfiler/" + filename,
                }
          }
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.route)}
            />
          )}
        />
      </View>
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor={colors.danger} />}
        onPress={() => logOut()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.slight,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
