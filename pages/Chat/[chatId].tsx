import ChatHeader from "../../components/chat/chatHeader";
import {firestore} from "../../components/firebase";
import {doc, getDoc} from "firebase/firestore";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import ChatContents from "../../components/chat/chatContents";
import {useAppSelector} from "../../Hooks/storeHook";

const ChatRoom: React.FC = () => {
  const loginID = useAppSelector((state) => state.User.loginID);

  const [chatpartnerName, setchatpartnerName] = useState("");
  const [chatpartnerID, setchatpartnerID] = useState("");
  const router = useRouter();

  useEffect(() => {
    //채팅파트너 id,닉네임 가져오기
    const fetchpartner = async () => {
      const full = router.query.chatId as string;
      const partnerID = full.replace(loginID, "").replace("-", "").match(/(.*)_/)?.[1];

      const partnerInfo = await getDoc(doc(firestore, "users", partnerID));
      setchatpartnerName(partnerInfo.data().nickname);
      setchatpartnerID(partnerID);
    };

    fetchpartner();
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
      {router.query.chatId && <ChatContents chatId={router.query.chatId} now={now} />}
    </>
  );
};

export default ChatRoom;
