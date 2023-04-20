import React, {useRef, useState, useEffect} from "react";
import classes from "./chatContents.module.css";
import {firestore} from "../firebase";
import {addDoc, collection, onSnapshot} from "firebase/firestore";
import Image from "next/image";
import {useAppSelector} from "../../Hooks/storeHook";

const ChatContents: React.FC<{chatId: string; now: number}> = ({chatId, now}) => {
  const nickname = useAppSelector((state) => state.User.nickname);

  const [messages, setMessages] = useState([]);
  const chatRef = useRef<HTMLInputElement>();
  const lastMsgRef = useRef<HTMLLIElement>();

  //실시간 채팅상황 구독
  useEffect(() => {
    const messagesRef = collection(firestore, "chat", chatId, "message");

    const unsubscribe = onSnapshot(messagesRef, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => doc.data());
      messagesData.sort((a, b) => {
        return a.realtime - b.realtime;
      });
      setMessages(messagesData);
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  //메세지 입력시 message 컬렉션에 doc 추가
  const messageHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (chatRef.current.value === "") {
      chatRef.current.value = "메세지를 입력해주세요";
      setTimeout(() => {
        chatRef.current.value = "";
      }, 500);
      return;
    } else {
      const messagesRef = collection(firestore, "chat", chatId, "message");

      await addDoc(messagesRef, {
        msg: chatRef.current.value,
        who: nickname,
        time: now,
        realtime: Date.now(),
      });

      chatRef.current.value = "";

      //마지막 메세지에 포커스
      lastMsgRef.current && lastMsgRef.current.scrollIntoView({behavior: "smooth"});
    }
  };

  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages]);

  return (
    <>
      <main className={classes.main}>
        <ul className={classes.chatUl}>
          {messages &&
            messages.map((m, idx) => {
              // 마지막 메세지에만 lastMsgRef추가
              const isLast = idx === messages.length - 1;
              const ref = isLast ? lastMsgRef : null;

              return (
                <li key={`${Date.now()}_${idx}`} className={`${m.who == nickname && classes.me}`} ref={ref}>
                  <p className={classes.time}>{m.time}</p>
                  <p className={classes.msg}>{m.msg}</p>
                </li>
              );
            })}
        </ul>
      </main>
      <footer className={classes.footer}>
        <form onSubmit={messageHandler}>
          <input placeholder="메시지 보내기" ref={chatRef}></input>
          <button>
            <Image src="/images/send.png" alt="send" width={26} height={26} />
          </button>
        </form>
      </footer>
    </>
  );
};

export default ChatContents;
