import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { firestore } from "../firebase";
import classes from "./ProductItem.module.css";
import { doc, setDoc } from "firebase/firestore";

function ProductItem({ id, item }) {
  const router = useRouter();
  const [isLike, setIsLike] = useState(false);
  const [likesNumber, setlikesNumber] = useState(item.likes);

  let updatedNumber = likesNumber;

  const ClickLikeButton = async (e) => {
    e.stopPropagation();

    if (isLike == false) {
      updatedNumber += 1;
    } else if (isLike == true) {
      updatedNumber -= 1;
    }

    await setDoc(doc(firestore, "products", id), {
      ...item,
      likes: updatedNumber,
    });

    await setDoc(doc(firestore, "hotProducts", id), {
      ...item,
      likes: updatedNumber,
    });

    setIsLike((prev) => !prev);

    if (isLike !== true) {
      setlikesNumber((prev) => prev + 1);
    } else {
      setlikesNumber((prev) => prev - 1);
    }
  };

  function showDetailsHandler() {
    router.push(`${item.category}/${id}`);
  }

  let price;

  if (item.price) {
    price = item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        <p>{price} 원</p>
      </div>

      <button onClick={ClickLikeButton} className={classes.likeButton}>
        {isLike ? <AiFillHeart /> : <AiOutlineHeart />}
        {likesNumber}
      </button>
    </li>
  );
}

export default ProductItem;
