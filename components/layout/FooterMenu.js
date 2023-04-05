import React, { useContext } from "react";
import Link from "next/link";
import classes from "./FooterMenu.module.css";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { MdOutlineLocationOn, MdLocationOn } from "react-icons/md";
import { BsChatDots, BsFillChatDotsFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/router";
import ProductContext from "../context/product-context";

function FooterMenu(props) {
  const router = useRouter();
  const { setSelectedCategory } = useContext(ProductContext);

  return (
    <ul className={classes.footer}>
      <li onClick={props.searchBoxCancel}>
        <Link href="/Home" onClick={() => setSelectedCategory("카테고리")}>
          {router.route == "/Home" ? <AiFillHome /> : <AiOutlineHome />}
          <p>홈</p>
        </Link>
      </li>
      <li>
        <Link href="/Near" onClick={() => setSelectedCategory("내근처")}>
          {router.route == "/Near" ? <MdLocationOn /> : <MdOutlineLocationOn />}
          <p>내근처</p>
        </Link>
      </li>
      <li>
        <Link href="/Chat">
          {router.route == "/Chat" ? <BsFillChatDotsFill /> : <BsChatDots />}

          <p>채팅</p>
        </Link>
      </li>
      <li>
        <Link href="/">
          <CgProfile />
          <p>나의당근</p>
        </Link>
      </li>
    </ul>
  );
}

export default FooterMenu;
