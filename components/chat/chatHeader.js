import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import classes from "./chatHeader.module.css";
import Link from "next/link";
import { firestore } from "@/components/firebase";
import {
  doc,
  collection,
  updateDoc,
  getDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

const today = new Date();
const hours = today.getHours();
const minutes = today.getMinutes();
const ampm = hours >= 12 ? "오후" : "오전";
const formattedHours = hours % 12 || 12; // convert to 12-hour format

const now = `${ampm} ${formattedHours}:${minutes < 10 ? "0" : ""}${minutes}`;

function ChatHeader({ name, chatId }) {
  const router = useRouter();

  async function chatOffHandler() {
    const chatInfoRef = doc(collection(firestore, "chat"), chatId);

    const chatInfoSnap = await getDoc(chatInfoRef);

    if (chatInfoSnap.data().party.length == 1) {
      await deleteDoc(chatInfoRef);
    } else {
      await updateDoc(chatInfoRef, {
        party: [name],
      });

      const messagesRef = collection(firestore, "chat", chatId, "message");

      await new Promise((resolve) => setTimeout(resolve, 2000));
      await addDoc(messagesRef, {
        msg: "상대방이 대화방을 나갔습니다.",
        who: "system",
        time: now,
        realtime: Date.now(),
      });
    }
  }

  return (
    <header className={classes.header}>
      <IoIosArrowBack
        onClick={() => {
          router.push("/Chat");
        }}
      />
      <p>{name}</p>
      <Link href={"/Chat"} onClick={chatOffHandler}>
        나가기
      </Link>
    </header>
  );
}

export default ChatHeader;
