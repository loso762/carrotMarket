import React, {useContext, useEffect, useState} from "react";
import classes from "./chatPreview.module.css";
import {firestore} from "@/components/firebase";
import Image from "next/image";
import {query, orderBy, limit, collection, onSnapshot} from "firebase/firestore";
import UserContext from "../context/user-context";
import {useRouter} from "next/router";
import {storage} from "@/components/firebase";
import {ref, getDownloadURL} from "firebase/storage";
import {doc, getDoc} from "firebase/firestore";

const ChatPreview = ({c, id, LoadingEnd}) => {
  const router = useRouter();
  const {loginID} = useContext(UserContext);
  const [lastMsg, setLastMsg] = useState("");
  const [lastTime, setlastTime] = useState("");
  const [chatpartner, setchatpartner] = useState();
  const [userUrl, setuserUrl] = useState("/images/profile.jpg");

  //상대방 아이디 가져오기
  useEffect(() => {
    async function fetchpartner() {
      if (c.left.length == 1) {
        const partnerInfo = await getDoc(doc(firestore, "users", ...c.left));
        setchatpartner(partnerInfo.data().nickname);
      } else {
        const partnerID = c.partyID.filter((el) => el !== loginID);
        const partnerInfo = await getDoc(doc(firestore, "users", ...partnerID));
        setchatpartner(partnerInfo.data().nickname);
      }
    }
    fetchpartner();
  }, [c.partyID, loginID, c.left]);

  const imageRef = ref(storage, `profile/${c.partyID.filter((p) => p !== loginID)}`);

  useEffect(() => {
    getDownloadURL(imageRef)
      .then((url) => {
        setuserUrl(url);
      })
      .catch(() => {
        return;
      });
  }, [imageRef]);

  useEffect(() => {
    //마지막 채팅 시간
    const calcTime = (last) => {
      let minutesAgo = Math.round((Date.now() - last) / 1000 / 60);

      if (minutesAgo < 60) {
        minutesAgo = `${minutesAgo}분`;
      } else if (minutesAgo < 60 * 24) {
        minutesAgo = `${Math.round(minutesAgo / 60)}시간`;
      } else {
        minutesAgo = `${Math.floor(minutesAgo / 60 / 24)}일`;
      }

      setlastTime(minutesAgo);
    };

    async function fetchData() {
      //메세지 내용가져오기
      const messagesRef = collection(firestore, "chat", id, "message");

      const q = query(messagesRef, orderBy("realtime", "desc"), limit(1));

      const unsub = onSnapshot(q, (querySnapshot) => {
        const latestDoc = querySnapshot.docs[0];
        if (latestDoc) {
          const latestData = latestDoc.data();
          setLastMsg(latestData.msg);
          calcTime(latestData.realtime);
        }
      });

      LoadingEnd;
    }

    fetchData();
  }, [id, LoadingEnd]);

  const openChatHandler = (e) => {
    e.stopPropagation();
    router.push(`/Chat/${id}`);
  };

  const imgClickHandler = (e) => {
    e.stopPropagation();
    router.push(`/${c.category}/${c.product}`);
  };

  return (
    <li className={classes.chatli} onClick={openChatHandler}>
      {userUrl && <Image src={userUrl} alt="profile" width={40} height={40} />}
      <div>
        <p>{chatpartner}</p>
        {lastTime} 전 · {c.dong}
      </div>
      <p>{lastMsg}</p>
      <Image src={c.img} alt="productImg" width={40} height={40} onClick={imgClickHandler} />
    </li>
  );
};

export default ChatPreview;
