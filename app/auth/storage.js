import * as SecureStore from "expo-secure-store";

const key = "userInfor";

const storeUserinfo = async (userInfo) => {
  try {
    await SecureStore.setItemAsync(key, userInfo);
  } catch (error) {
    console.log("Error storing the user information", error);
  }
};

const getUserinfo = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log("Error geting the user information", Error);
  }
};

const getUser = async () => {
  const user = await getUserinfo();
  return user ? JSON.parse(user) : null;
};

const removeUserinfo = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("Error removing the auth token", error);
  }
};

export default { getUserinfo, getUser, removeUserinfo, storeUserinfo };
