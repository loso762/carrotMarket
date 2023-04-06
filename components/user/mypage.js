import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import UserContext from "../context/user-context";
import Link from "next/link";
import ProductContext from "../context/product-context";

function Mypage(props) {
  const { loginDisplayName, setIsLoggedIn } = useContext(UserContext);
  const { setSelectedCategory } = useContext(ProductContext);

  const handleLogout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <div>
      <p>Welcome, {loginDisplayName}!</p>
      <Link href="likes" onClick={() => setSelectedCategory("관심목록")}>
        관심 목록{" "}
      </Link>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default Mypage;
