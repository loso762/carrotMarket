import React, { useContext, useEffect, useState } from "react";
import classes from "./chatList.module.css";
import { firestore } from "@/components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import UserContext from "../context/user-context";
import { useRouter } from "next/router";

function ChatListForm(props) {
  const { loginDisplayName } = useContext(UserContext);
  const [chatList, setChatList] = useState([]);
  const router = useRouter();

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

  function calcTime(lastTime) {
    let minutesAgo = Math.round((Date.now() - lastTime) / 1000 / 60);

    if (minutesAgo < 60) {
      minutesAgo = `${minutesAgo}분`;
    } else if (minutesAgo < 60 * 24) {
      minutesAgo = `${Math.round(minutesAgo / 60)}시간`;
    } else {
      minutesAgo = `${Math.floor(minutesAgo / 60 / 24)}일`;
    }
    return minutesAgo;
  }

  //참여자 2명중에 본인 아이디 제거하고 상대방 아이디만 가져오기
  function filteringName(ChatId, myName) {
    const temp = ChatId.replace("_", "");
    return temp.replace(myName, "");
  }

  return (
    <>
      <header className={classes.header}>채팅</header>
      <ul className={classes.chatul}>
        {chatList.map((c) => {
          return (
            <li
              key={c.id}
              className={classes.chatli}
              onClick={() => router.push(`/Chat/${c.id}`)}
            >
              <img src="/images/profile.jpg" alt="profile" />
              <div>
                <p>{filteringName(c.id, loginDisplayName)}</p>
                {calcTime(c.date)} 전 · {c.dong}
              </div>
              <p>마지막말</p>
              <img src={c.img} alt="productImg" />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default ChatListForm;
