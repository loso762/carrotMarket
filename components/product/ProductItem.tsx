import {useRouter} from "next/router";
import {MouseEvent, useCallback, useEffect, useState} from "react";
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai";
import {firestore, storage} from "../firebase";
import classes from "./ProductItem.module.css";
import {doc, setDoc} from "firebase/firestore";
import {ref, getDownloadURL} from "firebase/storage";
import Image from "next/image";
import {ClipLoader} from "react-spinners";
import {useAppSelector} from "../../Hooks/storeHook";
import {ItemData} from "../../store/product-slice";

const ProductItem: React.FC<{id: string; item: ItemData; isliked: boolean; errorHandler: () => void}> = ({
  id,
  item,
  isliked,
  errorHandler,
}) => {
  const router = useRouter();

  const loginID = useAppSelector((state) => state.User.loginID);
  const nickname = useAppSelector((state) => state.User.nickname);
  const isLoggedIn = useAppSelector((state) => state.User.isLoggedIn);

  const [image, setImage] = useState("");
  const price = item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  //firebase storage에서 이미지 가져오기
  useEffect(() => {
    const imageRef = ref(storage, `images/${id}`);
    setTimeout(() => {
      getDownloadURL(imageRef)
        .then((url: string) => {
          setImage(url);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 400);
  }, [id]);

  //좋아요 클릭
  const likeBtnHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (isLoggedIn) {
        if (nickname == item.nickname) {
          errorHandler();
          return;
        } else {
          if (isliked) {
            item.likes -= 1;
            setDoc(doc(firestore, "products", id), {
              ...item,
              likes: item.likes,
              wholike: item.wholike.filter((item) => item !== loginID),
            });
          } else if (!isliked) {
            item.likes += 1;
            setDoc(doc(firestore, "products", id), {
              ...item,
              likes: item.likes,
              wholike: [...item.wholike, loginID],
            });
          }
        }
      } else {
        router.push("/");
      }
    },
    [loginID, item, isliked, errorHandler, id, isLoggedIn, nickname, router]
  );

  //디테일 페이지 열기
  const showDetailsHandler: (e: MouseEvent<HTMLElement>) => void = useCallback(
    async (e) => {
      e.stopPropagation();

      //조회 수 업데이트
      let show = item.show || 0;
      show += 1;

      await setDoc(doc(firestore, "products", id), {...item, show: show});

      router.push(`${item.category}/${id}`);
    },
    [id, item, router]
  );

  let minutesAgo: string | number = Math.round((Date.now() - item.time) / 1000 / 60);

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
          {item.dong} · {minutesAgo}
        </div>
        <div className={classes.price}>
          {item.soldout && <p className={classes.soldout}>판매완료</p>}
          {price}
          {item.price !== "나눔" && "원"}
        </div>
      </div>

      <button onClick={likeBtnHandler} className={classes.likeButton}>
        {isliked ? <AiFillHeart className={classes.fill} /> : <AiOutlineHeart />}
        {item.likes}
      </button>
    </li>
  );
};

export default ProductItem;
