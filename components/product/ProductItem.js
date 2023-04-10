import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai";
import {firestore, storage} from "../firebase";
import classes from "./ProductItem.module.css";
import {collection, doc, setDoc, deleteDoc} from "firebase/firestore";
import UserContext from "../context/user-context";
import {ref, getDownloadURL} from "firebase/storage";
import Image from "next/image";
import {ClipLoader} from "react-spinners";

function ProductItem({id, item, isliked, errorHandler}) {
  const router = useRouter();
  const [isLike, setIsLike] = useState(false);
  const [LikeNum, setLikeNum] = useState(item.likes);
  const [image, setImage] = useState();

  //console.log(isliked);
  const {loginID, loginDisplayName, isLoggedIn} = useContext(UserContext);

  //firebase storage에서 이미지 가져오기
  useEffect(() => {
    const imageRef = ref(storage, `images/${id}`);
    getDownloadURL(imageRef).then((url) => {
      setImage(url);
    });
  }, [id]);

  //유저가 찜한 매물이면 바로 좋아요 상태
  useEffect(() => {
    isliked && setIsLike(true);
  }, [isliked]);

  //좋아요 클릭
  function likeBtnHandler(e) {
    e.stopPropagation();

    if (isLoggedIn) {
      if (loginDisplayName == item.userName) {
        errorHandler();
        return;
      } else {
        if (isLike) {
          setIsLike(false);
          setDoc(doc(firestore, "products", id), {...item, likes: LikeNum - 1});
          deleteDoc(doc(collection(firestore, "users", loginID, "likesproducts"), id));

          setLikeNum((prev) => prev - 1);
        } else if (!isLike) {
          setIsLike(true);
          setDoc(doc(firestore, "products", id), {...item, likes: LikeNum + 1});

          setDoc(doc(collection(firestore, "users", loginID, "likesproducts"), id), {
            ...item,
            likes: LikeNum + 1,
          });

          setLikeNum((prev) => prev + 1);
        }
      }
    } else {
      router.push("/");
    }
  }

  //디테일 페이지 열기
  async function showDetailsHandler(e) {
    e.stopPropagation();
    //조회 수 업데이트 함수
    let show = item.show || 0;
    show += 1;

    await setDoc(doc(firestore, "products", id), {...item, show: show});

    if (isLoggedIn && isliked) {
      const userDocRef = doc(collection(firestore, "users", loginID, "likesproducts"), id);
      setDoc(userDocRef, {...item, show: show});
    }

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
        {LikeNum}
      </button>
    </li>
  );
}

export default ProductItem;
