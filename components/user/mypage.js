import React, {useState, useEffect, useContext} from "react";
import {auth} from "../firebase";
import UserContext from "../context/user-context";
import Link from "next/link";
import Image from "next/image";
import ProductContext from "../context/product-context";
import classes from "./mypage.module.css";
import {BiShoppingBag, BiReceipt, BiHeart, BiChat} from "react-icons/bi";
import {FiSettings, FiCamera} from "react-icons/fi";
import {IoIosArrowBack} from "react-icons/io";
import {storage} from "@/components/firebase";
import {ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
import {ClipLoader} from "react-spinners";

function Mypage(props) {
  const {loginDisplayName, setIsLoggedIn} = useContext(UserContext);
  const {setSelectedCategory} = useContext(ProductContext);

  const [isSetting, setIsSetting] = useState(false);
  const [image, setImage] = useState("/images/profile.jpg");
  const [imageChange, setimageChange] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const imageRef = ref(storage, `profile/${loginDisplayName}`);

  const handleLogout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
  };

  async function ImageHandler(e) {
    setIsLoading(true);
    e.target.files[0] &&
      getDownloadURL(imageRef)
        .then(() => {
          deleteObject(imageRef).then(() => {
            uploadBytes(imageRef, e.target.files[0]).then(() => {
              setimageChange((prev) => !prev);
            });
          });
        })
        .catch(() => {
          uploadBytes(imageRef, e.target.files[0]).then(() => {
            setimageChange((prev) => !prev);
          });
        });
  }

  useEffect(() => {
    getDownloadURL(imageRef)
      .then((url) => {
        setImage(url);
        setIsLoading(false);
      })
      .catch(() => {
        return;
      });
  }, [imageChange]);

  function submitHandler() {}

  return (
    <div className={classes.container}>
      {isSetting ? (
        <form className={classes.setBox}>
          <div className={classes.header}>
            <IoIosArrowBack onClick={() => setIsSetting(false)} />
            프로필수정 <button onClick={submitHandler}>완료</button>
          </div>
          <div className={classes.info}>
            {isLoading ? (
              <div className={classes.loadingBox}>
                <ClipLoader size={20} color={"#fd9253"} />
              </div>
            ) : (
              <Image width={90} height={90} alt="profile" src={image} />
            )}
            <p>
              <label htmlFor="file">
                <FiCamera />
              </label>
            </p>
            <input type="file" id="file" onChange={ImageHandler} />
            <label htmlFor="name">닉네임</label>
            <input placeholder={loginDisplayName} id="name" />
          </div>
        </form>
      ) : (
        <>
          <div className={classes.profile}>
            <figure>
              {image && <Image src={image} alt={loginDisplayName} width={35} height={35} />}
              <figcaption className={classes.name}>{loginDisplayName}</figcaption>
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
              <Link href="관심목록" onClick={() => setSelectedCategory("관심목록")}>
                <BiHeart />
                관심 목록{" "}
              </Link>
            </li>
            <li>
              <Link href="판매내역" onClick={() => setSelectedCategory("판매내역")}>
                <BiReceipt />
                판매내역
              </Link>
            </li>
            <li>
              <Link href="구매내역" onClick={() => setSelectedCategory("구매내역")}>
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
}

export default Mypage;
