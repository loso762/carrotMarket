import React, {createContext, useState, useEffect, useContext} from "react";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {firestore} from "../firebase";

const UserContext = createContext({});
export default UserContext;

export const UserContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDisplayName, setloginDisplayName] = useState();
  const [loginTemp, setloginTemp] = useState("");
  const [loginID, setloginID] = useState("");

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loginDisplayName,
        setloginDisplayName,
        loginID,
        setloginID,
        loginTemp,
        setloginTemp,
      }}>
      {props.children}
    </UserContext.Provider>
  );
};
