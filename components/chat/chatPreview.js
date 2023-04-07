import React, { useContext, useEffect, useState } from "react";
import classes from "./chatPreview.module.css";
import { firestore } from "@/components/firebase";
import {
  query,
  orderBy,
  limit,
  collection,
  onSnapshot,
} from "firebase/firestore";
import UserContext from "../context/user-context";
import { useRouter } from "next/router";

function ChatPreview({ c, key }) {
  const router = useRouter();
  const { loginDisplayName } = useContext(UserContext);
  const [lastMsg, setLastMsg] = useState("");
  const [lastTime, setlastTime] = useState("");

  //상대방 아이디 가져오기
  function filteringName(ChatId, myName) {
    const temp = ChatId.replace("_", "");
    return temp.replace(myName, "");
  }

  useEffect(() => {
    //마지막 채팅 시간
    function calcTime(last) {
      let minutesAgo = Math.round((Date.now() - last) / 1000 / 60);

      if (minutesAgo < 60) {
        minutesAgo = `${minutesAgo}분`;
      } else if (minutesAgo < 60 * 24) {
        minutesAgo = `${Math.round(minutesAgo / 60)}시간`;
      } else {
        minutesAgo = `${Math.floor(minutesAgo / 60 / 24)}일`;
      }

      setlastTime(minutesAgo);
    }

    async function fetchData() {
      //메세지 내용가져오기
      const messagesRef = collection(firestore, "chat", c.id, "message");

      const q = query(messagesRef, orderBy("realtime", "desc"), limit(1));

      const unsub = onSnapshot(q, (querySnapshot) => {
        const latestDoc = querySnapshot.docs[0];
        if (latestDoc) {
          const latestData = latestDoc.data();
          setLastMsg(latestData.msg);
          calcTime(latestData.realtime);
        }
      });
    }

    fetchData();
  }, [c.id]);

  return (
    <li
      className={classes.chatli}
      onClick={() => router.push(`/Chat/${c.id}`)}
      key={key}
    >
      <img src="/images/profile.jpg" alt="profile" />
      <div>
        <p>{filteringName(c.id, loginDisplayName)}</p>
        {lastTime} 전 · {c.dong}
      </div>
      <p>{lastMsg}</p>
      <img src={c.img} alt="productImg" />
    </li>
  );
}

export default ChatPreview;