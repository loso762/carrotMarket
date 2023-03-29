import { useRouter } from 'next/router';

import classes from './ProductItem.module.css';

function ProductItem(props) {
  const router = useRouter();

  function showDetailsHandler() {
    router.push('/' + props.id);
  }

  return (
    <li className={classes.item}>
      <div>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <h4>{props.price} 원</h4>
        </div>
        <div className={classes.actions}>
          <button onClick={showDetailsHandler}>자세히</button>
        </div>
      </div>
    </li>
  );
}

export default ProductItem;
