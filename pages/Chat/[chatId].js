import ChatHeader from "@/components/chat/chatHeader";
import { firestore } from "@/components/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState, useContext } from "react";
import ChatContents from "@/components/chat/chatContents";
import UserContext from "@/components/context/user-context";

function ChatRoom() {
  const [messageData, setMessageData] = useState();
  const [chatpartner, setchatpartner] = useState();
  const router = useRouter();
  const { loginDisplayName } = useContext(UserContext);

  useEffect(() => {
    async function fetchChat() {
      //메세지 내용가져오기
      const messagesRef = collection(
        firestore,
        "chat",
        router.query.chatId,
        "message"
      );
      const messagesSnap = await getDocs(messagesRef);
      const messages = messagesSnap.docs.map((doc) => doc.data());

      //시간순으로 정렬
      messages.sort(function (a, b) {
        return a.realtime - b.realtime;
      });
      setMessageData(messages);
    }

    fetchChat();
  }, [router.query.chatId]);

  //채팅상대 이름 불러오기
  useEffect(() => {
    let chatPartner =
      router.query.chatId &&
      router.query.chatId.replace(`_`, "").replace(loginDisplayName, "");
    let index = chatPartner.indexOf("-");
    setchatpartner(chatPartner.substring(0, index));
  }, [loginDisplayName, router.query.chatId]);

  //현재 시간 구하는 함수
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();
  const hours = today.getHours() % 12 || 12;
  const minutes = today.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  const now = `${ampm} ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

  return (
    <>
      <ChatHeader name={chatpartner} chatId={router.query.chatId} now={now} />
      {router.query.chatId && messageData && (
        <ChatContents
          msgs={messageData}
          chatId={router.query.chatId}
          now={now}
        />
      )}
    </>
  );
}

export default ChatRoom;
