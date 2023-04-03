import classes from "./ProductDetail.module.css";
import { useContext, useState } from "react";
import ProductContext from "../context";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineHeart, AiFillHeart, AiFillHome } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { FaPen } from "react-icons/fa";

function ProductDetail({ data, id }) {
  const { setIsEdit, SelectedCategory } = useContext(ProductContext);
  const [isLike, setIsLike] = useState(false);

  let price;
  if (data.price) {
    price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const now = Date.now();
  let minutesAgo = Math.round((now - data.time) / 1000 / 60);

  if (minutesAgo < 60) {
    minutesAgo = `${minutesAgo}분`;
  } else if (minutesAgo < 60 * 24) {
    minutesAgo = `${Math.round(minutesAgo / 60)}시간`;
  } else {
    minutesAgo = `${Math.floor(minutesAgo / 60 / 24)}일`;
  }

  const temp = 36.5;
  let tempImoticon = "🙂";
  if (temp < 35) {
    tempImoticon = "😨";
  } else if (temp > 38) {
    tempImoticon = "😀";
  }

  return (
    <section className={classes.detail}>
      <figure className={classes.Img}>
        <Link href={`/${SelectedCategory}`}>
          <IoIosArrowBack />
        </Link>

        <Link href={`/Home`}>
          <AiFillHome />
        </Link>

        <Link
          href={`/NewProduct?id=${id}`}
          onClick={() => {
            setIsEdit(true);
          }}
        >
          <FaPen />
        </Link>

        <img src={data.img} alt={data.title} />
      </figure>

      <div className={classes.userInfo}>
        <div className={classes.userInfoBox}>
          <Image
            src="/images/profile.jpg"
            alt="profileImg"
            width={35}
            height={35}
          />
          <p>loso762</p>
          <p>{data.dong}</p>
        </div>

        <div className={classes.temperatureBox}>
          <div className={classes.tempInfo}>
            <div className={classes.temperature}>
              {temp}°C
              <div className={classes.tempBar}>
                <p style={{ width: `${temp}%` }} />
              </div>
            </div>
            <div className={classes.tempImoticon}>{tempImoticon}</div>
          </div>
          <p className={classes.tempEx}>매너온도</p>
        </div>
      </div>

      <div className={classes.productInfo}>
        <h1>{data.title}</h1>
        <div>
          <Link href={`/${data.category}`}>{data.category} </Link>
          <p>·{minutesAgo} 전</p>
        </div>
        <p>{data.description}</p>
      </div>

      <div className={classes.footer}>
        <button
          onClick={() => setIsLike((prev) => !prev)}
          className={classes.likeButton}
        >
          {isLike ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
        <p>{price}원</p>
        <button className={classes.chatButton}>채팅하기</button>
      </div>
    </section>
  );
}

export default ProductDetail;
