import {ClipLoader} from "react-spinners";
import {FiCamera} from "react-icons/fi";
import {IoIosArrowBack} from "react-icons/io";
import React, {useEffect, useState, useRef, useContext} from "react";
import classes from "./setting.module.css";
import {storage, firestore} from "@/components/firebase";
import {ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
import {collection, doc, updateDoc, where, getDocs, query, getDoc, setDoc} from "firebase/firestore";
import Image from "next/image";
import UserContext from "../context/user-context";

function Setting({urlHandler, image, setoff}) {
  const {loginID, loginDisplayName, setloginDisplayName, likeProducts} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [imageChange, setimageChange] = useState(true);
  const inputRef = useRef();
  const imageRef = ref(storage, `profile/${loginID}`);

  async function ImageHandler(e) {
    setIsLoading(true);
    e.target.files[0] &&
      getDownloadURL(imageRef)
        .then(() => {
          deleteObject(imageRef).then(() => {
            uploadBytes(imageRef, e.target.files[0]).then(() => {
              setimageChange((prev) => !prev);
            });
          });
        })
        .catch(() => {
          uploadBytes(imageRef, e.target.files[0]).then(() => {
            setimageChange((prev) => !prev);
          });
        });
  }

  useEffect(() => {
    getDownloadURL(imageRef)
      .then((url) => {
        urlHandler(url);
        setIsLoading(false);
      })
      .catch(() => {
        return;
      });
  }, [imageChange]);

  async function submitHandler(e) {
    e.preventDefault();

    if (inputRef.current.value !== "") {
      const productRef = collection(firestore, "products");
      const q = query(productRef, where("nickname", "==", loginDisplayName));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((item) => {
        updateDoc(doc(firestore, "products", item.id), {
          nickname: inputRef.current.value,
        });
      });

      await updateDoc(doc(firestore, "users", loginID), {
        nickname: inputRef.current.value,
      });

      // likeProducts.forEach((item) => {
      //   getDoc(doc(firestore, "products", item.id)).then((product) => {
      //     const likepeople = product.data().wholike;
      //     const idx = likepeople.findIndex((el) => el === loginDisplayName);
      //     likepeople[idx] = inputRef.current.value;
      //     console.log(likepeople);

      //     setDoc(doc(firestore, "products", item.id), {
      //       ...product.data(),
      //       wholike: likepeople,
      //     });
      //   });
      // });

      setloginDisplayName(inputRef.current.value);

      setoff();
    }
  }

  return (
    <form className={classes.setBox}>
      <div className={classes.header}>
        <IoIosArrowBack onClick={setoff} />
        프로필수정 <button onClick={submitHandler}>완료</button>
      </div>
      <div className={classes.info}>
        {isLoading ? (
          <div className={classes.loadingBox}>
            <ClipLoader size={20} color={"#fd9253"} />
          </div>
        ) : (
          <Image width={90} height={90} alt="profile" src={image} />
        )}
        <p>
          <label htmlFor="file">
            <FiCamera />
          </label>
        </p>
        <input type="file" id="file" onChange={ImageHandler} autoComplete="off" />
        <label htmlFor="name">닉네임</label>
        <input placeholder={loginDisplayName} id="name" ref={inputRef} />
      </div>
    </form>
  );
}

export default Setting;
