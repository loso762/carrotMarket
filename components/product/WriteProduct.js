import { useRef, useEffect, useState, useContext } from "react";
import classes from "./WriteProduct.module.css";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import ProductContext from "../context/product-context";
import { firestore, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  const router = useRouter();
  const { isEdit, latitude, longitude, dong, SelectedCategory } =
    useContext(ProductContext);
  const { loginDisplayName, loginTemp, loginID } = useContext(UserContext);
  const [isFree, setIsFree] = useState(false);
  //수정일 경우 데이터 가져오기
  const [product, setProduct] = useState({});
  const productId = router.query.id;

  const categoryRef = useRef();
  const titleInputRef = useRef();
  const priceInputRef = useRef();
  const descriptionInputRef = useRef();

  const now = Date.now();

  const [image, setImage] = useState(null);

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

  function ImageHandler(e) {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  function ImgUpload() {
    const imageRef = ref(storage, `images/${now}`);
    uploadBytes(imageRef, image);
  }

  function submitHandler(e) {
    e.preventDefault();

    const category = categoryRef.current.value;
    const enteredTitle = titleInputRef.current.value;
    const enteredPrice = isFree ? "나눔" : priceInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    ImgUpload();

    if (!isFree && !priceInputRef.current.value) {
      alert("가격을 입력해주세요");
      return;
    }

    const newProduct = {
      title: enteredTitle,
      price: enteredPrice,
      description: enteredDescription,
      Latitude: latitude,
      Longitude: longitude,
      category: category,
      dong: dong,
      userName: loginDisplayName,
      temp: loginTemp,
      ID: loginID,
      chat: [],
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
        console.error("게시글 등록 실패", e);
      }
    };

    WriteData();

    router.push("/Main");
  }

  function cancelHandler() {
    if (!isEdit) {
      router.push(SelectedCategory);
    } else {
      router.push(`/${product.category}/${productId}`);
    }
  }

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
          <input type="file" onChange={ImageHandler} />
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
          <button type="button" onClick={cancelHandler}>
            Cancel
          </button>
          <button>완료</button>
        </div>
      </form>
    </>
  );
}

export default WriteProduct;
