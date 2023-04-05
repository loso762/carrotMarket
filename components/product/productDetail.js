import classes from "./ProductDetail.module.css";
import { useContext, useState } from "react";
import ProductContext from "../product-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineHeart, AiFillHeart, AiFillHome } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import UserContext from "../user-context";

function ProductDetail({ data, id }) {
  const router = useRouter();
  const { setIsEdit } = useContext(ProductContext);
  const { isLoggedIn, loginDisplayName } = useContext(UserContext);
  const [isLike, setIsLike] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  let price;
  if (data.price == "나눔") {
    price = data.price;
  } else if (data.price) {
    price = `${data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원`;
  }

  const now = Date.now();
  let minutesAgo = Math.round((now - data.time) / 1000 / 60);

  if (minutesAgo < 60) {
    minutesAgo = `${minutesAgo}분`;
  } else if (minutesAgo < 60 * 24) {
    minutesAgo = `${Math.round(minutesAgo / 60)}시간`;
  } else {
    minutesAgo = `${Math.floor(minutesAgo / 60 / 24)}일`;
  }

  const temp = data.temp || 36.5;
  let tempImoticon = "🙂";
  if (temp < 35) {
    tempImoticon = "😨";
  } else if (temp > 38) {
    tempImoticon = "😀";
  }

  const LikeBtnHandler = async (e) => {
    let updatedNumber = data.likes;

    if (isLike == false) {
      updatedNumber += 1;
    } else if (isLike == true) {
      updatedNumber -= 1;
    }

    await setDoc(doc(firestore, "products", id), {
      ...data,
      likes: updatedNumber,
    });

    setIsLike((prev) => !prev);
  };

  const deleteBtnHandler = () => {
    deleteDoc(doc(firestore, "products", id));
    router.push(`/${data.category}`);
  };

  return (
    <>
      <header className={classes.header}>
        <Link href={`/${data.category}`}>
          <IoIosArrowBack />
        </Link>

        <Link href={`/Home`}>
          <AiFillHome />
        </Link>

        {loginDisplayName == data.userName &&
          (!menuOpen ? (
            <button onClick={() => setMenuOpen((prev) => !prev)}>
              <BiDotsVerticalRounded />
            </button>
          ) : (
            <div className={classes.menuBox}>
              <Link
                href={`/WriteProduct?id=${id}`}
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                게시글 수정
              </Link>
              <p onClick={deleteBtnHandler}>게시글 삭제</p>
            </div>
          ))}
      </header>
      <section className={classes.detail} onClick={() => setMenuOpen(false)}>
        <figure className={classes.Img}>
          <img src={data.img} alt={data.title} />
        </figure>

        <div className={classes.userInfo}>
          <div className={classes.userInfoBox}>
            <Image
              src="/images/profile.jpg"
              alt="profileImg"
              width={35}
              height={35}
            />
            <p>{data.userName}</p>
            <p>{data.dong}</p>
          </div>

          <div className={classes.temperatureBox}>
            <div className={classes.tempInfo}>
              <div className={classes.temperature}>
                {temp}°C
                <div className={classes.tempBar}>
                  <p style={{ width: `${(temp / 80) * 100}%` }} />
                </div>
              </div>
              <div className={classes.tempImoticon}>{tempImoticon}</div>
            </div>
            <p className={classes.tempEx}>매너온도</p>
          </div>
        </div>

        <div className={classes.productInfo}>
          <h1>{data.title}</h1>
          <div>
            <Link href={`/${data.category}`}>{data.category} </Link>
            <p>·{minutesAgo} 전</p>
          </div>
          <p>{data.description}</p>
        </div>

        <div className={classes.footer}>
          <button onClick={LikeBtnHandler} className={classes.likeButton}>
            {isLike ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
          <p>{price}</p>
          <button className={classes.chatButton}>채팅하기</button>
        </div>
      </section>
    </>
  );
}

export default ProductDetail;
