import React from "react";
import FooterMenu from "../../components/layout/FooterMenu";
import ChatListForm from "../../components/chat/chatList";

const Chat: React.FC = () => {
  return (
    <>
      <ChatListForm />
      <FooterMenu />
    </>
  );
};

export default Chat;
