import classes from './ProductList.module.css';
import ProductItem from './ProductItem';

function ProductList({list}) {

  const Productlist = Object.entries(list);

  return (
    <ul className={classes.list}>
      {Productlist.map((Item) => (
        <ProductItem
          key={Item[0]}
          id={Item[0]}
          image={Item[1].img}
          title={Item[1].title}
          price={Item[1].price}
        />
      ))}
    </ul>
  );
}

export default ProductList;
