import { useRef, useEffect, useState, useContext } from "react";
import classes from "./WriteProduct.module.css";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import ProductContext from "../context/product-context";
import { firestore, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import UserContext from "../context/user-context";
import { MdAddAPhoto } from "react-icons/md";
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
  const {
    loginDisplayName,
    loginTemp,
    loginID,
    setsellProducts,
    sellProducts,
  } = useContext(UserContext);
  const [isFree, setIsFree] = useState(false);
  //수정일 경우 데이터 가져오기
  const [product, setProduct] = useState({});
  const productId = router.query.id;

  const categoryRef = useRef();
  const titleInputRef = useRef();
  const priceInputRef = useRef();
  const descriptionInputRef = useRef();

  const now = Date.now();

  const [image, setImage] = useState("첨부파일");

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

  const ProductID = isEdit ? productId : `${now}`;
  const likes = isEdit ? product.likes : 0;
  const time = isEdit ? product.time : now;

  //db에 새로 올린 게시물 추가하는 함수
  const WriteData = async (newProduct) => {
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

  //완료 버튼 클릭 시
  function submitHandler(e) {
    e.preventDefault();

    const category = categoryRef.current.value;
    const enteredTitle = titleInputRef.current.value;
    const enteredPrice = isFree ? "나눔" : priceInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    if (!isFree && !priceInputRef.current.value) {
      alert("가격을 입력해주세요!");
      return;
    }

    if (category == "카테고리") {
      alert("카테고리를 골라주세요!");
      return;
    }

    if (image == "첨부파일") {
      alert("이미지를 업로드해주세요!");
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

    //사진은 firestorage로 나머지 정보는 firestore로 업로드
    ImgUpload();
    WriteData(newProduct);

    setsellProducts((prev) => [
      ...prev,
      { id: now, data: { ...newProduct, time: time, likes: likes } },
    ]);

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
        <p className={classes.filebox}>
          <input
            className={classes.uploadName}
            value={image.name}
            placeholder="첨부파일"
          />
          <label htmlFor="file">
            <MdAddAPhoto />
          </label>
          <input type="file" id="file" onChange={ImageHandler} />
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
