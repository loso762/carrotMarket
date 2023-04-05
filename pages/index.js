import { ProductContextProvider } from "@/components/context";
import React,{useContext} from "react";
import ProductContext from "@/components/context";
import FooterMenu from "@/components/main/FooterMenu";
import Mypage from "@/components/main/mypage";
import Login from "@/components/main/login"

function Index() {
  const { isLoggedIn } = useContext(ProductContext);
  return (
    <>
      {
        isLoggedIn ? <Mypage /> : <Login />
      }
      <FooterMenu />
    </>
  );
}

export default Index;
