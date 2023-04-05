import React, { createContext, useState } from "react";

const UserContext = createContext({});
export default UserContext;

export const UserContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDisplayName, setloginDisplayName] = useState("");
  const [loginTemp, setloginTemp] = useState("");

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loginDisplayName,
        setloginDisplayName,
        loginTemp,
        setloginTemp,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
