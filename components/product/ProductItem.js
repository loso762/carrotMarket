import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { firestore } from "../firebase";
import classes from "./ProductItem.module.css";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import UserContext from "../context/user-context";

function ProductItem({ id, item, likes }) {
  const router = useRouter();
  const [isLike, setIsLike] = useState(false);
  const [likesNumber, setlikesNumber] = useState(item.likes);

  const { loginID, isLoggedIn } = useContext(UserContext);

  //유저가 찜한 매물이면 바로 좋아요 상태
  useEffect(() => {
    likes && setIsLike(true);
  }, [likes]);

  //좋아요 버튼 클릭시
  const ClickLikeButton = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    let updatedNumber = likesNumber;

    if (isLike == false) {
      updatedNumber += 1;
    } else if (isLike == true) {
      updatedNumber -= 1;
    }

    await setDoc(doc(firestore, "products", id), {
      ...item,
      likes: updatedNumber,
    });

    const userDocRef = doc(
      collection(firestore, "users", loginID, "likesproducts"),
      id
    );
    await setDoc(userDocRef, {
      ...item,
      likes: updatedNumber,
    });

    setIsLike((prev) => !prev);

    if (!isLike) {
      setlikesNumber((prev) => prev + 1);
    } else {
      const productDocRef = doc(
        collection(firestore, "users", loginID, "likesproducts"),
        id
      );
      deleteDoc(productDocRef);
      setlikesNumber((prev) => prev - 1);
    }
  };

  function showDetailsHandler() {
    router.push(`${item.category}/${id}`);
  }

  let price;
  if (item.price == "나눔") {
    price = item.price;
  } else if (item.price) {
    price = `${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원`;
  }

  const now = Date.now();
  let minutesAgo = Math.round((now - item.time) / 1000 / 60);

  if (minutesAgo < 60) {
    minutesAgo = `${minutesAgo}분`;
  } else if (minutesAgo < 60 * 24) {
    minutesAgo = `${Math.round(minutesAgo / 60)}시간`;
  } else {
    minutesAgo = `${Math.floor(minutesAgo / 60 / 24)}일`;
  }

  return (
    <li className={classes.item} onClick={showDetailsHandler}>
      <div className={classes.image}>
        <img src={item.img} alt={item.title} />
      </div>
      <div className={classes.content}>
        <h4>{item.title}</h4>
        <p className={classes.time}>
          {item.dong} · {minutesAgo} 전
        </p>
        <p>{price}</p>
      </div>

      <button onClick={ClickLikeButton} className={classes.likeButton}>
        {isLike ? <AiFillHeart className={classes.fill} /> : <AiOutlineHeart />}
        {likesNumber}
      </button>
    </li>
  );
}

export default ProductItem;
