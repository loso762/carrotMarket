import classes from './ProductDetail.module.css';
import {AiOutlineHeart , AiFillHeart, AiFillHome} from 'react-icons/ai'
import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import Link from 'next/link';
import { useRouter } from 'next/router';

function ProductDetail({data}) {
  const router = useRouter();
  
  const [isLike,setIsLike] = useState(false);

  let price;

  if (data.price) {
    price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const now = Date.now();
  let minutesAgo = Math.round((now - data.time)/ 1000 / 60); 

  if (minutesAgo < 60){
    minutesAgo = `${minutesAgo}분`
  } else if (minutesAgo < 60*24){
    minutesAgo = `${Math.round(minutesAgo/60)}시간`
  } else {
    minutesAgo = `${Math.floor(minutesAgo/60/24)}일`
  }

  return (
    <section className={classes.detail}>

      <figure className={classes.Img}>
        <Link href={`/${router.query.products}`}>
          <IoIosArrowBack/>
        </Link>
        
        <Link href={`/Home`}>
          <AiFillHome/>
        </Link>
        
        <img
          src={data.img}
          alt={data.title}
        />
      </figure>

      <div className={classes.userInfo}>
        <p>loso762</p>
        <p>{data.dong}</p>
      </div>
      
      <div className={classes.productInfo}>
        <h1>{data.title}</h1>
        <Link href={`/${data.category}`}>{data.category}</Link>
        <p>{minutesAgo} 전</p>
        <p>{data.description}</p>
      </div>

      <div className={classes.footer}>
        <button 
          onClick={()=>setIsLike((prev=>!prev))}
          className={classes.likeButton}
        >
          {
            isLike ? <AiFillHeart /> : <AiOutlineHeart/>
          }
        </button>
        <p>{price}원</p>
        <button className={classes.chatButton}>
         채팅하기
        </button>
      </div>
    </section>
  );
}

export default ProductDetail;
