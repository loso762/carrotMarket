import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { firestore, storage } from "../firebase";
import classes from "./ProductItem.module.css";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import UserContext from "../context/user-context";
import { ref, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

function ProductItem({ id, item, likes }) {
  const router = useRouter();
  const [isLike, setIsLike] = useState(false);
  const [likesNumber, setlikesNumber] = useState(item.likes);
  const [image, setImage] = useState();

  const { loginID, isLoggedIn, setlikeProducts } = useContext(UserContext);

  useEffect(() => {
    const imageRef = ref(storage, `images/${id}`);
    getDownloadURL(imageRef).then((url) => {
      setImage(url);
    });
  }, [id]);

  //유저가 찜한 매물이면 바로 좋아요 상태
  useEffect(() => {
    likes && setIsLike(true);
  }, [likes]);

  //좋아요 버튼 클릭시
  async function likeBtnHandler(e) {
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
      setlikeProducts((prev) => [
        ...prev,
        {
          id: id,
          data: {
            ...item,
            likes: updatedNumber,
          },
        },
      ]);
      setlikesNumber((prev) => prev + 1);
    } else {
      setlikeProducts((prev) => prev.filter((item) => item.id !== id));

      const productDocRef = doc(
        collection(firestore, "users", loginID, "likesproducts"),
        id
      );
      deleteDoc(productDocRef);
      setlikesNumber((prev) => prev - 1);
    }
  }

  function showDetailsHandler() {
    router.push(`${item.category}/${id}`);
  }

  let price;
  if (item.price == "나눔") {
    price = item.price;
  } else if (item.price) {
    price = `${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원`;
  }

  let minutesAgo = Math.round((Date.now() - item.time) / 1000 / 60);

  if (minutesAgo < 60) {
    minutesAgo = `${minutesAgo}분`;
  } else if (minutesAgo < 60 * 24) {
    minutesAgo = `${Math.round(minutesAgo / 60)}시간`;
  } else {
    minutesAgo = `${Math.floor(minutesAgo / 60 / 24)}일`;
  }

  return (
    <li key={id} className={classes.item} onClick={showDetailsHandler}>
      <div className={classes.image}>
        {image ? (
          <Image src={image} alt={item.title} width={120} height={120} />
        ) : (
          <ClipLoader size={20} color={"#fd9253"} />
        )}
      </div>
      <div className={classes.content}>
        <h4>{item.title}</h4>
        <div className={classes.time}>
          {item.dong} · {minutesAgo} 전
        </div>
        <div className={classes.price}>
          {item.soldout && <p className={classes.soldout}>판매완료</p>}
          {price}
        </div>
      </div>

      <button onClick={likeBtnHandler} className={classes.likeButton}>
        {isLike ? <AiFillHeart className={classes.fill} /> : <AiOutlineHeart />}
        {likesNumber}
      </button>
    </li>
  );
}

export default ProductItem;
