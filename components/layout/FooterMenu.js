import React, {useContext} from "react";
import classes from "./FooterMenu.module.css";
import {AiFillHome, AiOutlineHome} from "react-icons/ai";
import {MdOutlineLocationOn, MdLocationOn} from "react-icons/md";
import {BsChatDots, BsFillChatDotsFill} from "react-icons/bs";
import {CgProfile} from "react-icons/cg";
import {useRouter} from "next/router";
import ProductContext from "../context/product-context";

function FooterMenu() {
  const router = useRouter();
  const {setSelectedCategory} = useContext(ProductContext);

  function clickHomeBtn() {
    router.push("/Main");
    setTimeout(() => {
      setSelectedCategory("카테고리");
    }, 400);
  }

  function clickNearBtn() {
    router.push("/Near");
    setSelectedCategory("Near");
  }

  return (
    <ul className={classes.footer}>
      <li onClick={clickHomeBtn}>{router.route == "/Main" ? <AiFillHome /> : <AiOutlineHome />}홈</li>
      <li onClick={clickNearBtn}>
        {router.route == "/Near" ? <MdLocationOn /> : <MdOutlineLocationOn />}내근처
      </li>
      <li onClick={() => router.push("/Chat")}>
        {router.route == "/Chat" ? <BsFillChatDotsFill /> : <BsChatDots />}
        채팅
      </li>
      <li onClick={() => router.push("/")}>
        <CgProfile />
        나의당근
      </li>
    </ul>
  );
}

export default FooterMenu;
