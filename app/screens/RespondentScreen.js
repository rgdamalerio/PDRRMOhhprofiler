import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SearchBar } from "react-native-elements";

import Screen from "../components/Screen";
import {
  ListItem,
  ListItemUpdateAction,
  ListItemSeparator,
} from "../components/lists";

const initialRespondents = [
  {
    id: 1,
    title: "Jeremy Bacquial",
    description: "Panaytayon R.T.R Agusan del norte",
    image: require("../assets/house1.jpg"),
  },
  {
    id: 2,
    title: "Kirby Balaba",
    description: "Balang-balang R.T.R Agusan del norte",
    image: require("../assets/house2.jpg"),
  },
];

const originalRespondents = initialRespondents;

function RespondentScreen() {
  const [messages, setMessages] = useState(initialRespondents);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const handleUpdate = (message) => {
    // Update the respondent information from respondent list
    setMessages(messages.filter((m) => m.id !== message.id));
  };

  return (
    <Screen>
      <SearchBar
        placeholder="Search Here"
        lightTheme
        onChangeText={(text) => {
          setSearch(text);
          const newData = messages.filter((item) => {
            const itemData = `${item.title.toUpperCase()}   
            ${item.title.toUpperCase()} ${item.description.toUpperCase()}`;

            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setMessages(text === "" ? originalRespondents : newData);
        }}
        autoCorrect={false}
        value={search}
      />
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.description}
            image={item.image}
            onPress={() => console.log("Message selected", item)}
            renderRightActions={() => (
              <ListItemUpdateAction onPress={() => handleUpdate(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={() => {
          setMessages([
            {
              id: 2,
              title: "T2",
              description: "D2",
              image: require("../assets/house2.jpg"),
            },
          ]);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default RespondentScreen;
