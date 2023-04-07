import classes from "./ProductDetail.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import ProductContext from "../context/product-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineHeart, AiFillHeart, AiFillHome } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { firestore } from "../firebase";
import UserContext from "../context/user-context";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { ClipLoader } from "react-spinners";

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

function ProductDetail({ data, id, url, isLoading }) {
  const router = useRouter();
  const { setIsEdit, SelectedCategory, setSelectedCategory } =
    useContext(ProductContext);
  const { loginDisplayName, likeProducts, isLoggedIn, setlikeProducts } =
    useContext(UserContext);
  const [isLike, setIsLike] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPop, setIsPop] = useState(false);
  const buyerRef = useRef();

  let price;
  if (data.price == "나눔") {
    price = data.price;
  } else if (data.price) {
    price = `${data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원`;
  }

  useEffect(() => {
    likeProducts.some((like) => like.id == id) && setIsLike(true);
  }, [id, likeProducts]);

  //좋아요버튼 클릭시
  async function likeBtnHandler(e) {
    let updatedNumber = data.likes;

    if (isLike == false) {
      updatedNumber += 1;
      setlikeProducts((prev) => [
        ...prev,
        {
          id: id,
          data: {
            ...data,
            likes: updatedNumber,
          },
        },
      ]);
    } else if (isLike == true) {
      updatedNumber -= 1;
      setlikeProducts((prev) => prev.filter((item) => item.id !== id));
    }

    await setDoc(doc(firestore, "products", id), {
      ...data,
      likes: updatedNumber,
    });

    setIsLike((prev) => !prev);
  }

  //채팅버튼 클릭시
  async function chatBtnHandler() {
    if (!isLoggedIn) {
      alert("로그인을 해주세요!");
      return;
    }

    if (data.soldout) {
      alert("판매완료된 상품입니다!");
      return;
    }
    if (data.userName == loginDisplayName) {
      return;
    }
    await setDoc(
      doc(
        firestore,
        "chat",
        `${loginDisplayName}_${data.userName}-${data.title}`
      ),
      {
        party: [loginDisplayName, data.userName],
        product: id,
        img: url,
        dong: data.dong,
        title: data.title,
        date: Date.now(),
      }
    );

    //채팅목록에 추가
    if (!data.chat.includes(loginDisplayName)) {
      updateDoc(doc(firestore, "products", id), {
        chat: [...data.chat, loginDisplayName],
      });
    }

    router.push(`/Chat/${loginDisplayName}_${data.userName}-${data.title}`);
  }

  //게시물삭제
  function deleteBtnHandler() {
    deleteDoc(doc(firestore, "products", id));
    router.push(`/${data.category}`);
  }

  //판매완료
  function soldOutHandler() {
    updateDoc(doc(firestore, "products", id), {
      soldout: "true",
      buyer: buyerRef.current.value,
    });
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

  return (
    <>
      {isPop && (
        <>
          <div className={classes.popup}>
            누구와 거래하셨나요?
            <select ref={buyerRef}>
              {data.chat.map((chatPartner, idx) => {
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
      )}

      <header className={classes.header}>
        <Link href={`/${SelectedCategory}`}>
          <IoIosArrowBack />
        </Link>

        <Link href={`/Main`} onClick={() => setSelectedCategory("카테고리")}>
          <AiFillHome />
        </Link>

        {/* 게시글 작성자만 게시글 수정 및 삭제 가능하도록 하는 코드*/}
        {loginDisplayName == data.userName &&
          (!menuOpen ? (
            <button onClick={() => setMenuOpen((prev) => !prev)}>
              <BiDotsVerticalRounded />
            </button>
          ) : (
            <div className={classes.menuBox}>
              <p onClick={EditHandler}>게시글 수정</p>
              <p onClick={deleteBtnHandler}>게시글 삭제</p>
              <p onClick={() => setIsPop(true)}>판매완료</p>
            </div>
          ))}
      </header>
      {isLoading ? (
        <div className={classes.Error}>
          <ClipLoader color="#fd9253" size={30} />
        </div>
      ) : (
        <section className={classes.detail} onClick={() => setMenuOpen(false)}>
          <figure className={classes.Img}>
            <img src={url} alt={data.title} />
          </figure>

          <div className={classes.userInfo}>
            <div className={classes.userInfoBox}>
              <Image
                src="/images/profile.jpg"
                alt="profileImg"
                width={40}
                height={40}
              />
              <p>{data.userName}</p>
              <p>{data.dong}</p>
            </div>

            <div className={classes.temperatureBox}>
              <div className={classes.tempInfo}>
                <div className={classes.temperature}>
                  {data.temp}°C
                  <div className={classes.tempBar}>
                    <p style={{ width: `${(data.temp / 80) * 100}%` }} />
                  </div>
                </div>
                <div className={classes.tempImoticon}>
                  {ImoticonHandler(data.temp)}
                </div>
              </div>
              <p className={classes.tempEx}>매너온도</p>
            </div>
          </div>

          <div className={classes.productInfo}>
            <h1>{data.title}</h1>
            <div>
              <Link href={`/${data.category}`}>{data.category} </Link>
              <p>·{calcTime(data.time)} 전</p>
            </div>
            <p>{data.description}</p>
          </div>

          <div className={classes.footer}>
            <button onClick={likeBtnHandler} className={classes.likeButton}>
              {isLike ? (
                <AiFillHeart className={classes.fill} />
              ) : (
                <AiOutlineHeart />
              )}
            </button>
            <p className={classes.price}>
              {price}
              {data.soldout && <p className={classes.soldout}>판매완료</p>}
            </p>
            <button
              className={`${classes.chatButton} ${
                !isLoggedIn || (data.soldout && classes.disabled)
              }`}
              onClick={chatBtnHandler}
            >
              채팅하기
            </button>
          </div>
        </section>
      )}
    </>
  );
}

export default ProductDetail;
