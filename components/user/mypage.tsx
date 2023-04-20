import React, {useState, useEffect} from "react";
import {auth} from "../firebase";
import Link from "next/link";
import Image from "next/image";
import classes from "./mypage.module.css";
import {BiShoppingBag, BiReceipt, BiHeart, BiChat} from "react-icons/bi";
import {FiSettings} from "react-icons/fi";
import Setting from "./setting";
import {storage} from "../firebase";
import {ref, getDownloadURL} from "firebase/storage";
import {userAction} from "../../store/user-slice";
import {productAction} from "../../store/product-slice";
import {useAppDispatch, useAppSelector} from "../../Hooks/storeHook";

const Mypage: React.FC = () => {
  const dispatch = useAppDispatch();

  const loginID = useAppSelector((state) => state.User.loginID);
  const nickname = useAppSelector((state) => state.User.nickname);

  const [isSetting, setIsSetting] = useState(false);
  const [image, setImage] = useState("/images/profile.jpg");

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(userAction.logout());
  };

  function urlHandler(url: string) {
    setImage(url);
  }

  const imageRef = ref(storage, `profile/${loginID}`);

  useEffect(() => {
    getDownloadURL(imageRef)
      .then((url) => {
        urlHandler(url);
      })
      .catch(() => {
        return;
      });
  }, [image, imageRef]);

  const clickLikeList = () => {
    dispatch(productAction.setCategory("관심목록"));
    sessionStorage.setItem("category", "관심목록");
  };

  const clickSellList = () => {
    dispatch(productAction.setCategory("판매내역"));
    sessionStorage.setItem("category", "판매내역");
  };

  const clickBuyList = () => {
    dispatch(productAction.setCategory("구매내역"));
    sessionStorage.setItem("category", "구매내역");
  };

  return (
    <div className={classes.container}>
      {isSetting ? (
        <Setting image={image} urlHandler={urlHandler} setoff={() => setIsSetting(false)} />
      ) : (
        <>
          <div className={classes.profile}>
            <figure>
              {image && <Image src={image} alt={nickname} width={35} height={35} />}
              <figcaption className={classes.name}>{nickname}</figcaption>
              <FiSettings className={classes.setting} onClick={() => setIsSetting(true)} />
              <button onClick={handleLogout}>로그아웃</button>
            </figure>
          </div>
          <div className={classes.pay}>
            <figure>
              <Image src="/images/pay.png" alt="payPic" width={80} height={45} />
              <figcaption>1,000원</figcaption>
            </figure>
            <button>+충전</button>
            <button>계좌송금</button>
          </div>
          <ul className={classes.menu}>
            나의거래
            <li>
              <Link href="관심목록" onClick={clickLikeList}>
                <BiHeart />
                관심 목록{" "}
              </Link>
            </li>
            <li>
              <Link href="판매내역" onClick={clickSellList}>
                <BiReceipt />
                판매내역
              </Link>
            </li>
            <li>
              <Link href="구매내역" onClick={clickBuyList}>
                <BiShoppingBag />
                구매내역
              </Link>
            </li>
            <li>
              <Link href="Chat">
                <BiChat />
                채팅내역
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default Mypage;
