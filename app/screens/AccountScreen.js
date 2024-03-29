import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import * as FileSystem from "expo-file-system";

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
  /*{
    title: "List Respondent",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.dark,
    },
    route: "Householdlist",
  },*/
];

function AccountScreen({ navigation }) {
  const [filename, setFilename] = useState();
  const { user, logOut } = useAuth();
  const [albumCreated, setAlbumCreated] = React.useState(false);

  useEffect(() => {
    if (user.tbl_imagepath != null) {
      const res = user.tbl_imagepath.split("/");
      setFilename(res[res.length - 1]);
    } else setFilename("");
    checkAlbum();
  }, []);

  const checkAlbum = async () => {
    try {
      FileSystem.getInfoAsync("file:///storage/emulated/0/PDRRMOProfiler/")
        .then((result) => {
          result.exists ? setAlbumCreated(true) : setAlbumCreated(false);
        })
        .catch((error) => {});
    } catch (error) {
      Alert(error);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.tbl_enumeratorfname + " " + user.tbl_enumeratorlname}
          subTitle={user.tbl_enumeratoremail}
          onPress={() => {
            navigation.navigate("Updateuser", { enumerator: user });
          }}
          image={
            user.idtbl_enumerator === 1
              ? require("../assets/rgd.jpg")
              : user.tbl_imagepath === null
              ? require("../assets/user.png")
              : {
                  uri: albumCreated
                    ? "file:///storage/emulated/0/PDRRMOProfiler/" + filename
                    : user.tbl_imagepath,
                }
          }
          chevron
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
              onPress={() =>
                navigation.navigate(item.route, { id: "", update: false })
              }
              chevron
            />
          )}
        />
      </View>
      {user.idtbl_enumerator === 1 && (
        <View style={styles.container}>
          <ListItem
            title="Manage enumerator"
            subTitle="list of enumerator register on this phone"
            onPress={() => {
              navigation.navigate("Enumeratorlist");
            }}
            IconComponent={
              <Icon
                name="format-list-bulleted"
                backgroundColor={colors.primary}
              />
            }
            chevron
          />
        </View>
      )}
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
    marginVertical: 10,
  },
});

export default AccountScreen;
