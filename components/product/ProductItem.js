import { useRouter } from 'next/router';
import { useState } from 'react';
import {AiOutlineHeart , AiFillHeart} from 'react-icons/ai'
import classes from './ProductItem.module.css';

function ProductItem(props) {
  const router = useRouter();

  const [isLike,setIsLike] = useState(false);

  function ClickLikeButton(e){
    e.stopPropagation();
    setIsLike((prev=>!prev));

  }

  function showDetailsHandler() {
    router.push(`${props.section}/${props.id}`)
  }

  let price;

  if (props.price) {
    price = props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const now = Date.now();
  let minutesAgo = Math.round((now - props.time)/ 1000 / 60); 

  if (minutesAgo < 60){
    minutesAgo = `${minutesAgo}분`
  } else if (minutesAgo < 60*24){
    minutesAgo = `${Math.round(minutesAgo/60)}시간`
  } else {
    minutesAgo = `${Math.floor(minutesAgo/60/24)}일`
  }

  return (
    <li className={classes.item} onClick={showDetailsHandler}>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h4>{props.title}</h4>
          <p className={classes.time} >{props.dong} · {minutesAgo} 전</p>
          <p>{price} 원</p>
        </div>
        
        <button 
          onClick={ClickLikeButton}
          className={classes.likeButton}
        >
          {
            isLike ? <AiFillHeart /> : <AiOutlineHeart/>
          }
          0
        </button>
    </li>
  );
}

export default ProductItem;
