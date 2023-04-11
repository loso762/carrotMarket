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
import {doc, setDoc, deleteDoc, updateDoc} from "firebase/firestore";

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
  const {loginDisplayName, loginID, likeProducts, isLoggedIn} = useContext(UserContext);
  const [isLike, setIsLike] = useState(false);
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
    if (likeProducts.some((item) => item.id === id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
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
      if (loginDisplayName == item.nickname) {
        errHandler("본인의 게시글은 좋아요를 누르실수 없습니다.");
        return;
      } else {
        if (isLike) {
          item.likes -= 1;
          setDoc(doc(firestore, "products", id), {
            ...item,
            likes: item.likes,
            wholike: item.wholike.filter((item) => item !== loginID),
          });
        } else if (!isLike) {
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
    if (item.nickname == loginDisplayName) {
      router.push(`/Chat`);
      return;
    }

    await setDoc(doc(firestore, "chat", `${loginID}_${item.ID}-${item.title}`), {
      partyID: [loginID, item.ID],
      product: id,
      img: productUrl,
      dong: item.dong,
      category: item.category,
      title: item.title,
      date: Date.now(),
    });

    //채팅목록에 추가
    if (!item.chat.includes(loginDisplayName)) {
      updateDoc(doc(firestore, "products", id), {
        chat: [...item.chat, loginDisplayName],
      });
    }

    router.push(`/Chat/${loginID}_${item.ID}-${item.title}`);
  }

  //게시물 삭제
  async function deleteBtnHandler() {
    // products 컬렉션에서 삭제
    deleteDoc(doc(firestore, "products", id));

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

  const backUrl = SelectedCategory == "카테고리" ? "Main" : SelectedCategory;

  return (
    <>
      {isPop && sellpopup}
      <header className={classes.header}>
        <Link href={`/${backUrl}`}>
          <IoIosArrowBack />
        </Link>

        <Link href={`/Main`} onClick={() => setSelectedCategory("카테고리")}>
          <AiFillHome />
        </Link>

        {/* 게시글 작성자만 게시글 수정 및 삭제 가능하도록 하는 코드*/}
        {loginDisplayName == item.nickname && (!menuOpen ? menuOpenBtn : menuBox)}
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
              <p>{item.nickname}</p>
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
              관심 {item.likes} · 조회 {item.show}
            </p>
          </div>

          <div className={classes.footer}>
            <button onClick={likeBtnHandler} className={classes.likeButton}>
              {isLike ? <AiFillHeart className={classes.fill} /> : <AiOutlineHeart />}
            </button>
            <div className={classes.price}>
              {price}
              {item.soldout && <p className={classes.soldout}>판매완료</p>}
            </div>
            <button
              className={`${classes.chatButton} ${!isLoggedIn || (item.soldout && classes.disabled)}`}
              onClick={chatBtnHandler}>
              {item.nickname == loginDisplayName ? "대화중인 채팅방" : "채팅하기"}
            </button>
          </div>
        </section>
      )}
      {errMsg && <div className={classes.errMsg}>{errMsg}</div>}
    </>
  );
}

export default ProductDetail;
