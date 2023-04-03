import { useRef, useEffect, useState, useContext, useCallback } from "react";
import classes from "./newProductForm.module.css";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import ProductContext from "../context";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

function NewProductForm() {
  const { isEdit } = useContext(ProductContext);
  const router = useRouter();
  const id = router.query.id;

  const categoryRef = useRef();
  const titleInputRef = useRef();
  const priceInputRef = useRef();
  const imgInputRef = useRef();
  const descriptionInputRef = useRef();

  //수정일 경우 데이터 가져오기
  const [product, setProduct] = useState({});

  //글쓴이 주소 가져오는 코드
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [dong, setDong] = useState("내근처");

  const productId = router.query.id;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=ed86928ac206d7e1c95266631cccfd91&libraries=services&autoload=false`;
    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const dongAddress = result[0].region_3depth_name;
            setDong(dongAddress);
          } else {
            console.error("Failed to get the dong address");
          }
        });
      });
    };

    if (latitude && longitude) {
      mapScript.addEventListener("load", onLoadKakaoMap);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    async function getData(context) {
      const docRef = doc(firestore, "products", productId);
      const docSnap = await getDoc(docRef);

      setProduct(docSnap.data());
    }

    getData();
  }, [productId]);

  const submitHandler = (e) => {
    e.preventDefault();

    const category = categoryRef.current.value;
    const enteredTitle = titleInputRef.current.value;
    const enteredPrice = priceInputRef.current.value;
    const enteredImg = imgInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const now = Date.now();

    const newProduct = {
      title: enteredTitle,
      price: enteredPrice,
      img: enteredImg,
      description: enteredDescription,
      time: now,
      Latitude: latitude,
      Longitude: longitude,
      dong: dong,
      category: category,
      likes: 0,
    };

    if (category == "카테고리") {
      alert("카테고리를 골라주세요");
      return;
    }

    if (isEdit == false) {
      const WriteData = async () => {
        try {
          const docRef = await setDoc(
            doc(firestore, "products", `${now}_${category}`),
            newProduct
          );
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      };
      WriteData();
    }

    // if (isEdit == false) {
    //   fetch(
    //     `https://carrot-621db-default-rtdb.firebaseio.com/products/${category}.json`,
    //     {
    //       method: "POST",
    //       body: JSON.stringify(newProduct),
    //       headers: {
    //         "Content-Type": "application.json",
    //       },
    //     }
    //   );
    // } else {
    //   fetch(
    //     `https://carrot-621db-default-rtdb.firebaseio.com/products/${category}/${id}.json`,
    //     {
    //       method: "PUT",
    //       body: JSON.stringify(newProduct),
    //       headers: {
    //         "Content-Type": "application.json",
    //       },
    //     }
    //   );
    // }
    router.push("/Home");
  };

  const cancelHandler = () => {
    router.push("/Home");
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
        <p>
          <input
            placeholder={product?.price || "₩ 가격"}
            ref={priceInputRef}
            type="number"
            name="price"
            required
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

export default NewProductForm;
