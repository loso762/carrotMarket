import ChatHeader from "@/components/chat/chatHeader";
import { firestore } from "@/components/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState, useContext } from "react";
import ChatContents from "@/components/chat/chatContents";
import UserContext from "@/components/context/user-context";

function ChatRoom(props) {
  const [messageData, setMessageData] = useState();
  const router = useRouter();
  const { loginDisplayName } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      //메세지 내용가져오기
      const messagesRef = collection(
        firestore,
        "chat",
        router.query.chatId,
        "message"
      );
      const messagesSnap = await getDocs(messagesRef);
      const messages = messagesSnap.docs.map((doc) => doc.data());

      messages.sort(function (a, b) {
        return a.realtime - b.realtime;
      });
      setMessageData(messages);
    }

    fetchData();
  }, [router.query.chatId]);

  const temp = router.query.chatId && router.query.chatId.replace(`_`, "");
  const chatPartner = temp && temp.replace(loginDisplayName, "");

  return (
    <>
      <ChatHeader name={chatPartner} chatId={router.query.chatId} />
      {router.query.chatId && messageData && (
        <ChatContents msgs={messageData} chatId={router.query.chatId} />
      )}
    </>
  );
}

export default ChatRoom;
