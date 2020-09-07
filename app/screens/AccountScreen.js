import React from "react";
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
  },
  {
    title: "Add Respondent",
    icon: {
      name: "account-plus",
      backgroundColor: colors.sblack,
    },
  },
];

function AccountScreen(props) {
  const { user, logOut } = useAuth();

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.tbl_enumeratorfname + " " + user.tbl_enumeratorlname}
          subTitle={user.tbl_enumeratoremail}
          image={
            user.tbl_imagepath == ""
              ? require("../assets/rgd.jpg")
              : {
                  uri:
                    "file:///storage/emulated/0/PDRRMOProfiler/" +
                    user.tbl_imagepath,
                } //require(getProfilePicture(user.tbl_imagepath))
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
