import { useRef, useEffect, useState, useContext } from "react";
import classes from "./WriteProduct.module.css";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import ProductContext from "../context/product-context";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import UserContext from "../context/user-context";

const category = [
  "카테고리",
  "디지털기기",
  "생활가전",
  "가구",
  "유아동",
  "의류",
  "뷰티",
  "스포츠",
  "취미",
  "도서",
  "티켓/교환권",
  "반려동물용품",
  "식물",
  "삽니다",
];

function WriteProduct() {
  const { isEdit, latitude, longitude, dong } = useContext(ProductContext);
  const { loginDisplayName, loginTemp, loginID } = useContext(UserContext);
  const router = useRouter();

  const categoryRef = useRef();
  const titleInputRef = useRef();
  const priceInputRef = useRef();
  const imgInputRef = useRef();
  const descriptionInputRef = useRef();

  const [isFree, setIsFree] = useState(false);

  //수정일 경우 데이터 가져오기
  const [product, setProduct] = useState({});
  const productId = router.query.id;

  useEffect(() => {
    if (isEdit) {
      async function getData() {
        const docRef = doc(firestore, "products", productId);
        const docSnap = await getDoc(docRef);

        setProduct(docSnap.data());
      }

      getData();
    }
  }, [productId, isEdit]);

  const submitHandler = (e) => {
    e.preventDefault();

    const category = categoryRef.current.value;
    const enteredTitle = titleInputRef.current.value;
    const enteredPrice = isFree ? "나눔" : priceInputRef.current.value;
    const enteredImg = imgInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const now = Date.now();

    if (!isFree && !priceInputRef.current.value) {
      alert("가격을 입력해주세요");
      return;
    }

    const newProduct = {
      title: enteredTitle,
      price: enteredPrice,
      description: enteredDescription,
      img: enteredImg,
      Latitude: latitude,
      Longitude: longitude,
      category: category,
      dong: dong,
      userName: loginDisplayName,
      temp: loginTemp,
      ID: loginID,
    };

    if (category == "카테고리") {
      alert("카테고리를 골라주세요");
      return;
    }

    const WriteData = async () => {
      const ProductID = isEdit ? productId : `${now}`;
      const likes = isEdit ? product.likes : 0;
      const time = isEdit ? product.time : now;

      try {
        const docRef = await setDoc(doc(firestore, "products", ProductID), {
          ...newProduct,
          likes,
          time,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    WriteData();

    router.push("/Home");
  };

  const cancelHandler = () => {
    if (!isEdit) {
      router.push("/Home");
    } else {
      router.push(`/${product.category}/${productId}`);
    }
  };

  return (
    <>
      <header className={classes.header}>
        <IoIosArrowBack onClick={cancelHandler} />{" "}
        {isEdit ? "수정하기" : "중고거래 글쓰기"}
      </header>

      <form id="form" className={classes.form} onSubmit={submitHandler}>
        <p>
          <select ref={categoryRef}>
            {category.map((category, idx) => {
              return product?.category == category ? (
                <option key={idx} value={category} selected>
                  {category}
                </option>
              ) : (
                <option key={idx} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
          <input
            placeholder={product?.title || "제목"}
            ref={titleInputRef}
            type="text"
            name="title"
            required
          />
        </p>
        <p className={classes.priceBox}>
          <input
            placeholder={product?.price || "₩ 가격"}
            ref={priceInputRef}
            type="number"
            name="price"
            disabled={isFree}
          />
          <label htmlFor="freeCheck">나눔</label>
          <input
            type="checkbox"
            name="freeCheck"
            value="0"
            onClick={() => setIsFree((prev) => !prev)}
          />
        </p>
        <p>
          <input
            placeholder={product?.img || "이미지"}
            ref={imgInputRef}
            type="url"
            name="image"
            required
          />
        </p>
        <p>
          <textarea
            placeholder={
              product?.description ||
              `${dong}에 올릴 게시글 내용을 작성해주세요. (가품 및 판매 금지 물품은 게시가 제한될 수 있어요.)`
            }
            ref={descriptionInputRef}
            name="description"
            rows="7"
            required
          />
        </p>
        <div className={classes.actions}>
          <button type="button" onClick={() => router.push("/Home")}>
            Cancel
          </button>
          <button>완료</button>
        </div>
      </form>
    </>
  );
}

export default WriteProduct;
