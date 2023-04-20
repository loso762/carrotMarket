import React, {useRef, useEffect, useState, MouseEvent} from "react";
import classes from "./WriteProduct.module.css";
import {useRouter} from "next/router";
import {IoIosArrowBack} from "react-icons/io";
import {firestore, storage} from "../firebase";
import {ref, uploadBytes, deleteObject} from "firebase/storage";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {MdAddAPhoto} from "react-icons/md";
import imageCompression from "browser-image-compression";
import {ClipLoader} from "react-spinners";
import {useAppSelector, useAppDispatch} from "../../Hooks/storeHook";
import {productAction} from "../../store/product-slice";
import {ItemData} from "../../store/product-slice";

const WriteProduct: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loginID = useAppSelector((state) => state.User.loginID);
  const nickname = useAppSelector((state) => state.User.nickname);
  const temp = useAppSelector((state) => state.User.temp);

  const latitude = useAppSelector((state) => state.Products.latitude);
  const longitude = useAppSelector((state) => state.Products.longitude);
  const dong = useAppSelector((state) => state.Products.dong);
  const categoryList = useAppSelector((state) => state.Products.categoryList);
  const isEdit = useAppSelector((state) => state.Products.isEdit);
  const category = useAppSelector((state) => state.Products.category);

  const newList = categoryList.slice();
  newList.splice(0, 1, "카테고리");

  const [isFree, setIsFree] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  //수정일 경우 데이터 가져오기
  const [product, setProduct] = useState<ItemData>();
  const productId = router.query.id as string;

  const categoryRef = useRef<HTMLSelectElement>();
  const titleInputRef = useRef<HTMLInputElement>();
  const priceInputRef = useRef<HTMLInputElement>();
  const descriptionInputRef = useRef<HTMLTextAreaElement>();

  const now = Date.now();

  const [image, setImage] = useState<Blob>();

  useEffect(() => {
    async function getData() {
      const docRef = doc(firestore, "products", productId);
      const docSnap = await getDoc(docRef);
      setProduct(docSnap.data() as ItemData);
    }

    if (isEdit) {
      getData();
    }
  }, [productId, isEdit, category]);

  const ImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.2, // max image size
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      const blob = new Blob([compressedFile], {type: compressedFile.type});
      // set the new blob as the image state
      setImage(blob);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(image);
  const ImgUpload = () => {
    // 게시물수정일 경우는 db에 있는 사진 수정
    if (isEdit) {
      const imageRef = ref(storage, `images/${product.time}`);
      deleteObject(imageRef).then(() => {
        uploadBytes(imageRef, image);
      });
    } else {
      const imageRef = ref(storage, `images/${now}`);
      uploadBytes(imageRef, image);
    }
  };

  const ProductID = isEdit ? productId : `${now}`;

  //db에 새로 올린 게시물 추가하는 함수
  const WriteData = async (newProduct: ItemData) => {
    try {
      await setDoc(doc(firestore, "products", ProductID), newProduct);
    } catch (e) {
      console.error("게시글 등록 실패", e);
    }
  };

  //완료 버튼 클릭 시
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setisLoading(true);

    const enteredcategory = categoryRef.current.value;
    const enteredTitle = titleInputRef.current.value;
    const enteredPrice = isFree ? "나눔" : priceInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    if (!isFree && !priceInputRef.current.value && !isEdit) {
      alert("가격을 입력해주세요!");
      return;
    }

    if (enteredcategory == "카테고리") {
      alert("카테고리를 골라주세요!");
      return;
    }

    if (!image && !isEdit) {
      alert("이미지를 업로드해주세요!");
      return;
    }

    const newProduct = {
      title: enteredTitle || product?.title,
      price: enteredPrice || product?.price,
      description: enteredDescription || product?.description,
      Latitude: latitude,
      Longitude: longitude,
      category: enteredcategory,
      dong: dong,
      nickname: nickname,
      temp: temp,
      ID: loginID,
      chat: [],
      show: 0,
      wholike: [],
      soldout: null,
      time: isEdit ? product.time : now,
      likes: isEdit ? product.likes : 0,
    };

    // 사진은 firestorage로 나머지 정보는 firestore로 업로드
    // 게시물수정일 경우 사진을 안올리면 전에 있던 사진 유지
    if (typeof image == "object") {
      ImgUpload();
    }

    WriteData(newProduct);

    dispatch(productAction.setCategory(enteredcategory));
    sessionStorage.setItem("category", enteredcategory);

    setTimeout(() => {
      router.push(`/${enteredcategory}`);
      setisLoading(false);
    }, 1300);
  };

  const cancelHandler = () => {
    if (!isEdit) {
      router.push(category);
    } else {
      router.push(`/${product.category}/${productId}`);
    }
  };

  return (
    <>
      <header className={classes.header}>
        <IoIosArrowBack onClick={cancelHandler} /> {isEdit ? "수정하기" : "중고거래 글쓰기"}
      </header>

      <form id="form" className={classes.form} onSubmit={submitHandler}>
        <p>
          <select ref={categoryRef} defaultValue={category}>
            {newList.map((category, idx) => {
              return (
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
            required={!isEdit}
          />
        </p>
        <p className={classes.priceBox}>
          <input
            placeholder={`${product?.price || "₩ 가격"}`}
            ref={priceInputRef}
            type="number"
            name="price"
            disabled={isFree}
          />
          <label htmlFor="freeCheck">나눔</label>
          <input type="checkbox" name="freeCheck" value="0" onClick={() => setIsFree((prev) => !prev)} />
        </p>
        <p className={classes.filebox}>
          <input className={classes.uploadName} value={image && image.type} placeholder="첨부파일" />
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
            rows={7}
            required={!isEdit}
          />
        </p>
        <div className={classes.actions}>
          <button type="button" onClick={cancelHandler}>
            Cancel
          </button>
          <button>완료</button>
        </div>
      </form>

      {isLoading && (
        <div className={classes.uploading}>
          게시글 올리는 중<ClipLoader size={35} color={"#fd9253"} />
        </div>
      )}
    </>
  );
};

export default WriteProduct;
