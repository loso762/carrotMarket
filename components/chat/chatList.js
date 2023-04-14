import React, {useContext, useEffect, useRef, useState} from "react";
import classes from "./chatList.module.css";
import {firestore} from "@/components/firebase";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import UserContext from "../context/user-context";
import ChatPreview from "./chatPreview";
import {ClipLoader} from "react-spinners";

const ChatListForm = () => {
  const {isLoggedIn, loginID} = useContext(UserContext);
  const [chatList, setChatList] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    //채팅내역 불러오기
    if (isLoggedIn) {
      const chatListRef = collection(firestore, "chat");
      const q = query(chatListRef, where("partyID", "array-contains", loginID));

      onSnapshot(q, (snapshot) => {
        const tempChat = [];
        snapshot.forEach((doc) => {
          tempChat.push({id: doc.id, data: doc.data()});
        });

        setChatList(tempChat);
        setisLoading(false);
      });
    }
  }, [isLoggedIn, loginID]);

  const LoginErrorMsg = <div className={classes.Error}>로그인이 필요해요!</div>;

  return (
    <>
      <header className={classes.header}>채팅</header>
      {!isLoggedIn ? (
        LoginErrorMsg
      ) : chatList.length === 0 ? (
        <div className={classes.Error}>
          {isLoading ? <ClipLoader color="#fd9253" size={30} /> : "채팅을 시작해 보세요!"}
        </div>
      ) : (
        <ul className={classes.chatul}>
          {chatList.map((c) => {
            return <ChatPreview c={c.data} id={c.id} key={c.id} LoadingEnd={() => setisLoading(false)} />;
          })}
        </ul>
      )}
    </>
  );
};

export default ChatListForm;
