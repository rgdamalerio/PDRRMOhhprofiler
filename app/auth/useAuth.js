import { useContext } from "react";

import AuthContext from "./context";
import authStorage from "./storage";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (userObject) => {
    setUser(userObject);
    authStorage.storeUserinfo(JSON.stringify(userObject));
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeUserinfo();
  };

  return { user, logIn, logOut };
};
