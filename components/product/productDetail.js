import classes from "./ProductDetail.module.css";
import {useContext, useEffect, useRef, useState} from "react";
import ProductContext from "../context/product-context";
import UserContext from "../context/user-context";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/router";
import {IoIosArrowBack} from "react-icons/io";
import {BiDotsVerticalRounded} from "react-icons/bi";
import {AiOutlineHeart, AiFillHeart, AiFillHome} from "react-icons/ai";
import {firestore} from "../firebase";
import {ClipLoader} from "react-spinners";
import {doc, setDoc, deleteDoc, updateDoc, collection} from "firebase/firestore";

//시간 구하는 함수
function calcTime(time) {
  const now = Date.now();
  let minutesAgo = Math.round((now - time) / 1000 / 60);
  if (minutesAgo < 60) {
    minutesAgo = `${minutesAgo}분`;
  } else if (minutesAgo < 60 * 24) {
    minutesAgo = `${Math.round(minutesAgo / 60)}시간`;
  } else {
    minutesAgo = `${Math.floor(minutesAgo / 60 / 24)}일`;
  }
  return minutesAgo;
}

//온도 이모티콘 구하는 함수
function ImoticonHandler(temp) {
  let tempImoticon = "🙂";
  if (temp < 35) {
    tempImoticon = "😨";
  } else if (temp > 38) {
    tempImoticon = "😍";
  }
  return tempImoticon;
}

function ProductDetail({item, id, productUrl, userUrl, isLoading}) {
  const router = useRouter();
  const {setIsEdit, SelectedCategory, setSelectedCategory} = useContext(ProductContext);
  const {loginDisplayName, likeProducts, isLoggedIn, setlikeProducts, loginID} = useContext(UserContext);
  const [isLike, setIsLike] = useState(false);
  const [LikeNum, setLikeNum] = useState(item.likes);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPop, setIsPop] = useState(false);
  const [errMsg, seterrMsg] = useState(null);
  const buyerRef = useRef();

  let price;
  if (item.price == "나눔") {
    price = item.price;
  } else if (item.price) {
    price = `${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원`;
  }

  useEffect(() => {
    if (likeProducts.some((like) => like.id == id)) {
      setIsLike(true);
    }
  }, [id, likeProducts]);

  function errHandler(text) {
    seterrMsg(text);
    setTimeout(() => {
      seterrMsg(null);
    }, 500);
  }

  //좋아요 클릭
  function likeBtnHandler(e) {
    e.stopPropagation();

    if (isLoggedIn) {
      if (loginDisplayName == item.userName) {
        errHandler("본인의 게시글은 좋아요를 누르실수 없습니다.");
        return;
      } else {
        if (isLike) {
          setDoc(doc(firestore, "products", id), {...item, likes: LikeNum - 1});

          deleteDoc(doc(collection(firestore, "users", loginID, "likesproducts"), id));
          setIsLike(false);
          setLikeNum((prev) => prev - 1);
        } else if (!isLike) {
          setDoc(doc(firestore, "products", id), {...item, likes: LikeNum + 1});

          setDoc(doc(collection(firestore, "users", loginID, "likesproducts"), id), {
            ...item,
            likes: LikeNum + 1,
          });

          setIsLike(true);
          setLikeNum((prev) => prev + 1);
        }
      }
    } else {
      router.push("/");
    }
  }

  //채팅버튼 클릭
  async function chatBtnHandler() {
    if (!isLoggedIn) {
      errHandler("로그인을 해주세요!");
      return;
    }

    if (item.soldout) {
      errHandler("판매완료된 상품입니다!");
      return;
    }
    if (item.userName == loginDisplayName) {
      router.push(`/Chat`);
      return;
    }

    await setDoc(doc(firestore, "chat", `${loginDisplayName}_${item.userName}-${item.title}`), {
      party: [loginDisplayName, item.userName],
      product: id,
      img: url,
      dong: item.dong,
      title: item.title,
      date: Date.now(),
    });

    //채팅목록에 추가
    if (!item.chat.includes(loginDisplayName)) {
      updateDoc(doc(firestore, "products", id), {
        chat: [...item.chat, loginDisplayName],
      });
    }

    router.push(`/Chat/${loginDisplayName}_${item.userName}-${item.title}`);
  }

  //게시물 삭제
  async function deleteBtnHandler() {
    // products 컬렉션에서 삭제
    deleteDoc(doc(firestore, "products", id));

    // 찜한 목록에 있으면 user의 likesproducts 컬렉션에서 삭제
    if (likeProducts.some((arr) => arr.id == id)) {
      const userDocRef = doc(collection(firestore, "users", loginID, "likesproducts"), id);
      await deleteDoc(userDocRef);
    }

    router.push(`/${item.category}`);
  }

  //판매완료
  function soldOutHandler() {
    updateDoc(doc(firestore, "products", id), {soldout: "true", buyer: buyerRef.current.value});
    setMenuOpen((prev) => !prev);
    setIsPop(false);
    router.push(`/${SelectedCategory}`);
  }

  //게시물 수정
  function EditHandler() {
    router.push(`/WriteProduct?id=${id}`);
    setIsEdit(true);
  }

  //팝업 종료
  function popupCancelHandler() {
    setIsPop(false);
    setMenuOpen((prev) => !prev);
  }

  const sellpopup = (
    <>
      <div className={classes.popup}>
        누구와 거래하셨나요?
        <select ref={buyerRef}>
          {item.chat.map((chatPartner, idx) => {
            return (
              <option value={chatPartner} key={idx}>
                {chatPartner}
              </option>
            );
          })}
        </select>
        <div>
          <button onClick={popupCancelHandler}>취소</button>
          <button onClick={soldOutHandler}>확인</button>
        </div>
      </div>
      <div className={classes.backdrop}></div>
    </>
  );

  const menuOpenBtn = (
    <button onClick={() => setMenuOpen((prev) => !prev)}>
      <BiDotsVerticalRounded />
    </button>
  );

  const menuBox = (
    <div className={classes.menuBox}>
      <p onClick={EditHandler}>게시글 수정</p>
      <p onClick={deleteBtnHandler}>게시글 삭제</p>
      <p onClick={() => setIsPop(true)}>판매완료</p>
    </div>
  );

  return (
    <>
      {isPop && sellpopup}
      <header className={classes.header}>
        <Link href={`/${SelectedCategory}`}>
          <IoIosArrowBack />
        </Link>

        <Link href={`/Main`} onClick={() => setSelectedCategory("카테고리")}>
          <AiFillHome />
        </Link>

        {/* 게시글 작성자만 게시글 수정 및 삭제 가능하도록 하는 코드*/}
        {loginDisplayName == item.userName && (!menuOpen ? menuOpenBtn : menuBox)}
      </header>
      {isLoading ? (
        <div className={classes.loading}>
          <ClipLoader color="#fd9253" size={30} />
        </div>
      ) : (
        <section className={classes.detail} onClick={() => setMenuOpen(false)}>
          <figure className={classes.Img}>
            <Image src={productUrl} alt={item.title} width={412} height={335} />
          </figure>

          <div className={classes.userInfo}>
            <div className={classes.userInfoBox}>
              <Image src={userUrl} alt="profileImg" width={40} height={40} />
              <p>{item.userName}</p>
              <p>{item.dong}</p>
            </div>

            <div className={classes.temperatureBox}>
              <div className={classes.tempInfo}>
                <div className={classes.temperature}>
                  {item.temp}°C
                  <div className={classes.tempBar}>
                    <p style={{width: `${(item.temp / 80) * 100}%`}} />
                  </div>
                </div>
                <div className={classes.tempImoticon}>{ImoticonHandler(item.temp)}</div>
              </div>
              <p className={classes.tempEx}>매너온도</p>
            </div>
          </div>

          <div className={classes.productInfo}>
            <h1>{item.title}</h1>
            <div>
              <Link href={`/${item.category}`}>{item.category} </Link>
              <p>·{calcTime(item.time)} 전</p>
            </div>
            <p>{item.description}</p>
            <p className={classes.likeInfo}>
              관심 {LikeNum} · 조회 {item.show}
            </p>
          </div>

          <div className={classes.footer}>
            <button onClick={likeBtnHandler} className={classes.likeButton}>
              {isLike ? <AiFillHeart className={classes.fill} /> : <AiOutlineHeart />}
            </button>
            <p className={classes.price}>
              {price}
              {item.soldout && <p className={classes.soldout}>판매완료</p>}
            </p>
            <button
              className={`${classes.chatButton} ${!isLoggedIn || (item.soldout && classes.disabled)}`}
              onClick={chatBtnHandler}>
              {item.userName == loginDisplayName ? "대화중인 채팅방" : "채팅하기"}
            </button>
          </div>
        </section>
      )}
      {errMsg && <div className={classes.errMsg}>{errMsg}</div>}
    </>
  );
}

export default ProductDetail;
