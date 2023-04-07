import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import UserContext from "../context/user-context";
import Link from "next/link";
import ProductContext from "../context/product-context";
import classes from "./mypage.module.css";
import { BiShoppingBag, BiReceipt, BiHeart, BiChat } from "react-icons/bi";

function Mypage(props) {
  const { loginDisplayName, setIsLoggedIn } = useContext(UserContext);
  const { setSelectedCategory } = useContext(ProductContext);

  const handleLogout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.profile}>
        <figure>
          <img src="/images/profile.jpg" alt={loginDisplayName} />
          <figcaption className={classes.name}>{loginDisplayName}</figcaption>
          <button onClick={handleLogout}>로그아웃</button>
        </figure>
        <div className={classes.pay}>
          <figure>
            <img src="/images/pay.png" alt="payPic" />
            <figcaption>1,000원</figcaption>
          </figure>
          <button>+충전</button>
          <button>계좌송금</button>
        </div>
      </div>
      <ul className={classes.menu}>
        나의거래
        <li>
          <Link href="likes" onClick={() => setSelectedCategory("관심목록")}>
            <BiHeart />
            관심 목록{" "}
          </Link>
        </li>
        <li>
          <Link href="sell" onClick={() => setSelectedCategory("판매내역")}>
            <BiReceipt />
            판매내역
          </Link>
        </li>
        <li>
          <BiShoppingBag />
          구매내역
        </li>
        <li>
          <Link href="Chat">
            <BiChat />
            채팅내역
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Mypage;
