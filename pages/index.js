import { ProductContextProvider } from "@/components/context/product-context";
import React, { useContext } from "react";
import FooterMenu from "@/components/layout/FooterMenu";
import Mypage from "@/components/main/mypage";
import Login from "@/components/main/login";
import UserContext from "@/components/context/user-context";

function Index() {
  const { isLoggedIn } = useContext(UserContext);
  return (
    <>
      {isLoggedIn ? <Mypage /> : <Login />}
      <FooterMenu />
    </>
  );
}

export default Index;
