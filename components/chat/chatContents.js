import React, { useContext, useRef, useState, useEffect } from "react";
import classes from "./chatContents.module.css";
import { firestore } from "@/components/firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import UserContext from "../context/user-context";

function ChatContents({ chatId }) {
  const { loginDisplayName } = useContext(UserContext);
  const chatRef = useRef();
  const [messages, setMessages] = useState([]);

  const today = new Date();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  const formattedHours = hours % 12 || 12; // convert to 12-hour format

  const now = `${ampm} ${formattedHours}:${minutes < 10 ? "0" : ""}${minutes}`;

  useEffect(() => {
    const messagesRef = collection(firestore, "chat", chatId, "message");

    const unsubscribe = onSnapshot(messagesRef, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => doc.data());
      messagesData.sort(function (a, b) {
        return a.realtime - b.realtime;
      });
      setMessages(messagesData);
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  async function messageHandler(e) {
    e.preventDefault();

    const messagesRef = collection(firestore, "chat", chatId, "message");

    await addDoc(messagesRef, {
      msg: chatRef.current.value,
      who: loginDisplayName,
      time: now,
      realtime: Date.now(),
    });

    chatRef.current.value = "";
  }

  return (
    <>
      <main className={classes.main}>
        <ul className={classes.chatUl}>
          {messages &&
            messages.map((m, idx) => {
              return (
                <li
                  key={`${Date.now()}_${idx}`}
                  className={`${m.who == loginDisplayName && classes.me}`}
                >
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
            <img src="/images/send.png" />
          </button>
        </form>
      </footer>
    </>
  );
}

export default ChatContents;
