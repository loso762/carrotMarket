import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import UserContext from "../user-context";

function Mypage(props) {
  const { loginDisplayName, loginTemp, setIsLoggedIn } =
    useContext(UserContext);

  const handleLogout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <div>
      <p>Welcome, {loginDisplayName}!</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default Mypage;
