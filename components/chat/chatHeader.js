import {IoIosArrowBack} from "react-icons/io";
import {useRouter} from "next/router";
import classes from "./chatHeader.module.css";
import Link from "next/link";
import {firestore} from "../../components/firebase";
import {doc, collection, updateDoc, getDoc, deleteDoc, addDoc} from "firebase/firestore";

const ChatHeader = ({chatpartnerID, chatpartnerName, chatId, now}) => {
  const router = useRouter();

  const chatOffHandler = async () => {
    const chatInfoRef = doc(collection(firestore, "chat"), chatId);

    const chatInfoSnap = await getDoc(chatInfoRef);
    console.log(chatInfoSnap.data());

    if (chatInfoSnap.data()?.partyID.length == 1) {
      console.log(chatInfoSnap.data()?.partyID.length);
      await deleteDoc(chatInfoRef);
    } else {
      await updateDoc(chatInfoRef, {partyID: chatpartnerID, left: chatpartnerID});
      const messagesRef = collection(firestore, "chat", chatId, "message");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await addDoc(messagesRef, {
        msg: "상대방이 대화방을 나갔습니다.",
        who: "system",
        time: now,
        realtime: Date.now(),
      });
    }
  };

  return (
    <header className={classes.header}>
      <IoIosArrowBack
        onClick={() => {
          router.push("/Chat");
        }}
      />
      <p>{chatpartnerName}</p>
      <Link href={"/Chat"} onClick={chatOffHandler}>
        나가기
      </Link>
    </header>
  );
};

export default ChatHeader;
