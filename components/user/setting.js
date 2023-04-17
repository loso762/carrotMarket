import {ClipLoader} from "react-spinners";
import {FiCamera} from "react-icons/fi";
import {IoIosArrowBack} from "react-icons/io";
import React, {useEffect, useState, useRef} from "react";
import classes from "./setting.module.css";
import {storage, firestore} from "@/components/firebase";
import {ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
import {collection, doc, updateDoc, where, getDocs, query} from "firebase/firestore";
import Image from "next/image";
import {useSelector} from "react-redux";
import {userAction} from "@/store/user-slice";

const Setting = ({urlHandler, image, setoff}) => {
  const loginID = useSelector((state) => state.User.loginID);
  const nickname = useSelector((state) => state.User.nickname);

  const [isLoading, setIsLoading] = useState(false);
  const [imageChange, setimageChange] = useState(true);
  const [errorMsg, seterrorMsg] = useState(null);
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
  }, [imageChange, imageRef, urlHandler]);

  async function submitHandler(e) {
    e.preventDefault();

    if (inputRef.current.value !== "") {
      //닉네임 중복여부 확인
      firestore
        .collection("users")
        .where("nickname", "==", inputRef.current.value)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            seterrorMsg("이미 존재하는 닉네임입니다.");
            setTimeout(() => {
              seterrorMsg(null);
            }, 2000);
          } else {
            const prevname = nickname;
            const productRef = collection(firestore, "products");

            getDocs(query(productRef, where("nickname", "==", prevname))).then((querySnapshot) => {
              querySnapshot.forEach((item) => {
                updateDoc(doc(firestore, "products", item.id), {
                  nickname: inputRef.current.value,
                });
              });

              updateDoc(doc(firestore, "users", loginID), {
                nickname: inputRef.current.value,
              }).then(() => {
                dispatch(userAction.nicknameChange(nickname));
                setoff();
              });
            });
          }
        });
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
        <input placeholder={nickname} id="name" ref={inputRef} />
      </div>
      {errorMsg && inputRef.current.value !== "" && <div className={classes.errorMsg}>{errorMsg}</div>}
    </form>
  );
};

export default Setting;
