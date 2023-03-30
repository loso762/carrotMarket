import { useRouter } from 'next/router';

import classes from './ProductItem.module.css';

function ProductItem(props) {
  const router = useRouter();

  function showDetailsHandler() {
    router.push(`${props.section}/${props.id}`)
  }

  const price = props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const now = Date.now();
  let minutesAgo = Math.round((now - props.time)/ 1000 / 60); 

  if (minutesAgo < 60){
    minutesAgo = `${minutesAgo}분`
  }
  if (minutesAgo > 60){
    minutesAgo = `${Math.round(minutesAgo/60)}시간`
  }

  return (
    <li className={classes.item} onClick={showDetailsHandler}>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h4>{props.title}</h4>
          <p className={classes.time} >{minutesAgo} 전</p>
          <p>{price} 원</p>
        </div>
    </li>
  );
}

export default ProductItem;
