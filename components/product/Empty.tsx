import React from "react";
import WriteBtn from "./writeBtn";
import Image from "next/image";

const Empty: React.FC = () => {
  return (
    <>
      <div className="empty">
        <Image src="/images/empty.webp" alt="" width={100} height={100} />텅
      </div>
      <WriteBtn isScroll={false} hoverBtn={() => {}} />
    </>
  );
};

export default Empty;
