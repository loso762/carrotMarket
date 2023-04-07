import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./chatList.module.css";
import { firestore } from "@/components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import UserContext from "../context/user-context";
import { useRouter } from "next/router";
import ChatPreview from "./chatPreview";

function ChatListForm(props) {
  const { loginDisplayName } = useContext(UserContext);
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    async function fetchChatList() {
      const tempChat = [];
      const chatListRef = collection(firestore, "chat");

      const q = query(
        chatListRef,
        where("party", "array-contains", loginDisplayName)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        tempChat.push({ ...doc.data(), id: doc.id });
      });

      setChatList(tempChat);
    }
    fetchChatList();
  }, [loginDisplayName]);

  return (
    <>
      <header className={classes.header}>채팅</header>
      <ul className={classes.chatul}>
        {chatList.map((c) => {
          return <ChatPreview c={c} key={c.id} />;
        })}
      </ul>
    </>
  );
}

export default ChatListForm;