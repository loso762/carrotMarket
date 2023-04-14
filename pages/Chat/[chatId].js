import ChatHeader from "@/components/chat/chatHeader";
import {firestore} from "@/components/firebase";
import {doc, getDoc, getDocs, collection} from "firebase/firestore";
import {useRouter} from "next/router";
import React, {useEffect, useState, useContext} from "react";
import ChatContents from "@/components/chat/chatContents";
import UserContext from "@/components/context/user-context";

function ChatRoom() {
  const [messageData, setMessageData] = useState();
  const [chatpartnerName, setchatpartnerName] = useState();
  const [chatpartnerID, setchatpartnerID] = useState();
  const router = useRouter();
  const {loginID} = useContext(UserContext);

  useEffect(() => {
    const fetchChat = async () => {
      //메세지 내용가져오기
      const messagesRef = collection(firestore, "chat", router.query.chatId, "message");
      const messagesSnap = await getDocs(messagesRef);
      const messages = messagesSnap.docs.map((doc) => doc.data());

      //시간순으로 정렬
      messages.sort((a, b) => {
        return a.realtime - b.realtime;
      });

      setMessageData(messages);
    };

    const fetchpartner = async () => {
      const partyID = router.query.chatId.split("-")[0].split("_");
      const partnerID = partyID.filter((el) => el !== loginID);
      const partnerInfo = await getDoc(doc(firestore, "users", ...partnerID));
      setchatpartnerName(partnerInfo.data().nickname);
      setchatpartnerID(partnerID);
    };

    fetchpartner();
    fetchChat();
  }, [router.query.chatId, loginID]);

  //현재 시간 구하는 함수
  const today = new Date();
  const hours = today.getHours() % 12 || 12;
  const minutes = today.getMinutes();
  const ampm = today.getHours() >= 12 ? "오후" : "오전";
  const now = `${ampm} ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

  return (
    <>
      <ChatHeader
        chatpartnerID={chatpartnerID}
        chatpartnerName={chatpartnerName}
        chatId={router.query.chatId}
        now={now}
      />
      {router.query.chatId && messageData && (
        <ChatContents msgs={messageData} chatId={router.query.chatId} now={now} />
      )}
    </>
  );
}

export default ChatRoom;
